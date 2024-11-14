import streamlit as st
import ollama
import time
import faiss
import numpy as np
import chromadb

st.set_page_config(page_title="PC Doc - Cyber Sec Assistant")

with st.sidebar:
    st.title('PC Doc - Cyber Sec Assistant')
    st.write('This chatbot is connected to the local Ollama model.')
    st.success('Ollama model is configured!', icon='✅')
    st.subheader('Models and parameters')
    selected_model = st.selectbox('Choose a model', ['Llama3-7B', 'Mistral-7B'], key='selected_model')
    models = {"Llama3-7B": 'llama3', "Mistral-7B": "mistral"}    
    embedmodel = "nomic-embed-text"
    mainmodel = models[selected_model]
    response_time_placeholder = st.empty() 

    complexity = st.slider('Select complexity level', min_value=1, max_value=5, value=3, step=1)
    
    def clear_chat_history():
        st.session_state.messages = [{"role": "assistant", "content": "How may I assist you today?"}]
    st.sidebar.button('Clear Chat History', on_click=clear_chat_history)

if "messages" not in st.session_state.keys():
    st.session_state.messages = [{"role": "assistant", "content": "How may I assist you today?"}]

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])



chroma = chromadb.PersistentClient(path="./chromadb")
collection_name = "cybersecurity_docs"
collection = chroma.get_or_create_collection(name=collection_name)


documents = collection.get(where={}) 
documents = collection.get(where={}, include=['embeddings', 'documents', 'metadatas'])
embeddings = documents['embeddings']
 
collection_vectors = np.array(embeddings)
faiss_index = faiss.IndexFlatL2(collection_vectors.shape[1])  # Euclidean distance
faiss_index.add(collection_vectors)


def ann_search(query, top_k=5):
    if isinstance(query, str):
        query_embedding = ollama.embeddings(model="nomic-embed-text", prompt=query)['embedding']
        query_np = np.array([query_embedding])
        _, indices = faiss_index.search(query_np, top_k)

        print(f"Indices returned: {indices}")
        print(f"Number of documents: {len(documents)}")
        print(f"Number of vectors in FAISS: {collection_vectors.shape[0]}")

        relevant_docs = []
        for idx in indices[0]:
            if idx < len(documents): 
                relevant_docs.append(documents[idx])
            else:
                print(f"Index {idx} is out of range.")
        return relevant_docs
    else:
        raise TypeError("Query should be a string.")

def jaccard_similarity(set1, set2):
    intersection = set1.intersection(set2)
    union = set1.union(set2)
    return len(intersection) / len(union) if union else 0

def jaccard_search(query, top_k=5):
    query_tokens = set(query.lower().split())
    doc_similarities = []
    for idx, document in enumerate(documents['documents']):
        document_tokens = set(document.lower().split())
        similarity = jaccard_similarity(query_tokens, document_tokens)
        doc_similarities.append((similarity, idx))
    top_k_docs = sorted(doc_similarities, key=lambda x: x[0], reverse=True)[:top_k]
    relevant_docs = [documents['documents'][idx] for _, idx in top_k_docs]
    return relevant_docs

def generate_response(prompt_input):    
    queryembed = ollama.embeddings(model=embedmodel, prompt=prompt_input)['embedding']
    #relevantdocs = ann_search(prompt_input) # ANN using FAISS
    #relevantdocs = jaccard_search(prompt_input) 
    relevantdocs = collection.query(query_embeddings=[queryembed], n_results=5)["documents"][0]
    print(relevantdocs)
    docs = "\n\n".join(relevantdocs)


    modelquery = f"""

    You are a cybersecurity assistant. Based only on the following context, carefully read and analyze each part 
    of the context before determining which single type of cyber attack the user might be facing based on their query.

    Context: {docs}

    ---
    Complexity Level: {complexity} (1=Basic, 5=Detailed)
    
    Given the above context, what type of cyber attack may have occurred based on the problem described in the query: '{prompt_input}'?

    After identifying the attack:
    1. Provide a brief description of the attack and explain how it typically operates.
    2. Describe the potential effects or impact this attack has on the victim.
    3. Suggest practical solutions or mitigation steps to resolve or prevent the attack.
    4. Adjust the depth of the whole explanation according to the complexity level ({complexity}).
    

    Important instructions:
    1. Carefully read and analyze all parts of the context to ensure you fully understand the situation before making a decision.
    2. Focus on identifying one primary attack type based on the context and query.
    3. Only mention multiple attacks if the context clearly shows evidence of more than one attack. Otherwise, focus solely on one attack.
    4. If the query or context is not related to cybersecurity, respond with: "The query is not related to a cybersecurity issue, and I cannot provide an answer." and stop the chat, otherwise follow the below.

    """


    start_time = time.time()
    response = ""
    stream = ollama.generate(model=mainmodel, prompt=modelquery, stream=True)

    for chunk in stream:
        if chunk["response"]:
            response += chunk['response']
        elapsed_time = time.time() - start_time
        response_time_placeholder.write(f"Response Time: {elapsed_time:.2f} seconds")
        time.sleep(0.1)  

    return response

if prompt := st.chat_input():
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

if st.session_state.messages[-1]["role"] != "assistant":
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = generate_response(prompt)
            placeholder = st.empty()
            placeholder.markdown(response)
    message = {"role": "assistant", "content": response}
    st.session_state.messages.append(message)