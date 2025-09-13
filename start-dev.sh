#!/bin/bash

# Скрипт для запуска GigaMind Mobile в режиме разработки

echo "🚀 Запуск GigaMind Mobile в режиме разработки..."

# Переходим в папку проекта
cd /home/germannm/Документы/gigamind/GigaMindMobile

# Проверяем, установлены ли зависимости
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
fi

# Запускаем Metro bundler в фоновом режиме
echo "📡 Запуск Metro bundler..."
npx react-native start &

# Ждем немного, чтобы Metro bundler запустился
sleep 5

echo "✅ Metro bundler запущен"
echo "📱 Теперь вы можете запустить приложение на устройстве или эмуляторе:"
echo "   Для Android: npx react-native run-android"
echo "   Для iOS: npx react-native run-ios"
echo ""
echo "💡 Для остановки Metro bundler нажмите Ctrl+C"