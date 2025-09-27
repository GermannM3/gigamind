#!/bin/bash

# Скрипт для тестирования APK файлов GigaMind

echo "🧠 GigaMind APK Tester"
echo "======================"

# Проверяем наличие APK файлов
echo "📱 Проверка APK файлов:"
if [ -f "GigaMind-release-final.apk" ]; then
    echo "✅ GigaMind-release-final.apk найден ($(du -h GigaMind-release-final.apk | cut -f1))"
else
    echo "❌ GigaMind-release-final.apk не найден"
fi

if [ -f "GigaMind-release-new.apk" ]; then
    echo "✅ GigaMind-release-new.apk найден ($(du -h GigaMind-release-new.apk | cut -f1))"
else
    echo "❌ GigaMind-release-new.apk не найден"
fi

if [ -f "GigaMindMobile/android/app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ app-release.apk найден ($(du -h GigaMindMobile/android/app/build/outputs/apk/release/app-release.apk | cut -f1))"
else
    echo "❌ app-release.apk не найден"
fi

echo ""

# Проверяем подпись APK
echo "🔐 Проверка подписи APK:"
if [ -f "GigaMind-release-final.apk" ]; then
    echo "Проверяем GigaMind-release-final.apk..."
    if /home/germannm/android-sdk/build-tools/36.0.0/apksigner verify GigaMind-release-final.apk > /dev/null 2>&1; then
        echo "✅ APK подписан корректно (apksigner)"
    else
        echo "❌ APK не подписан или подпись неверна"
    fi
fi

echo ""

# Проверяем информацию о APK
echo "📋 Информация о APK:"
if [ -f "GigaMind-release-final.apk" ]; then
    echo "Анализируем GigaMind-release-final.apk..."
    if command -v aapt2 >/dev/null 2>&1; then
        aapt2 dump badging GigaMind-release-final.apk | head -5
    else
        echo "aapt2 не найден, используем file:"
        file GigaMind-release-final.apk
    fi
fi

echo ""

# Проверяем подключение к устройству
echo "📱 Проверка подключения к устройству:"
if command -v adb >/dev/null 2>&1; then
    devices=$(adb devices | grep -v "List of devices" | grep -v "^$" | wc -l)
    if [ $devices -gt 0 ]; then
        echo "✅ Найдено устройств: $devices"
        adb devices
    else
        echo "❌ Устройства не найдены"
        echo "💡 Запустите эмулятор или подключите Android устройство"
    fi
else
    echo "❌ ADB не найден"
fi

echo ""

# Предложения по установке
echo "🚀 Инструкции по установке:"
echo "1. На физическом устройстве:"
echo "   - Скопируйте GigaMind-release-final.apk на устройство"
echo "   - Включите 'Установка из неизвестных источников'"
echo "   - Откройте APK файл"
echo ""
echo "2. Через ADB:"
echo "   adb install GigaMind-release-final.apk"
echo ""
echo "3. На эмуляторе:"
echo "   - Перетащите APK в окно эмулятора"
echo "   - Или используйте: adb install GigaMind-release-final.apk"

echo ""
echo "✅ Тестирование завершено!"
