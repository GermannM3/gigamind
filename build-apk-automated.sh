#!/bin/bash

# Скрипт для автоматической сборки APK GigaMind Mobile

echo "🚀 Начинаем сборку GigaMind Mobile APK..."

# Переходим в папку проекта
cd /home/germannm/Документы/gigamind/GigaMindMobile

# Проверяем, установлен ли Android SDK
if [ ! -d "/home/germannm/android-sdk" ]; then
    echo "❌ Android SDK не найден"
    exit 1
fi

# Проверяем, есть ли файл лицензии
if [ ! -f "/home/germannm/android-sdk/licenses/android-sdk-license" ]; then
    echo "❌ Файл лицензии Android SDK не найден"
    echo "Попробуем создать его вручную..."
    
    # Создаем папку для лицензий
    mkdir -p /home/germannm/android-sdk/licenses
    
    # Создаем файл лицензии (это тестовый подход)
    echo "8933bad161af4178b1185d1a37fbf41ea5269c55" > /home/germannm/android-sdk/licenses/android-sdk-license
    echo "d56f5187479451eabf01fb78af6dfcb131a6481e" >> /home/germannm/android-sdk/licenses/android-sdk-license
    echo "24333f8a63b6825ea9c5514f83c2829b004d1fee" >> /home/germannm/android-sdk/licenses/android-sdk-license
fi

# Переходим в папку android
cd android

# Собираем APK
echo "🔨 Сборка APK..."
./gradlew assembleRelease

# Проверяем, успешно ли прошла сборка
if [ $? -eq 0 ]; then
    echo "✅ APK успешно собран!"
    
    # Создаем папку для релиза, если её нет
    mkdir -p ../build/outputs/apk/release
    
    # Копируем APK в папку релиза
    cp app/build/outputs/apk/release/app-release.apk ../build/outputs/apk/release/GigaMind-release.apk
    
    echo "📁 APK находится в: /home/germannm/Документы/gigamind/GigaMindMobile/build/outputs/apk/release/GigaMind-release.apk"
    
    # Выводим размер файла
    du -h ../build/outputs/apk/release/GigaMind-release.apk
    
    echo "🎉 Сборка завершена успешно!"
else
    echo "❌ Ошибка при сборке APK"
    echo "Пробуем собрать debug версию..."
    ./gradlew assembleDebug
    
    if [ $? -eq 0 ]; then
        echo "✅ Debug APK успешно собран!"
        
        # Создаем папку для релиза, если её нет
        mkdir -p ../build/outputs/apk/debug
        
        # Копируем APK в папку релиза
        cp app/build/outputs/apk/debug/app-debug.apk ../build/outputs/apk/debug/GigaMind-debug.apk
        
        echo "📁 Debug APK находится в: /home/germannm/Документы/gigamind/GigaMindMobile/build/outputs/apk/debug/GigaMind-debug.apk"
        
        # Выводим размер файла
        du -h ../build/outputs/apk/debug/GigaMind-debug.apk
        
        echo "⚠️  Собрана debug версия APK"
    else
        echo "❌ Ошибка при сборке debug APK"
        exit 1
    fi
fi