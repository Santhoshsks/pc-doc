import os
import json
import time
import ollama
import chromadb
import json
from typing import Any
from deepeval import evaluate
from deepeval.test_case import LLMTestCase
from deepeval.metrics import (
    AnswerRelevancyMetric,
    FaithfulnessMetric,
    ContextualRelevancyMetric,
    ContextualPrecisionMetric,
    ContextualRecallMetric,
)


chroma = chromadb.PersistentClient(path="./chromadb")
collection_name = "cybersecurity_docs"
collection = chroma.get_or_create_collection(name=collection_name)


documents = collection.get(where={}) 
documents = collection.get(where={}, include=['embeddings', 'documents', 'metadatas'])
embeddings = documents['embeddings']

RESULTS_DIR = "evaluation_results"
os.makedirs(RESULTS_DIR, exist_ok=True)

TEST_CASES = [
    {
        "input": "I’ve noticed that my files are disappearing from my folders, and I can’t find them anywhere. This is very unsettling, and I’m not sure if my system is under attack or if it’s just a glitch.",
        "expected_output": "Ransomware: This type of attack encrypts or deletes files, often demanding payment to restore access."
    }
]


CONFIGURATIONS = [
    {"complexity": 1, "model": "llama3", "search": "cosine", "k": 7},
    {"complexity": 1, "model": "llama3", "search": "jaccard", "k": 15},
    {"complexity": 2, "model": "mistral", "search": "euclidean", "k": 3},
    {"complexity": 5, "model": "llama3", "search": "cosine", "k": 8},
    {"complexity": 3, "model": "llama3", "search": "jaccard", "k": 5},
    {"complexity": 4, "model": "llama3", "search": "euclidean", "k": 10},
    {"complexity": 5, "model": "mistral", "search": "cosine", "k": 2},
    {"complexity": 4, "model": "mistral", "search": "jaccard", "k": 6},
    {"complexity": 5, "model": "llama3", "search": "cosine", "k": 5},
]


METRICS = [
    AnswerRelevancyMetric(),
    FaithfulnessMetric(),
    ContextualRelevancyMetric(),
    ContextualPrecisionMetric(),
    ContextualRecallMetric(),
]

embedmodel = "nomic-embed-text"

def jaccard_search(query, top_k=5):
    query_tokens = set(query.lower().split())
    doc_similarities = []
    for idx, document in enumerate(documents['documents']):
        document_tokens = set(document.lower().split())
        intersection = query_tokens.intersection(query_tokens)
        union = document_tokens.union(document_tokens)
        similarity = len(intersection) / len(union) if union else 0
        doc_similarities.append((similarity, idx))

    top_k_docs = sorted(doc_similarities, key=lambda x: x[0], reverse=True)[:top_k]
    relevant_docs = [documents['documents'][idx] for _, idx in top_k_docs]
    return relevant_docs


def generate_response(prompt_input, complexity, search, mainmodel, k):    
    queryembed = ollama.embeddings(model=embedmodel, prompt=prompt_input)['embedding']
    if search == "jaccard":    
        relevantdocs = jaccard_search(prompt_input,top_k=k) 
    else:
        relevantdocs = collection.query(query_embeddings=[queryembed], n_results=k)["documents"][0]
    print("Searching...")
    docs = "\n\n".join(relevantdocs)
    print("Docs retrieved!\n")
    print(docs)

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

    """

    response = ""
    stream = ollama.generate(model=mainmodel, prompt=modelquery, stream=True)
    for chunk in stream:
        if chunk["response"]:
            response += chunk['response']
    return response, docs



def evaluate_config(config, test_cases, metrics):
    results = []
    for case in test_cases:
        input_query = case["input"]
        expected_output = case["expected_output"]
        
        response, retrieval_context = generate_response(
            prompt_input=input_query, 
            complexity=config['complexity'],
            search=config["search"],
            mainmodel=config["model"],
            k = config["k"]
        )

        test_case = LLMTestCase(
            input=input_query,
            actual_output=response,
            expected_output=expected_output,
            retrieval_context=[retrieval_context],
        )
        
        test_result = evaluate(test_cases=[test_case], metrics=metrics)
        test_result = test_result.dict()['test_results'][0]
        
        result = {
            "config": config,
            "test_case": case,
            "response": response,
            "metrics_data": test_result["metrics_data"]
        }
        
        results.append(result)
    
    return results


all_results = []
for config in CONFIGURATIONS:
    print(f"Evaluating configuration: {config}")
    start_time = time.time()
    config_results = evaluate_config(config, TEST_CASES, METRICS)
    elapsed_time = time.time() - start_time
    print(f"Completed evaluation for config {config} in {elapsed_time:.2f} seconds.")
    all_results.extend(config_results)

    timestamp = time.strftime("%Y%m%d-%H%M%S")

results_file = os.path.join(RESULTS_DIR, f"results_{timestamp}.json")
with open(results_file, "w") as f:
    json.dump(all_results, f, indent=4)

print("All evaluations complete. Results saved.")