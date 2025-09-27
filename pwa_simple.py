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
import gradio as gr

load_dotenv()

class SimpleMemory:
    """Простая память для хранения сообщений"""
    def __init__(self):
        self.messages = {}
    
    def add_message(self, user_id, role, content):
        if user_id not in self.messages:
            self.messages[user_id] = []
        self.messages[user_id].append({
            "role": role,
            "content": content,
            "timestamp": time.time()
        })
        # Ограничиваем историю 50 сообщениями
        if len(self.messages[user_id]) > 50:
            self.messages[user_id] = self.messages[user_id][-50:]
    
    def get_context(self, user_id):
        return self.messages.get(user_id, [])

# Инициализация
memory = SimpleMemory()

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
                        
                        return {
                            "message": assistant_message,
                            "context_used": len(context) if context else 0
                        }
                    else:
                        error_text = await response.text()
                        raise Exception(f"Ошибка API: {response.status}, {error_text}")
                        
        except Exception as e:
            return {
                "message": f"Извините, произошла ошибка: {str(e)}",
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
    total_messages = sum(len(msgs) for msgs in memory.messages.values())
    return f"🤖 GigaMind Mobile PWA готов!\n💬 Общих сообщений: {total_messages}\n📱 Версия: 1.0"

# PWA-оптимизированный интерфейс
with gr.Blocks(
    title="🤖 GigaMind Mobile",
    theme=gr.themes.Soft(),
    css="""
    /* Мобильная оптимизация */
    .gradio-container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 8px !important;
    }
    
    .chat-container {
        height: 60vh !important;
        min-height: 400px !important;
    }
    
    .input-container {
        position: sticky !important;
        bottom: 0 !important;
        background: white !important;
        padding: 8px 0 !important;
        box-shadow: 0 -2px 8px rgba(0,0,0,0.1) !important;
    }
    
    /* Кнопки */
    .btn {
        min-height: 40px !important;
        padding: 8px 12px !important;
        font-size: 14px !important;
    }
    
    /* Ввод сообщения */
    .msg-input textarea {
        font-size: 16px !important;
        padding: 12px !important;
    }
    
    /* Мобильная адаптация */
    @media (max-width: 768px) {
        .gradio-container {
            padding: 4px !important;
        }
        .chat-container {
            height: 65vh !important;
        }
        .btn {
            min-height: 44px !important;
            font-size: 16px !important;
        }
    }
    
    /* Пузыри чата */
    .message.user {
        background: #007bff !important;
        color: white !important;
        margin-left: 20% !important;
    }
    
    .message.bot {
        background: #f8f9fa !important;
        margin-right: 20% !important;
    }
    """,
    head="""
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="theme-color" content="#667eea">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="GigaMind">
    <link rel="manifest" href="/static/manifest.json">
    <link rel="apple-touch-icon" href="/static/icon-192.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/static/icon-192.png">
    """
) as demo:
    
    # Заголовок
    with gr.Row():
        gr.Markdown("# 🤖 GigaMind Mobile\n### Ваш AI-помощник", elem_classes=["header"])
    
    # Статус
    with gr.Row():
        status_display = gr.Textbox(
            value=get_status(),
            label="📊 Статус",
            interactive=False,
            max_lines=3,
            scale=3
        )
        refresh_btn = gr.Button("🔄", variant="secondary", scale=1, elem_classes=["btn"])
    
    # Чат
    chatbot = gr.Chatbot(
        label="💬 Чат с GigaMind",
        height=400,
        elem_classes=["chat-container"],
        avatar_images=("🙋‍♂️", "🤖"),
        show_copy_button=True,
        type="tuples"
    )
    
    # Ввод сообщения
    with gr.Row(elem_classes=["input-container"]):
        with gr.Column(scale=6):
            msg_input = gr.Textbox(
                label="",
                placeholder="💬 Напишите сообщение...",
                lines=1,
                max_lines=4,
                container=False,
                elem_classes=["msg-input"]
            )
        with gr.Column(scale=1, min_width=50):
            send_btn = gr.Button("📤", variant="primary", elem_classes=["btn"])
            clear_btn = gr.Button("🗑️", variant="secondary", elem_classes=["btn"])
    
    # PWA инструкции
    with gr.Row():
        gr.Markdown("""
        ### 📱 Установка на телефон:
        1. **Android**: Меню → "Добавить на главный экран"
        2. **iOS**: Поделиться → "На экран Домой"
        3. **Desktop**: Адресная строка → "Установить приложение"
        """, elem_classes=["install-info"])
    
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
    print("📱 Локально: http://localhost:7860")
    print("🌐 В сети: http://<ваш_IP>:7860")
    print("💡 После установки как PWA - работает как нативное приложение!")
    
    demo.launch(
        server_name="0.0.0.0",  # Доступ с любых устройств
        server_port=7860,
        share=False,
        show_api=False,
        show_error=True,
        quiet=False,
        allowed_paths=["/home/germannm/Документы/gigamind/static"]  # Для статических файлов
    )
