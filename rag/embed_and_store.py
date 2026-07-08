"""Embed corpus/chunks.jsonl with Qwen3-Embedding-0.6B and upsert into Postgres/pgvector."""

import json
from pathlib import Path

import psycopg
from pgvector.psycopg import register_vector
from sentence_transformers import SentenceTransformer

CHUNKS_PATH = Path("corpus/chunks.jsonl")
EMBEDDING_MODEL = "Qwen/Qwen3-Embedding-0.6B"
EMBEDDING_DIM = 1024
DB_DSN = "postgresql://rag:rag@localhost:5433/rag"
BATCH_SIZE = 32


def load_chunks():
    with open(CHUNKS_PATH, encoding="utf-8") as f:
        return [json.loads(line) for line in f]


def main():
    chunks = load_chunks()
    print(f"Loaded {len(chunks)} chunks from {CHUNKS_PATH}")

    model = SentenceTransformer(EMBEDDING_MODEL, truncate_dim=EMBEDDING_DIM)
    texts = [c["text"] for c in chunks]
    embeddings = model.encode(
        texts,
        batch_size=BATCH_SIZE,
        show_progress_bar=True,
        normalize_embeddings=True,
    )

    with psycopg.connect(DB_DSN) as conn:
        register_vector(conn)
        with conn.cursor() as cur:
            # chunk ids are just positional counters reassigned on every corpus
            # rebuild, so a stale table can't be reconciled via upsert alone -
            # wipe and reload fully each run instead.
            cur.execute("TRUNCATE TABLE chunks")
            for chunk, embedding in zip(chunks, embeddings):
                cur.execute(
                    """
                    INSERT INTO chunks (id, source, text, headings, pages, embedding)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (
                        chunk["id"],
                        chunk["source"],
                        chunk["text"],
                        chunk["headings"],
                        chunk["pages"],
                        embedding,
                    ),
                )
        conn.commit()

    print(f"Loaded {len(chunks)} chunks into Postgres.")


if __name__ == "__main__":
    main()
