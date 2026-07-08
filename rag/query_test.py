import psycopg
from pgvector.psycopg import register_vector
from sentence_transformers import SentenceTransformer

print("Enter your query:")
query = input()
model = SentenceTransformer('Qwen/Qwen3-Embedding-0.6B', truncate_dim=1024)
instructed = f'Instruct: Given a question, retrieve relevant passages that answer the question.\nQuery: {query}'
qvec = model.encode([instructed], normalize_embeddings=True)[0]

with psycopg.connect('postgresql://rag:rag@localhost:5433/rag') as conn:
    register_vector(conn)
    with conn.cursor() as cur:
        cur.execute(
            'SELECT id, headings, pages, 1 - (embedding <=> %s) AS score, left(text, 150) '
            'FROM chunks ORDER BY embedding <=> %s LIMIT 5',
            (qvec, qvec),
        )
        for row in cur.fetchall():
            print(row)

