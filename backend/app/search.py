import ollama, chromadb
from utils import getconfig

embedmodel = getconfig()["embedmodel"]
mainmodel = getconfig()["mainmodel"]
chroma = chromadb.HttpClient(host="localhost", port=8000)
collection = chroma.get_or_create_collection("buildragwithpython")

query = input("input: ")
queryembed = ollama.embeddings(model=embedmodel, prompt=query)['embedding']


relevantdocs = collection.query(query_embeddings=[queryembed], n_results=5)["documents"][0]
print(relevantdocs)
docs = "\n\n".join(relevantdocs)
modelquery = f"""You are a cybersecurity assistant. Based only on the following context, determine which type of attack i might be facing.

Context:
{docs}

---

Given the above context, what type of cyber attack may have occurred based on the problem described.If it is clearly identifyable as multiple attacks, then mention all attacks. Use the full context and decide. Also provide viable solutions for me to overcome the attacks.'{query}'"""

modelquery2=f""" 
Analyze the provided context {docs} and the user's problem {query}. 
Identify potential cybersecurity threats or vulnerabilities related to the given context 
that may contribute to the user's issue. Provide solutions, best practices, or recommendations
 to mitigate these threats and address the problem effectively."""

print("\n",modelquery)
stream = ollama.generate(model=mainmodel, prompt=modelquery, stream=True)

for chunk in stream:
  if chunk["response"]:
    print(chunk['response'], end='', flush=True)
