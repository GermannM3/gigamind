@echo off
echo 🚀 Настройка окружения для GigaMind на диск D...

REM Создаем папки на диске D
mkdir "D:\Android" 2>nul
mkdir "D:\Java" 2>nul
mkdir "D:\NodeJS" 2>nul
mkdir "D:\npm-global" 2>nul

REM Устанавливаем переменные окружения
setx JAVA_HOME "D:\Java\jdk-11.0.28.6-hotspot" /M
setx ANDROID_HOME "D:\Android\sdk" /M
setx NODE_PATH "D:\NodeJS" /M
setx NPM_CONFIG_PREFIX "D:\npm-global" /M

REM Обновляем PATH
setx PATH "%PATH%;D:\Java\jdk-11.0.28.6-hotspot\bin;D:\Android\sdk\platform-tools;D:\Android\sdk\tools;D:\npm-global" /M

echo ✅ Переменные окружения настроены!
echo 📁 Java: D:\Java
echo 📁 Android: D:\Android
echo 📁 Node.js: D:\NodeJS
echo 📁 npm: D:\npm-global

echo.
echo 🔄 Перезапустите терминал для применения изменений
pause
