"""Minimal HTTP bridge exposing the RAG corpus search to the Swift server.

The embedding model (sentence-transformers/PyTorch) and the pgvector search
have no Swift equivalent, so AssistantService.swift calls this over HTTP the
same way it already calls Ollama. Stdlib-only (no FastAPI/uvicorn) since this
is a single endpoint for internal use.

Usage:
    .venv/bin/python serve.py [--host 0.0.0.0] [--port 8100]
"""

import argparse
import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import psycopg
from pgvector.psycopg import register_vector
from sentence_transformers import SentenceTransformer

EMBEDDING_MODEL = "Qwen/Qwen3-Embedding-0.6B"
EMBEDDING_DIM = 1024
DB_DSN = "postgresql://rag:rag@localhost:5433/rag"
DEFAULT_TOP_K = 5
MAX_TOP_K = 20

# SentenceTransformer.encode() and the shared DB connection aren't safe for
# concurrent use from multiple request-handling threads; this is a low-QPS
# internal tool, so just serialize with a lock rather than pooling.
_lock = threading.Lock()
_model = None
_conn = None


def get_model():
    global _model
    if _model is None:
        print(f"Loading {EMBEDDING_MODEL}...")
        _model = SentenceTransformer(EMBEDDING_MODEL, truncate_dim=EMBEDDING_DIM, device="cpu")
        print("Model loaded.")
    return _model


def get_conn():
    global _conn
    if _conn is None or _conn.closed:
        _conn = psycopg.connect(DB_DSN, autocommit=True)
        register_vector(_conn)
    return _conn


def search(query: str, top_k: int) -> list[dict]:
    model = get_model()
    instructed = f"Instruct: Given a question, retrieve relevant passages that answer the question.\nQuery: {query}"
    qvec = model.encode([instructed], normalize_embeddings=True)[0]

    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute(
            "SELECT source, headings, pages, text, 1 - (embedding <=> %s) AS score "
            "FROM chunks ORDER BY embedding <=> %s LIMIT %s",
            (qvec, qvec, top_k),
        )
        rows = cur.fetchall()

    return [
        {
            "source": source,
            "headings": headings or [],
            "pages": pages or [],
            "text": text,
            "score": float(score),
        }
        for source, headings, pages, text, score in rows
    ]


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            self._send_json(200, {"status": "ok"})
        else:
            self._send_json(404, {"error": "not found"})

    def do_POST(self):
        if self.path != "/search":
            self._send_json(404, {"error": "not found"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length)
            body = json.loads(raw) if raw else {}
        except (ValueError, json.JSONDecodeError):
            self._send_json(400, {"error": "invalid JSON body"})
            return

        query = (body.get("query") or "").strip()
        if not query:
            self._send_json(400, {"error": "missing 'query'"})
            return

        top_k = body.get("top_k", DEFAULT_TOP_K)
        if not isinstance(top_k, int) or top_k <= 0:
            top_k = DEFAULT_TOP_K
        top_k = min(top_k, MAX_TOP_K)

        try:
            with _lock:
                results = search(query, top_k)
        except Exception as error:  # noqa: BLE001 - report to caller, keep server alive
            self._send_json(500, {"error": str(error)})
            return

        self._send_json(200, {"results": results})

    def log_message(self, format, *args):  # noqa: A002 - stdlib signature
        print(f"[rag-serve] {self.address_string()} {format % args}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8100)
    args = parser.parse_args()

    # Load the model eagerly so the first real request isn't slow.
    get_model()
    get_conn()

    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"RAG bridge listening on http://{args.host}:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
