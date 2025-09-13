#!/bin/bash

# Скрипт для сборки APK GigaMind Mobile с использованием Java 17

echo "🚀 Сборка GigaMind Mobile APK с Java 17..."

# Сохраняем текущие переменные
OLD_JAVA_HOME=$JAVA_HOME
OLD_PATH=$PATH

# Устанавливаем Java 17
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-17.0.16.0.8-alt1.x86_64
export PATH=$JAVA_HOME/bin:$PATH

# Проверяем версию Java
echo "Используемая версия Java:"
java -version

# Обновляем gradle.properties в проекте
cat > /home/germannm/Документы/gigamind/GigaMindMobile/android/gradle.properties << EOF
# Указываем путь к Java 17
org.gradle.java.home=/usr/lib/jvm/java-17-openjdk-17.0.16.0.8-alt1.x86_64

# Дополнительные настройки для Gradle
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
android.useAndroidX=true
android.enableJetifier=true

# Отключаем проверку лицензий (временно)
android.builder.sdkCheck=false

# Включаем Hermes
hermesEnabled=true
EOF

# Переходим в папку проекта
cd /home/germannm/Документы/gigamind/GigaMindMobile/android

# Собираем APK
echo "🔨 Сборка APK..."
./gradlew assembleRelease

# Проверяем, успешно ли прошла сборка
if [ $? -eq 0 ]; then
    echo "✅ APK успешно собран!"
    echo "📁 APK находится в: /home/germannm/Документы/gigamind/GigaMindMobile/android/app/build/outputs/apk/release/app-release.apk"
else
    echo "❌ Ошибка при сборке APK"
    echo "Пробуем собрать debug версию..."
    ./gradlew assembleDebug
    
    if [ $? -eq 0 ]; then
        echo "✅ Debug APK успешно собран!"
        echo "📁 Debug APK находится в: /home/germannm/Документы/gigamind/GigaMindMobile/android/app/build/outputs/apk/debug/app-debug.apk"
    else
        echo "❌ Ошибка при сборке debug APK"
    fi
fi

# Восстанавливаем переменные окружения
export JAVA_HOME=$OLD_JAVA_HOME
export PATH=$OLD_PATH