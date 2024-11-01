# First stage: Base environment for main backend app
FROM python:3.9 AS backend-base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ app/
EXPOSE 8000

# Second stage: Install and configure chromadb
FROM python:3.8-slim AS chromadb-server
WORKDIR /app
RUN pip install chromadb
RUN mkdir -p /chromadb && cp -r /usr/local/lib/python3.8/site-packages /chromadb
EXPOSE 8000

FROM backend-base AS final
COPY --from=chromadb-server /chromadb /usr/local/lib/python3.8/site-packages

CMD ["sh", "-c", "python3.8 -m chromadb run --host 0.0.0.0 --port 8000 & python3.9 app/main.py"]
