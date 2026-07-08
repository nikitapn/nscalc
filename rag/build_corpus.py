"""Convert PDFs in docs/ into a RAG-ready corpus: full markdown exports plus a chunked JSONL file."""

import json
from pathlib import Path

from docling.document_converter import DocumentConverter
from docling.chunking import HybridChunker
from docling_core.transforms.chunker.tokenizer.huggingface import HuggingFaceTokenizer

DOCS_DIR = Path("docs")
OUT_DIR = Path("corpus")
MARKDOWN_DIR = OUT_DIR / "markdown"
CHUNKS_PATH = OUT_DIR / "chunks.jsonl"

EMBEDDING_MODEL = "Qwen/Qwen3-Embedding-0.6B"
MAX_TOKENS = 512


def convert_doc(source: Path):
    converter = DocumentConverter()
    result = converter.convert(str(source))
    return result.document


def main():
    MARKDOWN_DIR.mkdir(parents=True, exist_ok=True)
    tokenizer = HuggingFaceTokenizer.from_pretrained(
        model_name=EMBEDDING_MODEL, max_tokens=MAX_TOKENS
    )
    chunker = HybridChunker(tokenizer=tokenizer)

    pdf_paths = sorted(DOCS_DIR.glob("*.pdf"))
    if not pdf_paths:
        raise SystemExit(f"No PDFs found in {DOCS_DIR.resolve()}")

    with open(CHUNKS_PATH, "w", encoding="utf-8") as chunks_file:
        chunk_id = 0
        for pdf_path in pdf_paths:
            print(f"Converting {pdf_path.name}...")
            doc = convert_doc(pdf_path)

            md_path = MARKDOWN_DIR / f"{pdf_path.stem}.md"
            md_path.write_text(doc.export_to_markdown(), encoding="utf-8")

            for chunk in chunker.chunk(doc):
                text = chunker.contextualize(chunk)
                page_numbers = sorted(
                    {
                        prov.page_no
                        for item in chunk.meta.doc_items
                        for prov in item.prov
                    }
                )
                headings = chunk.meta.headings or []

                record = {
                    "id": chunk_id,
                    "source": pdf_path.name,
                    "text": text,
                    "headings": headings,
                    "pages": page_numbers,
                }
                chunks_file.write(json.dumps(record, ensure_ascii=False) + "\n")
                chunk_id += 1

            print(f"  -> {md_path}")

    print(f"Wrote chunks to {CHUNKS_PATH}")


if __name__ == "__main__":
    main()
