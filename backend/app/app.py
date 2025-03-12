from flask import Flask, request, jsonify
import ollama
import chromadb
from flask_cors import CORS
from rank_bm25 import BM25Okapi

app = Flask(__name__)
CORS(app)

chroma_cve = chromadb.PersistentClient(path=r"C:\Users\admin\Downloads\pc-doc\chromadb")
chroma_docs = chromadb.PersistentClient(path=r"C:\Users\admin\Downloads\pc-doc\backend\app\chromadb")

collection1 = chroma_cve.get_collection(name="cybersecurity_docs")
collection2 = chroma_docs.get_collection(name="cybersecurity_docs")
print("ChromaDB collection1 count:", len(collection1.get()["documents"]))
print("ChromaDB collection2 count:", len(collection2.get()["documents"]))
# colbert_model_name = "colbert-ir/colbertv2.0"
# tokenizer = AutoTokenizer.from_pretrained(colbert_model_name)
# colbert = AutoModel.from_pretrained(colbert_model_name).to("cuda" if torch.cuda.is_available() else "cpu")

embed_model = "nomic-embed-text"

all_docs1 = collection1.get(include=["documents", "metadatas"])
bm25_corpus1 = [doc.lower().split() for doc in all_docs1["documents"]]
bm25_1 = BM25Okapi(bm25_corpus1)

all_docs2 = collection2.get(include=["documents", "metadatas"])
bm25_corpus2 = [doc.lower().split() for doc in all_docs2["documents"]]
bm25_2 = BM25Okapi(bm25_corpus2)

chat_history = []

def get_collection_score(query, bm25, collection):
    query_tokens = query.lower().split()
    bm25_scores = bm25.get_scores(query_tokens)
    avg_bm25_score = sum(bm25_scores) / len(bm25_scores) if bm25_scores.size > 0 else 0
    query_embedding = ollama.embeddings(model=embed_model, prompt=query)['embedding']
    chroma_results = collection.query(query_embeddings=[query_embedding], n_results=1)
    chroma_score = chroma_results['distances'][0][0] if chroma_results['distances'] else float('inf')
    return avg_bm25_score, chroma_score

def select_best_collection(query):
    bm25_score1, chroma_score1 = get_collection_score(query, bm25_1, collection1)
    bm25_score2, chroma_score2 = get_collection_score(query, bm25_2, collection2)
    
    score1 = bm25_score1 - chroma_score1  
    score2 = bm25_score2 - chroma_score2
    print("Score1:", score1)
    print("Score2:", score2)
    if score1>score2:
        print("CVE")
    else:
        print("Docs")
    return collection1 if score1 > score2 else collection2

models = {
    "Llama3-7B": 'llama3',
    "Mistral-7B": "mistral"
}
complexity_description = {
    1: "Basic explanations for beginners",
    2: "Simplified technical terms",
    3: "Balanced technical detail",
    4: "Advanced technical concepts",
    5: "Expert-level technical analysis"
}
embedmodel = "nomic-embed-text"

def hybrid_search(query, top_k=10):
    best_collection = select_best_collection(query)
    all_docs = best_collection.get(include=["documents", "metadatas"])
    bm25 = bm25_1 if best_collection == collection1 else bm25_2
    
    query_tokens = query.lower().split()
    bm25_scores = bm25.get_scores(query_tokens)
    top_bm25_indices = sorted(range(len(bm25_scores)), key=lambda i: bm25_scores[i], reverse=True)[:top_k]
    
    bm25_results = [all_docs["documents"][i] for i in top_bm25_indices]
    bm25_metadatas = [all_docs["metadatas"][i] for i in top_bm25_indices]
    
    query_embedding = ollama.embeddings(model=embed_model, prompt=query)['embedding']
    chroma_results = best_collection.query(query_embeddings=[query_embedding], n_results=top_k)
    
    chroma_docs = chroma_results['documents'][0]
    chroma_metadatas = chroma_results['metadatas'][0]
    
    merged_docs = bm25_results + chroma_docs
    merged_metadatas = bm25_metadatas + chroma_metadatas
    
    return merged_docs, merged_metadatas

def search_rag(query, selected_model, complexity=3, top_k=15, rerank_top_n=5):  
    documents, metadatas = hybrid_search(query, top_k)
    mainmodel = models[selected_model]
    top_docs = documents[:rerank_top_n]
    selected_complexity = complexity_description[complexity]
    context = "\n".join(top_docs)
    response = ""
    print(context)
    newcontext = "\n".join(top_docs[:4])
    modelquery = f"""
    Important instructions:
    1. Carefully read and analyze all parts of the provided context and query to ensure you fully understand the situation before making a decision.
    2. For cybersecurity attack-related queries:
       - Focus on identifying one primary attack type based on the context and query.
       - Only mention two or three attacks if the context and query clearly show evidence of more than one attack. Otherwise, focus solely on one attack.
       - Describe the potential effects or impact this attack has on the victim.
       - Suggest practical solutions or mitigation steps to resolve or prevent the attack.
    3. For CVE vulnerability-related queries:
       - Analyze the query and context to identify the most relevant CVE vulnerability.
       - Provide a clear explanation of the vulnerability, its impact, and any known mitigations.
    4. If the query or context is not related to cybersecurity, respond with: 
       "The query is not related to a cybersecurity issue, and I cannot provide an answer." and stop the chat.

    You are a cybersecurity assistant. Given a user query and various pieces of context, your task is to use only the relevant context for your response and
    provide the answer in/as {selected_complexity}
 
    Context:
    {newcontext}

    Query:
    {query}
    
    Conversation History:
    {' '.join(chat_history[-5:])}

    Based on the provided context and query:
    - Identify and describe the primary cybersecurity attack or CVE vulnerability if applicable.
    - Describe the potential effects or impact on the victim.
    - Suggest practical solutions or mitigation steps to resolve or prevent the identified issue in/as {selected_complexity}.
    - If unrelated to cybersecurity, provide a general response or state that the query is not related to cybersecurity.
"""
    print(modelquery)
    stream = ollama.generate(
        model=mainmodel,
        prompt=modelquery,
        stream=True
    )
    
    for chunk in stream:
        if chunk["response"]:
            response += chunk['response']
    
    chat_history.append(f"User: {query}\nAI: {response}")
    
    return response

@app.route('/api/message', methods=['POST'])
def message():
    data = request.json
    user_message = data.get("message")
    print("User message: ",user_message)
    selected_model = data.get('model', 'Llama3-7B')  
    complexity = data.get("complexity", 3)
    top_k = data.get("top_k", 10) 
    response = search_rag(user_message, selected_model, complexity, top_k, rerank_top_n=10)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
