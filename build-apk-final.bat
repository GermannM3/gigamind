@echo off
echo 🚀 Сборка GigaMind APK...

REM Устанавливаем переменные окружения
set JAVA_HOME=D:\Java\jdk-17.0.11.9-hotspot
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
cd GigaMindMobile
npx react-native build-android --mode=release
cd ..

echo.
echo ✅ Сборка завершена!
echo 📱 APK файл: GigaMindMobile\android\app\build\outputs\apk\release\app-release.apk

pause
