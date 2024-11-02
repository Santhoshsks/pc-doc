from flask import Flask, request, jsonify
import ollama
import chromadb
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

chroma = chromadb.PersistentClient(path="./backend/app/chromadb")
collection = chroma.get_or_create_collection("buildragwithpython")

models = {
    "Llama3-7B": 'llama3',
    "Mistral-7B": "mistral"
}
embedmodel = "nomic-embed-text"

def generate_llama2_response(prompt_input, selected_model):
    mainmodel = models[selected_model]
    queryembed = ollama.embeddings(model=embedmodel, prompt=prompt_input)['embedding']
    relevantdocs = collection.query(query_embeddings=[queryembed], n_results=5)["documents"][0]
    print(relevantdocs)
    modelquery = f"""
    Important instructions:
    1. Carefully read and analyze *all parts* of the context to ensure you fully understand the situation before making a decision.
    2. Focus on identifying *one primary attack type* based on the context and query.
    3. Only mention multiple attacks if the context *clearly shows evidence* of more than one attack. Otherwise, *focus solely on one attack*.
    4. If the query or context is *not related to cybersecurity*, respond with: "The query is not related to a cybersecurity issue, and I cannot provide an answer." and stop the chat, otherwise follow the below.

    You are a cybersecurity assistant. Based only on the following context, carefully read and analyze each part 
    of the context before determining which *single* type of cyber attack the user might be facing based on their query.
    {relevantdocs}

    Given the above context, what type of cyber attack may have occurred based on the problem described in the query: '{prompt_input}'?
    
    After identifying the attack:
    1. Provide a brief description of the attack and explain how it typically operates.
    2. Describe the potential effects or impact this attack has on the victim.
    3. Finally, suggest practical solutions or mitigation steps to resolve or prevent the attack.
    """

    response = ""
    stream = ollama.generate(model=mainmodel, prompt=modelquery, stream=True)
    for chunk in stream:
        if chunk["response"]:
            response += chunk['response']

    return response

@app.route('/api/message', methods=['POST'])
def message():
    data = request.json
    user_message = data['message']
    print("User message: ",user_message)
    selected_model = data.get('model', 'Llama3-7B')  
    response = generate_llama2_response(user_message, selected_model)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
