#!/usr/bin/env python3
"""
Скрипт проверки готовности проекта к деплою на timeweb.cloud
"""
import os
import sys
import requests
from pathlib import Path

def check_files():
    """Проверяем наличие необходимых файлов"""
    required_files = [
        'main.py',
        'api.py', 
        'memory.py',
        'judge.py',
        'requirements.txt',
        'Dockerfile',
        'docker-compose.yml',
        'timeweb-app.yaml'
    ]
    
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Отсутствуют файлы: {', '.join(missing_files)}")
        return False
    else:
        print("✅ Все необходимые файлы присутствуют")
        return True

def check_env():
    """Проверяем переменные окружения"""
    from dotenv import load_dotenv
    load_dotenv()
    
    gigachat_token = os.getenv("GIGACHAT_ACCESS_TOKEN")
    gigachat_auth = os.getenv("GIGACHAT_AUTH_KEY")
    
    if not gigachat_token and not gigachat_auth:
        print("❌ Не настроены переменные окружения для GigaChat API")
        print("   Установите GIGACHAT_ACCESS_TOKEN или GIGACHAT_AUTH_KEY")
        return False
    else:
        print("✅ Переменные окружения для GigaChat настроены")
        return True

def check_dependencies():
    """Проверяем установку зависимостей"""
    try:
        import fastapi
        import uvicorn
        import sentence_transformers
        import faiss
        print("✅ Основные зависимости установлены")
        return True
    except ImportError as e:
        print(f"❌ Отсутствуют зависимости: {e}")
        return False

def test_api():
    """Тестируем API локально"""
    try:
        # Запускаем импорт для проверки
        from api import app
        print("✅ API модуль загружается корректно")
        return True
    except Exception as e:
        print(f"❌ Ошибка загрузки API: {e}")
        return False

def main():
    print("🔍 Проверка готовности к деплою на timeweb.cloud\n")
    
    checks = [
        ("Файлы проекта", check_files),
        ("Переменные окружения", check_env), 
        ("Зависимости Python", check_dependencies),
        ("API модуль", test_api)
    ]
    
    all_passed = True
    for name, check_func in checks:
        print(f"Проверка: {name}")
        if not check_func():
            all_passed = False
        print()
    
    if all_passed:
        print("🎉 Проект готов к деплою!")
        print("\n📋 Настройки для timeweb.cloud:")
        print("Окружение: Python")
        print("Фреймворк: FastAPI") 
        print("Команда сборки: pip install -r requirements.txt")
        print("Команда запуска: python main.py api")
    else:
        print("❌ Проект не готов к деплою. Исправьте ошибки выше.")
        sys.exit(1)

if __name__ == "__main__":
    main()