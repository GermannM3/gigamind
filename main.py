import os
import sys
from dotenv import load_dotenv
import requests
import aiohttp
import asyncio
import uuid
import json
import urllib3
import time
# Отключаем предупреждения об SSL для self-signed сертификатов
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
from memory import GigaMemory
from judge import TinyJudge
import gradio as gr
import uvicorn
from fastapi import FastAPI

load_dotenv()

# Инициализация
memory = GigaMemory()
judge = TinyJudge()

class GigaChatAPI:
    def __init__(self):
        self.base_url = "https://gigachat.devices.sberbank.ru/api/v1"
        self.auth_url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
        self.client_id = os.getenv("GIGACHAT_CLIENT_ID")
        self.auth_key = os.getenv("GIGACHAT_AUTH_KEY")
        self.access_token = os.getenv("GIGACHAT_ACCESS_TOKEN")
        self.token_expires_at = None
        
    async def get_access_token(self):
        """Асинхронное получение токена доступа"""
        if self.access_token:
            return self.access_token
            
        if not self.auth_key:
            raise RuntimeError("Не настроены переменные окружения для GigaChat API")
            
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': str(uuid.uuid4()),
            'Authorization': f'Basic {self.auth_key}'
        }
        data = 'scope=GIGACHAT_API_PERS'
        
        try:
            timeout = aiohttp.ClientTimeout(total=10)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(self.auth_url, headers=headers, data=data, ssl=False) as response:
                    if response.status == 200:
                        token_data = await response.json()
                        self.access_token = token_data.get('access_token')
                        self.token_expires_at = token_data.get('expires_at')
                        return self.access_token
                    else:
                        error_text = await response.text()
                        raise RuntimeError(f"Ошибка получения токена: {response.status}, {error_text}")
        except Exception as e:
            raise RuntimeError(f"Ошибка при запросе токена: {e}")
    
    async def ensure_token(self):
        """Проверка и обновление токена при необходимости"""
        current_time = int(time.time() * 1000)
        
        if not self.access_token or (self.token_expires_at and current_time >= self.token_expires_at):
            return await self.get_access_token() is not None
        return True
    
    async def chat_completion(self, messages, model="GigaChat", temperature=0.7):
        """Асинхронная отправка запроса к GigaChat API"""
        if not await self.ensure_token():
            return None
            
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Bearer {self.access_token}'
        }
        
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": 2048
        }
        
        try:
            timeout = aiohttp.ClientTimeout(total=15)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                    ssl=False
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'choices' in data and len(data['choices']) > 0:
                            return data['choices'][0]['message']['content']
                    else:
                        error_text = await response.text()
                        raise RuntimeError(f"Ошибка GigaChat API: {response.status}, {error_text}")
                
        except Exception as e:
            raise RuntimeError(f"Ошибка при запросе к GigaChat: {e}")

# Глобальный экземпляр
gigachat_api = GigaChatAPI()

# Получение токена GigaChat (обратная совместимость)
def get_gigachat_token():
    """Синхронная обертка для получения токена"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(gigachat_api.get_access_token())
    finally:
        loop.close()

# Генерация ответа (обратная совместимость)
def gigachat_generate(prompt, token):
    """Синхронная обертка для генерации"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        messages = [{"role": "user", "content": prompt}]
        return loop.run_until_complete(gigachat_api.chat_completion(messages))
    finally:
        loop.close()

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