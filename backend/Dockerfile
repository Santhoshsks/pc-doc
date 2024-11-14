FROM python:3.9 AS backend-base

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt || exit 1
RUN pip install ollama || exit 1

COPY app/ .

EXPOSE 8000

CMD ["sh", "-c", "ollama serve & python app.py"]
