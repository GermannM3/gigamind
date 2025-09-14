# 🧠 GigaMind - Персональный AI-ассистент с памятью и саморефлексией

GigaMind - это инновационный AI-ассистент, который объединяет три ключевые функции:
1. **GigaMemory** - Долговременная память пользователя
2. **Human-centered Assistant** - Персонализированный помощник
3. **Agent-as-Judge** - Самооценка и рефлексия

## 🚀 Быстрый старт

### Локальный запуск
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

### Запуск API сервера
1. Установите зависимости (если еще не установлены)
2. Запустите API сервер:
   ```bash
   python main.py api
   ```

3. API будет доступен по адресу: http://127.0.0.1:8000

## 📱 Мобильное приложение

GigaMind также доступен в виде мобильного приложения для Android.

### APK файл

Мобильное приложение успешно собрано и доступно в виде APK файла:

- **Файл**: `GigaMindMobile/build/outputs/apk/release/GigaMind-release.apk`
- **Размер**: ~39 МБ
- **Версия**: 1.0.0

### Установка APK

Вы можете установить APK следующими способами:

1. **На физическом устройстве Android**:
   - Скопируйте файл на устройство
   - Откройте файл и следуйте инструкциям установщика

2. **С помощью ADB**:
   ```bash
   adb install GigaMindMobile/build/outputs/apk/release/GigaMind-release.apk
   ```

3. **На эмуляторе Android**:
   - Запустите эмулятор
   - Перетащите APK файл в окно эмулятора

### Функциональность мобильного приложения

- Чат с AI-ассистентом GigaMind
- Система памяти для сохранения контекста
- Самооценка качества ответов
- Современный интерфейс с градиентами
- Поддержка темной темы
- Анимации и плавные переходы

## 📁 Структура проекта

- `main.py` - Основной файл с логикой приложения и Gradio интерфейсом
- `api.py` - REST API для мобильного клиента и внешних интеграций
- `memory.py` - Система памяти на SQLite + FAISS
- `judge.py` - Система самооценки ответов
- `.env` - Файл с настройками (GigaChat API)
- `requirements-light.txt` - Зависимости проекта
- `GigaMindMobile/` - Мобильное приложение (React Native)

## 🎯 Демо-сценарии

1. Задайте вопрос: "Какой сегодня день?"
2. Спросите: "А что я спрашивал в прошлый раз?"
3. Скажите: "Мне грустно" и получите эмпатичный ответ

## ⚙️ Требования

### Сервер
- Python 3.8+
- 4 ГБ ОЗУ (минимум)
- Доступ в интернет для работы с GigaChat API

### Мобильное приложение
- Android 6.0 (API level 23) или выше
- 2 ГБ RAM
- 50 МБ свободного места
- Доступ в интернет

## 🐳 Docker Deployment

### Автоматическое развертывание (рекомендуется)
1. Склонируйте репозиторий
2. Создайте файл `.env` с вашими данными GigaChat:
   ```env
   GIGACHAT_CLIENT_ID=your_client_id
   GIGACHAT_AUTH_KEY=your_auth_key
   GIGACHAT_ACCESS_TOKEN=your_access_token
   ```
3. Запустите: `docker-compose up -d`

### Timeweb Cloud Apps
1. Подключите репозиторий в панели Timeweb Cloud
2. Выберите "Деплой из Dockerfile"
3. Установите переменные окружения:
   - `GIGACHAT_CLIENT_ID=your_client_id`
   - `GIGACHAT_AUTH_KEY=your_auth_key`
   - `GIGACHAT_ACCESS_TOKEN=your_access_token`
4. Запустите деплой

### Проверка работы
- API: `http://your-server:8000/health`
- Документация API: `http://your-server:8000/docs`
- Chat: `http://your-server:8000` (Gradio интерфейс)

### Тестирование Docker
Для тестирования Docker-контейнера используйте скрипты:
- Linux/Mac: `./test-docker.sh`
- Windows: `test-docker.bat`