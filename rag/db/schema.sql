CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS chunks (
    id BIGINT PRIMARY KEY,
    source TEXT NOT NULL,
    text TEXT NOT NULL,
    headings TEXT[],
    pages INT[],
    embedding VECTOR(1024) NOT NULL
);

CREATE INDEX IF NOT EXISTS chunks_source_idx ON chunks (source);

CREATE INDEX IF NOT EXISTS chunks_embedding_hnsw_idx
    ON chunks USING hnsw (embedding vector_cosine_ops);
