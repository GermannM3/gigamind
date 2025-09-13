# Инструкция по продолжению работы над GigaMind Mobile на Windows

## Подготовка среды разработки на Windows

### 1. Установка необходимого ПО

#### Node.js и npm
1. Скачайте Node.js с официального сайта: https://nodejs.org/
2. Установите LTS версию (рекомендуется)
3. Проверьте установку:
   ```
   node --version
   npm --version
   ```

#### Java Development Kit 17
1. Скачайте OpenJDK 17 с сайта Adoptium: https://adoptium.net/
2. Установите JDK 17
3. Установите переменные окружения:
   - JAVA_HOME = путь к установленной JDK (например, C:\Program Files\Java\jdk-17.0.8.7-hotspot)
   - Добавьте в PATH: %JAVA_HOME%\bin

#### Android Studio и SDK
1. Скачайте Android Studio: https://developer.android.com/studio
2. Установите Android Studio
3. Во время установки выберите установку Android SDK
4. Откройте Android Studio и настройте SDK:
   - Android SDK Platform 31 или выше
   - Android SDK Build-Tools 31.0.0 или выше
   - Android SDK Platform-Tools

### 2. Клонирование проекта

1. Откройте командную строку или PowerShell
2. Перейдите в нужную папку:
   ```
   cd C:\projects
   ```
3. Клонируйте репозиторий:
   ```
   git clone https://github.com/GermannM3/gigamind.git
   cd gigamind
   ```
4. Переключитесь на ветку mobile:
   ```
   git checkout mobile
   ```

### 3. Установка зависимостей

1. Перейдите в папку проекта:
   ```
   cd GigaMindMobile
   ```
2. Установите зависимости:
   ```
   npm install
   ```
3. Установите дополнительные зависимости:
   ```
   npm install react-native-vector-icons react-native-linear-gradient @react-native-async-storage/async-storage
   ```

### 4. Настройка Android SDK

1. Установите переменные окружения:
   - ANDROID_HOME = путь к Android SDK (обычно C:\Users\[имя_пользователя]\AppData\Local\Android\Sdk)
   - Добавьте в PATH:
     - %ANDROID_HOME%\tools
     - %ANDROID_HOME%\platform-tools
     - %ANDROID_HOME%\build-tools\[версия]

2. Примите лицензии Android SDK:
   ```
   %ANDROID_HOME%\tools\bin\sdkmanager --licenses
   ```

### 5. Сборка APK

1. Перейдите в папку android:
   ```
   cd android
   ```
2. Соберите release APK:
   ```
   .\gradlew assembleRelease
   ```
3. APK будет находиться в:
   `android\app\build\outputs\apk\release\app-release.apk`

### 6. Возможные проблемы и их решения

#### Проблема с JAVA_HOME
- Убедитесь, что переменная JAVA_HOME указывает на папку с JDK, а не JRE
- Проверьте, что в пути нет пробелов или кириллических символов

#### Проблема с Android SDK
- Убедитесь, что все пути к SDK указаны правильно
- Проверьте, что установлены все необходимые компоненты SDK

#### Проблема с Gradle
- Попробуйте очистить кэш Gradle:
  ```
  .\gradlew clean
  ```
- Удалите папку .gradle в домашней директории пользователя

#### Проблема с react-native-vector-icons
- Добавьте в android\app\build.gradle:
  ```gradle
  apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle");
  ```

### 7. Альтернативный способ сборки через Expo

1. Установите Expo CLI:
   ```
   npm install -g eas-cli
   ```
2. Войдите в аккаунт Expo:
   ```
   eas login
   ```
3. Соберите APK через облако:
   ```
   eas build --platform android
   ```

### 8. Тестирование APK

1. Подключите Android устройство к компьютеру через USB
2. Включите режим разработчика на устройстве
3. Установите APK:
   ```
   adb install android\app\build\outputs\apk\release\app-release.apk
   ```

### 9. Полезные команды

- Запуск приложения на подключенном устройстве:
  ```
  npx react-native run-android
  ```
- Запуск Metro bundler:
  ```
  npx react-native start
  ```
- Очистка кэша Metro:
  ```
  npx react-native start --reset-cache
  ```
- Очистка Gradle:
  ```
  cd android
  .\gradlew clean
  ```

### 10. Файлы проекта

- Основная папка: `GigaMindMobile`
- Компоненты: `src/components/`
- Контекст: `src/context/`
- Экраны: `src/screens/`
- Сервисы: `src/services/`

### 11. API конечные точки

- URL: https://germannm3-gigamind-9814.twc1.net
- Health check: /health
- Чат: /chat
- Сообщения: /messages

### 12. Цветовая схема

- Основной градиент: #0b1f4b → #122e78 → #1a4bd9
- Фон сообщений пользователя: #667eea → #764ba2
- Фон сообщений ассистента: #f093fb → #f5576c

Удачи в сборке GigaMind Mobile!