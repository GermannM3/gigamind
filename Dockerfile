# Используем официальный Python образ
FROM python:3.9-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    git \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Настройки pip и временного каталога, чтобы избежать ошибок файловой системы при сборке
ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    TMPDIR=/tmp
RUN mkdir -p /tmp && chmod 1777 /tmp

# Копируем файлы зависимостей
COPY requirements.txt .

# Устанавливаем Python зависимости
RUN python -m pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY . .

# Предварительно загружаем модель для эмбеддингов, чтобы избежать этого при запуске
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Создаем директорию для данных
RUN mkdir -p data

# Создаем пользователя для безопасности
RUN useradd -m -u 1000 gigamind && chown -R gigamind:gigamind /app
USER gigamind

# Открываем порт
EXPOSE 8000

# Команда запуска для Timeweb Cloud
CMD ["python", "main.py", "api"]
