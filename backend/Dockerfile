# Gunakan base image Python 3.11 slim yang stabil
FROM python:3.11-slim

# Hindari penulisan bytecode .pyc dan pastikan log langsung muncul di konsol
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instal paket sistem yang dibutuhkan (curl untuk healthcheck, gcc & libpq untuk PostgreSQL jika diperlukan)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Salin daftar dependensi dan instal
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Salin seluruh kode backend
COPY . .

# Port FastAPI
EXPOSE 8000

# Jalankan Uvicorn server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
