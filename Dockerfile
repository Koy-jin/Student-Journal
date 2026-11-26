FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py db_worker.py ./
COPY swagger_docks ./swagger_docks

EXPOSE 8000
CMD ["python", "app.py"]