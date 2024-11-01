import streamlit as st
import ollama
import chromadb
from utils import getconfig

embedmodel = getconfig()["embedmodel"]
mainmodel = getconfig()["mainmodel"]
chroma = chromadb.HttpClient(host="localhost", port=8000)
collection = chroma.get_or_create_collection("buildragwithpython")

st.title("Cybersecurity Chatbot")
st.write("This chatbot analyzes text input to identify potential cybersecurity threats.")

user_query = st.text_input("Describe the problem you're facing", "")

if st.button("Analyze"):
    if user_query:
        queryembed = ollama.embeddings(model=embedmodel, prompt=user_query)['embedding']

        relevant_docs = collection.query(query_embeddings=[queryembed], n_results=5)["documents"][0]
        
        st.subheader("Relevant Documents")
        docs = "\n\n".join(relevant_docs)
        st.text_area("Documents", docs, height=300)

        model_query = f"""
        You are a cybersecurity assistant. Based only on the following context, determine which type of attack the user might be facing.

        Context:
        {docs}

        ---

        Given the above context, what type of cyber attack may have occurred based on the problem described: '{user_query}'?
        """

        st.subheader("Chatbot Response")
        
        response_text = ""
        stream = ollama.generate(model=mainmodel, prompt=model_query, stream=True)
        
        for chunk in stream:
            if chunk["response"]:
                response_text += chunk['response']
                st.text(response_text)  

    else:
        st.warning("Please enter a problem description.")