from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn
import os
import json
from datetime import datetime

# Импортируем существующие компоненты
from main import get_gigachat_token, gigachat_generate, memory, judge
import gradio as gr
from main import demo as gradio_demo

app = FastAPI(title="GigaMind API", description="API для мобильного клиента GigaMind", version="1.0.0")

# Монтируем веб‑интерфейс Gradio на /ui
try:
    app = gr.mount_gradio_app(app, gradio_demo, path="/ui")
except Exception:
    # Если по какой-то причине Gradio недоступен, не падаем
    pass

# Модели данных
class Message(BaseModel):
    id: Optional[int] = None
    role: str  # "user" или "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)
    judge_score: Optional[float] = None
    judge_feedback: Optional[str] = None

class ChatRequest(BaseModel):
    user_id: str = "mobile_user"
    message: str

class ChatResponse(BaseModel):
    message: Message
    context_used: bool

# Хранилище сообщений (в реальном приложении используйте БД)
messages: List[Message] = []

@app.get("/")
async def root():
    return {
        "message": "GigaMind API сервер запущен", 
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/messages")
async def get_messages(limit: int = 50):
    """Получить историю сообщений"""
    return {"messages": messages[-limit:]}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Отправить сообщение и получить ответ"""
    try:
        # Сохраняем сообщение пользователя
        user_message = Message(
            role="user",
            content=request.message
        )
        messages.append(user_message)
        
        # Получаем токен GigaChat
        token = get_gigachat_token()
        
        # Поиск в памяти
        context = memory.search_memory(request.message)
        context_str = " | ".join([f"Ранее: {q} → {r}" for _, q, r, _ in context]) if context else "Нет контекста"
        context_used = len(context) > 0
        
        # Формируем промпт с контекстом
        full_prompt = f"""
        Контекст из прошлых разговоров: {context_str}
        Текущий запрос: {request.message}
        Ответь кратко, дружелюбно и персонализированно.
        """
        
        # Генерация ответа
        response_content = gigachat_generate(full_prompt, token)
        
        # Сохраняем в память
        memory.add_memory(request.user_id, request.message, response_content, tags="")
        
        # Оцениваем судьёй
        score, feedback = judge.evaluate(request.message, response_content, context_str)
        
        # Создаем сообщение ассистента
        assistant_message = Message(
            role="assistant",
            content=response_content,
            judge_score=score,
            judge_feedback=feedback
        )
        messages.append(assistant_message)
        
        return ChatResponse(
            message=assistant_message,
            context_used=context_used
        )
        
    except Exception as e:
        # Возвращаем человекочитаемую ошибку
        raise HTTPException(status_code=500, detail=f"Ошибка GigaChat: {str(e)}. Проверьте переменные окружения GIGACHAT_ACCESS_TOKEN / GIGACHAT_AUTH_KEY и доступность API.")

@app.delete("/messages")
async def clear_messages():
    """Очистить историю сообщений"""
    global messages
    messages = []
    return {"message": "История сообщений очищена"}

@app.get("/health")
async def health_check():
    """Проверка состояния сервера"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "message_count": len(messages)
    }

@app.get("/test")
async def test_endpoint():
    """Простой тестовый endpoint"""
    return {
        "message": "Тест успешен!",
        "server": "GigaMind",
        "timestamp": datetime.now().isoformat(),
        "gigachat_configured": bool(os.getenv("GIGACHAT_ACCESS_TOKEN") or os.getenv("GIGACHAT_AUTH_KEY")),
        "prefer_oauth": bool(os.getenv("GIGACHAT_AUTH_KEY"))
    }

@app.get("/gigachat/check")
async def gigachat_check():
    """Проверка получения токена GigaChat и пробный колл без коммитов в память."""
    try:
        token = get_gigachat_token()
        # Пробный короткий запрос
        content = gigachat_generate("Скажи 'Проверка связи'.", token)
        return {"ok": True, "sample": content[:100]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GigaChat check failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)