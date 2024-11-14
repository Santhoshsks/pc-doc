import os
import time
import ollama
import chromadb
from langchain_community.document_loaders import PyPDFLoader  

chroma = chromadb.PersistentClient(path=r"backend\app\chromadb")
collection_name = "cybersecurity_docs"
collection = chroma.get_or_create_collection(name=collection_name)

embed_model = "nomic-embed-text"
pdf_folder = r"backend\app\sources"
TOKEN_THRESHOLD = 200

def split_into_chunks(text, token_limit):
    words = text.split()
    return [' '.join(words[i:i + token_limit]) for i in range(0, len(words), token_limit)]

start_time = time.time()

for filename in os.listdir(pdf_folder):
    if filename.endswith(".pdf"):
        pdf_path = os.path.join(pdf_folder, filename)
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        
        for doc in documents:
            text = doc.page_content
            chunks = split_into_chunks(text, TOKEN_THRESHOLD) if len(text.split()) > TOKEN_THRESHOLD else [text]
            
            for idx, chunk in enumerate(chunks):
                chunk_id = f"{filename}_chunk_{idx}"
                embedding = ollama.embeddings(model=embed_model, prompt=chunk)['embedding']
                collection.add(
                    ids=[chunk_id], 
                    documents=[chunk], 
                    embeddings=[embedding], 
                    metadatas={"source": filename, "chunk_idx": idx}
                )

print("Document upload and embedding complete.")
print("--- %s seconds ---" % (time.time() - start_time))
