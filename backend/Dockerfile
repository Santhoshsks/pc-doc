# First stage: Base environment for main backend app
FROM python:3.9 AS backend-base
WORKDIR /app
COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ app/
EXPOSE 8000

# Second stage: Install and configure chromadb
FROM python:3.9-slim AS chromadb-server
WORKDIR /app
RUN pip install chromadb
EXPOSE 8001

FROM backend-base AS final

COPY --from=chromadb-server /usr/local/lib/python3.9/site-packages/chromadb /usr/local/lib/python3.9/site-packages/chromadb

# Use python3.9 for both commands
CMD ["sh", "-c", "python3.9 -m chromadb run --host 0.0.0.0 --port 8001 --path chromadb & python3.9 app/main.py"]
