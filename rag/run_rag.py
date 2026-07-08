import sys
import psycopg
from pgvector.psycopg import register_vector
from sentence_transformers import SentenceTransformer
from ollama import chat

query = ""

if len(sys.argv) > 1:
    query = sys.argv[1]
else:
    print("Enter your query:")
    query = input()

model = SentenceTransformer('Qwen/Qwen3-Embedding-0.6B', truncate_dim=1024, device='cpu')
instructed = f'Instruct: Given a question, retrieve relevant passages that answer the question.\nQuery: {query}'
qvec = model.encode([instructed], normalize_embeddings=True)[0]
context = ""
with psycopg.connect('postgresql://rag:rag@localhost:5433/rag') as conn:
    register_vector(conn)
    with conn.cursor() as cur:
        cur.execute(
            'SELECT source, headings, pages, text '
            'FROM chunks ORDER BY embedding <=> %s LIMIT 5',
            (qvec,),
        )
        for i, (source, headings, pages, text) in enumerate(cur.fetchall(), start=1):
            heading = headings[0] if headings else None
            if not pages:
                page_ref = ""
            elif len(pages) == 1:
                page_ref = f"p. {pages[0]}"
            else:
                page_ref = f"pp. {pages[0]}-{pages[-1]}"
            label = f"Source: {source}" + (f", {heading}" if heading else "") + (f" ({page_ref})" if page_ref else "")
            context += f"[{i}] {label}\n{text}\n\n"


prompt = (
    "Answer the question using only the context below. Cite passages by their "
    "[n] number.\n\n"
    f"Context:\n{context}"
    f"Question: {query}"
)

print(f"Prompt: {prompt}")

response = chat(model='gemma4', messages=[
  {
    'role': 'user',
    'content': prompt,
  },
])

print(response.message.content)
