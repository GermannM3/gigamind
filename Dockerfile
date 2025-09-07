# Используем официальный Python образ
FROM python:3.9-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копируем файлы зависимостей
COPY requirements.txt .

# Устанавливаем Python зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY . .

# Создаем директорию для данных
RUN mkdir -p data

# Создаем пользователя для безопасности
RUN useradd -m -u 1000 gigamind && chown -R gigamind:gigamind /app
USER gigamind

# Открываем порт
EXPOSE 8000

# Команда запуска для Timeweb Cloud
CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:8000", "--timeout", "60", "--workers", "1", "--access-logfile", "-", "--error-logfile", "-"]
