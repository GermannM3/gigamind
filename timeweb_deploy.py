#!/usr/bin/env python3
"""
Скрипт для управления деплоями GigaMind на Timeweb Cloud
"""
import os
import sys
from timeweb import Timeweb
from pprint import pprint

# Конфигурация
APP_ID = "gigamind"  # ID приложения в Timeweb Cloud
TIMEWEB_TOKEN = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjFrYnhacFJNQGJSI0tSbE1xS1lqIn0.eyJ1c2VyIjoiZXEwNjA3OCIsInR5cGUiOiJhcGlfa2V5IiwiYXBpX2tleV9pZCI6IjM4ODMxYjFkLWM3ZDUtNDRiYy05MWIwLWE2Y2MxYWM1M2RjZCIsImlhdCI6MTc1NzM1NjEyNX0.ksxqULT4kFQLNrW8teDm__ReBZ3kTMOdL4lCXKfnAXLaLiLh3MRmBwb-xZl4FDJeZJeOHZOmjDHVvWrWZvUxXzQAL72q4dKnAn7HpM1HBv1yryR8aeuFRF5_fGJcj__LDqMsQSGgLH4P2T-_Y8gNqCpVFW4wXs9UNCTii_XL5u4CaA8a25IoJoRPP0dXLFoi4vfzmvTCiQc2hOtR1pKxFtQEKJsXpEmGFgb6s2FfQMWVrFWJpsghkKjSfeBJdqx3cTrGxQptfeR94T2s5LJxy3kMiJRNWOLCVOugspGx4nqaevA_B9PWjlaZAQreFKUVgn-14s_gThNJutLLjRSEi-DdBr3XE4lCG_atU8BKnGT4v9pcja2f4faDl3mfPCYcQCEeUK3gBJo6RZQuUQQzygsyKqzgK9fNMCzj9tOBvfwQ1AFxIWFHzD2E7iJ38EF6D8fjZSX_Csm5UVTc3lymfyVAD2fEntPPPD7o38THax2aeovWykoSHqlBBzRo-DAg"

def get_client():
    """Создать клиент Timeweb"""
    return Timeweb(token=TIMEWEB_TOKEN)

def list_apps():
    """Получить список приложений"""
    client = get_client()
    try:
        response = client.get_apps()
        return response
    except Exception as e:
        print(f"Ошибка при получении списка приложений: {e}")
        return None

def get_app_deploys(app_id, limit=10):
    """Получить список деплоев приложения"""
    client = get_client()
    try:
        response = client.get_app_deploys(app_id, limit=limit)
        return response
    except Exception as e:
        print(f"Ошибка при получении деплоев: {e}")
        return None

def create_deploy(app_id):
    """Создать новый деплой"""
    client = get_client()
    try:
        response = client.create_deploy(app_id)
        return response
    except Exception as e:
        print(f"Ошибка при создании деплоя: {e}")
        return None

def main():
    if len(sys.argv) < 2:
        print("Использование:")
        print("  python timeweb_deploy.py apps - показать список приложений")
        print("  python timeweb_deploy.py status [app_id] - показать статус деплоев")
        print("  python timeweb_deploy.py deploy [app_id] - запустить новый деплой")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "apps":
        print("Получение списка приложений...")
        apps = list_apps()
        if apps:
            print("Список приложений:")
            pprint(apps)
    
    elif command == "status":
        app_id = sys.argv[2] if len(sys.argv) > 2 else APP_ID
        print(f"Получение статуса деплоев для приложения: {app_id}")
        deploys = get_app_deploys(app_id)
        if deploys:
            print("Список деплоев:")
            pprint(deploys)
        
    elif command == "deploy":
        app_id = sys.argv[2] if len(sys.argv) > 2 else APP_ID
        print(f"Запуск нового деплоя для приложения: {app_id}")
        result = create_deploy(app_id)
        if result:
            print("Деплой запущен успешно:")
            pprint(result)
    
    else:
        print(f"Неизвестная команда: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
