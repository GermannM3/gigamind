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
        self.access_token = None
        self.token_expires = 0

    async def get_access_token(self):
        """Получение токена доступа"""
        if self.access_token and time.time() < self.token_expires:
            return self.access_token

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {self.auth_key}",
            "RqUID": str(uuid.uuid4())
        }
        
        data = "scope=GIGACHAT_API_PERS"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.auth_url, 
                    headers=headers, 
                    data=data, 
                    ssl=False,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        token_data = await response.json()
                        self.access_token = token_data["access_token"]
                        self.token_expires = time.time() + token_data["expires_in"] - 60
                        return self.access_token
                    else:
                        error_text = await response.text()
                        raise Exception(f"Ошибка получения токена: {response.status}, {error_text}")
        except Exception as e:
            raise Exception(f"Ошибка подключения к API: {str(e)}")

    async def send_message(self, message, user_id="mobile_user"):
        """Отправка сообщения в GigaChat"""
        try:
            # Получаем токен
            token = await self.get_access_token()
            
            # Получаем контекст из памяти
            context = memory.get_context(user_id)
            
            # Формируем сообщения
            messages = []
            if context:
                for msg in context[-10:]:  # Последние 10 сообщений
                    messages.append({"role": msg["role"], "content": msg["content"]})
            
            messages.append({"role": "user", "content": message})
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}",
                "RqUID": str(uuid.uuid4())
            }
            
            payload = {
                "model": "GigaChat",
                "messages": messages,
                "max_tokens": 2048,
                "temperature": 0.7
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                    ssl=False,
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        assistant_message = data["choices"][0]["message"]["content"]
                        
                        # Сохраняем в память
                        memory.add_message(user_id, "user", message)
                        memory.add_message(user_id, "assistant", assistant_message)
                        
                        # Оценка качества (опционально)
                        try:
                            judge_score = judge.evaluate_response(message, assistant_message)
                            memory.add_judge_score(user_id, judge_score, "Автоматическая оценка")
                        except:
                            judge_score = 7  # Дефолтная оценка
                        
                        return {
                            "message": assistant_message,
                            "judge_score": judge_score,
                            "context_used": len(context) if context else 0
                        }
                    else:
                        error_text = await response.text()
                        raise Exception(f"Ошибка API: {response.status}, {error_text}")
                        
        except Exception as e:
            return {
                "message": f"Извините, произошла ошибка: {str(e)}",
                "judge_score": 0,
                "context_used": 0
            }

# Инициализация API
api = GigaChatAPI()

def chat_interface(message, history):
    """Интерфейс чата для Gradio"""
    if not message.strip():
        return history, ""
    
    # Запуск асинхронной функции
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(api.send_message(message))
        loop.close()
        
        # Добавляем сообщения в историю
        history.append([message, result["message"]])
        return history, ""
    
    except Exception as e:
        history.append([message, f"Ошибка: {str(e)}"])
        return history, ""

def clear_chat():
    """Очистка чата"""
    return [], ""

def get_status():
    """Получение статуса системы"""
    return f"🤖 GigaMind Mobile готов к работе!\n📱 PWA версия\n💾 Сообщений в памяти: {len(memory.messages)}"

# PWA-оптимизированный интерфейс
with gr.Blocks(
    title="🤖 GigaMind Mobile",
    theme=gr.themes.Soft(),
    css="""
    .gradio-container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 10px !important;
    }
    .chat-container {
        height: 60vh !important;
        min-height: 400px !important;
    }
    .input-container {
        position: sticky !important;
        bottom: 0 !important;
        background: white !important;
        padding: 10px 0 !important;
    }
    /* Мобильная оптимизация */
    @media (max-width: 768px) {
        .gradio-container {
            padding: 5px !important;
        }
        .chat-container {
            height: 70vh !important;
        }
    }
    """,
    head="""
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="theme-color" content="#667eea">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="GigaMind">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/icon-192.png">
    """
) as demo:
    
    gr.Markdown("# 🤖 GigaMind Mobile\n### Ваш AI-помощник всегда с вами")
    
    with gr.Row():
        with gr.Column(scale=4):
            status_display = gr.Textbox(
                value=get_status(),
                label="📊 Статус системы",
                interactive=False,
                max_lines=3
            )
        with gr.Column(scale=1):
            refresh_btn = gr.Button("🔄", variant="secondary")
    
    chatbot = gr.Chatbot(
        label="💬 Чат с GigaMind",
        height=400,
        elem_classes=["chat-container"],
        avatar_images=("🙋‍♂️", "🤖"),
        bubble_full_width=False
    )
    
    with gr.Row(elem_classes=["input-container"]):
        with gr.Column(scale=5):
            msg_input = gr.Textbox(
                label="Ваше сообщение",
                placeholder="Напишите сообщение...",
                lines=1,
                max_lines=3,
                container=False
            )
        with gr.Column(scale=1, min_width=60):
            send_btn = gr.Button("📤", variant="primary", size="sm")
            clear_btn = gr.Button("🗑️", variant="secondary", size="sm")
    
    # Обработчики событий
    send_btn.click(
        chat_interface,
        inputs=[msg_input, chatbot],
        outputs=[chatbot, msg_input]
    )
    
    msg_input.submit(
        chat_interface,
        inputs=[msg_input, chatbot],
        outputs=[chatbot, msg_input]
    )
    
    clear_btn.click(
        clear_chat,
        outputs=[chatbot, msg_input]
    )
    
    refresh_btn.click(
        get_status,
        outputs=status_display
    )

if __name__ == "__main__":
    print("🚀 Запуск GigaMind Mobile PWA...")
    print("📱 Откройте в браузере: http://localhost:7860")
    print("💡 Для мобильного доступа: http://<ваш_IP>:7860")
    
    demo.launch(
        server_name="0.0.0.0",  # Доступ с любых устройств
        server_port=7860,
        share=False,  # Отключаем Gradio share для безопасности
        show_api=False,
        show_error=True,
        quiet=False,
        enable_queue=True,
        max_threads=10
    )
