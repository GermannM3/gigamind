@echo off
echo 🚀 Сборка GigaMind APK...

REM Устанавливаем переменные окружения
set JAVA_HOME=D:\Java\jdk-11.0.28.6-hotspot
set ANDROID_HOME=D:\Android\sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%

echo ✅ Переменные окружения установлены
echo 📁 JAVA_HOME: %JAVA_HOME%
echo 📁 ANDROID_HOME: %ANDROID_HOME%

echo.
echo 🔧 Проверка Java...
java -version

echo.
echo 🏗️ Сборка APK...
npx react-native build-android --mode=release

echo.
echo ✅ Сборка завершена!
echo 📱 APK файл: android\app\build\outputs\apk\release\app-release.apk

pause
