import os
import sys
from dotenv import load_dotenv
import requests
import uuid
import json
from memory import GigaMemory
from judge import TinyJudge
import gradio as gr
import uvicorn
from fastapi import FastAPI

load_dotenv()

# Инициализация
memory = GigaMemory()
judge = TinyJudge()

# Получение токена GigaChat (Client Credentials или прямой токен)
def get_gigachat_token():
    """Возвращает токен GigaChat.
    Приоритет: если задан GIGACHAT_AUTH_KEY — всегда получать свежий токен по OAuth.
    Иначе использовать GIGACHAT_ACCESS_TOKEN как есть (может протухать).
    """
    auth_key = os.getenv("GIGACHAT_AUTH_KEY")
    if auth_key:
        url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
        headers = {
            'RqUID': str(uuid.uuid4()),
            'Authorization': f'Basic {auth_key}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        data = {'scope': 'GIGACHAT_API_PERS'}
        response = requests.post(url, headers=headers, data=data, verify=False)
        token = response.json().get('access_token')
        if not token:
            raise RuntimeError("Не удалось получить токен GigaChat по GIGACHAT_AUTH_KEY. Проверьте ключ и доступ.")
        return token

    direct_token = os.getenv("GIGACHAT_ACCESS_TOKEN")
    if direct_token:
        return direct_token

    raise RuntimeError(
        "GigaChat токен не настроен. Установите GIGACHAT_AUTH_KEY (предпочтительно) или GIGACHAT_ACCESS_TOKEN."
    )

# Генерация ответа
def gigachat_generate(prompt, token):
    url = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    client_id = os.getenv("GIGACHAT_CLIENT_ID")
    if client_id:
        headers['X-Client-Id'] = client_id
    payload = {
        "model": "GigaChat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }
    response = requests.post(url, headers=headers, data=json.dumps(payload), verify=False)
    data = response.json()
    # Безопасный разбор ответа
    try:
        choices = data.get('choices') or []
        if not choices:
            raise ValueError(f"Пустой ответ GigaChat: {data}")
        message = choices[0].get('message') or {}
        content = message.get('content')
        if not content:
            raise ValueError(f"Нет контента в ответе GigaChat: {data}")
        return content
    except Exception as parse_err:
        raise RuntimeError(f"Ошибка разбора ответа GigaChat: {parse_err}")

# Основная логика
def respond(user_id, user_input):
    try:
        token = get_gigachat_token()

        # Поиск в памяти
        context = memory.search_memory(user_input)
        context_str = " | ".join([f"Ранее: {q} → {r}" for _, q, r, _ in context]) if context else "Нет контекста"

        # Формируем промпт с контекстом
        full_prompt = f"""
        Контекст из прошлых разговоров: {context_str}
        Текущий запрос: {user_input}
        Ответь кратко, дружелюбно и персонализированно.
        """

        # Генерация
        response = gigachat_generate(full_prompt, token)

        # Сохраняем в память
        memory.add_memory(user_id, user_input, response, tags="")

        # Оцениваем судьёй
        score, feedback = judge.evaluate(user_input, response, context_str)

        # Логируем
        log = f"[ОЦЕНКА СУДЬИ: {score}/5] {feedback}"

        return f"{response}\n\n---\n{log}"
    except Exception as e:
        return f"Произошла ошибка: {str(e)}\nПожалуйста, проверьте настройки подключения к GigaChat API."

# Gradio UI
demo = gr.Interface(
    fn=lambda x: respond("user_123", x),
    inputs=gr.Textbox(lines=2, placeholder="Задай вопрос..."),
    outputs="text",
    title="🧠 GigaMind — ваш AI-ассистент с памятью и саморефлексией",
    description="Работает даже на i5 с 8 ГБ ОЗУ 😉"
)

def run_gradio():
    """Запустить Gradio интерфейс"""
    demo.launch()

def run_api():
    """Запустить API сервер"""
    import api
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("api:app", host=host, port=port, reload=False)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "api":
        run_api()
    else:
        run_gradio()