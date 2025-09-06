# 🧠 GigaMind - Персональный AI-ассистент с памятью и саморефлексией

GigaMind - это инновационный AI-ассистент, который объединяет три ключевые функции:
1. **GigaMemory** - Долговременная память пользователя
2. **Human-centered Assistant** - Персонализированный помощник
3. **Agent-as-Judge** - Самооценка и рефлексия

## 🚀 Быстрый старт

1. Установите зависимости:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac | Windows: venv\Scripts\activate
   pip install -r requirements-light.txt
   ```

2. Запустите приложение:
   ```bash
   python main.py
   ```

3. Откройте в браузере: http://127.0.0.1:7860

## 📁 Структура проекта

- `main.py` - Основной файл с логикой приложения
- `memory.py` - Система памяти на SQLite + FAISS
- `judge.py` - Система самооценки ответов
- `.env` - Файл с настройками (GigaChat API)
- `requirements-light.txt` - Зависимости проекта

## 🎯 Демо-сценарии

1. Задайте вопрос: "Какой сегодня день?"
2. Спросите: "А что я спрашивал в прошлый раз?"
3. Скажите: "Мне грустно" и получите эмпатичный ответ

## ⚙️ Требования

- Python 3.8+
- 4 ГБ ОЗУ (минимум)
- Доступ в интернет для работы с GigaChat API

## 🐳 Docker Deployment

### Автоматическое развертывание (рекомендуется)
1. Склонируйте репозиторий
2. Создайте файл `.env.production` с вашими данными GigaChat
3. Запустите: `docker-compose up -d`

### Переменные окружения
```env
GIGACHAT_CLIENT_ID=your_client_id
GIGACHAT_AUTH_KEY=your_auth_key
GIGACHAT_ACCESS_TOKEN=your_access_token
```

### Проверка работы
- API: `http://your-server:8000/health`
- Chat: `http://your-server:8000` (Gradio интерфейс)