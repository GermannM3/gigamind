import os
import sys
from dotenv import load_dotenv
import requests
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
    # Сначала проверяем, есть ли прямой токен
    direct_token = os.getenv("GIGACHAT_ACCESS_TOKEN")
    if direct_token:
        return direct_token
    
    # Если нет прямого токена, получаем через OAuth
    url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
    headers = {
        'RqUID': 'my_unique_id_123',
        'Authorization': f'Basic {os.getenv("GIGACHAT_AUTH_KEY")}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    data = {'scope': 'GIGACHAT_API_PERS'}
    response = requests.post(url, headers=headers, data=data, verify=False)
    return response.json().get('access_token')

# Генерация ответа
def gigachat_generate(prompt, token):
    url = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        "model": "GigaChat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }
    response = requests.post(url, headers=headers, data=json.dumps(payload), verify=False)
    return response.json()['choices'][0]['message']['content']

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
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=False)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "api":
        run_api()
    else:
        run_gradio()