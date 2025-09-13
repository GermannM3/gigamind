#!/bin/bash

# Скрипт для сборки APK GigaMind Mobile с использованием существующих инструментов

echo "🚀 Попытка сборки GigaMind Mobile APK с существующими инструментами..."

# Проверяем, установлены ли необходимые инструменты
if ! command -v aapt &> /dev/null; then
    echo "❌ aapt не найден"
    exit 1
fi

if ! command -v dx &> /dev/null; then
    echo "❌ dx не найден"
    exit 1
fi

# Создаем папки для сборки
mkdir -p /home/germannm/Документы/gigamind/GigaMindMobile/build/outputs/apk/release

# Копируем уже собранные файлы (если есть)
if [ -f "/home/germannm/Документы/gigamind/GigaMindMobile/android/app/build/outputs/apk/release/app-release.apk" ]; then
    cp /home/germannm/Документы/gigamind/GigaMindMobile/android/app/build/outputs/apk/release/app-release.apk \
       /home/germannm/Документы/gigamind/GigaMindMobile/build/outputs/apk/release/GigaMind-release.apk
    echo "✅ APK успешно скопирован!"
    echo "📁 APK находится в: /home/germannm/Документы/gigamind/GigaMindMobile/build/outputs/apk/release/GigaMind-release.apk"
    exit 0
fi

# Проверяем debug версию
if [ -f "/home/germannm/Документы/gigamind/GigaMindMobile/android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    cp /home/germannm/Документы/gigamind/GigaMindMobile/android/app/build/outputs/apk/debug/app-debug.apk \
       /home/germannm/Документы/gigamind/GigaMindMobile/build/outputs/apk/release/GigaMind-debug.apk
    echo "✅ Debug APK успешно скопирован!"
    echo "📁 Debug APK находится в: /home/germannm/Документы/gigamind/GigaMindMobile/build/outputs/apk/release/GigaMind-debug.apk"
    exit 0
fi

echo "❌ Готовые APK файлы не найдены"
echo "Попробуйте выполнить следующие шаги вручную:"
echo "1. Установите java-17-openjdk-devel с помощью sudo"
echo "2. Запустите /home/germannm/Документы/gigamind/build-with-java17.sh снова"