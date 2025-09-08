# GigaMind - Полная документация проекта

## 📱 Мобильное приложение

### Текущее состояние
- **Статус**: APK собран, проблемы с UI исправлены
- **Исправленные проблемы**: 
  - Китайские символы в интерфейсе (иероглифы вместо русских текстов) - ИСПРАВЛЕНО
  - Системная панель Android перекрывает чат (нужен fullscreen режим) - ИСПРАВЛЕНО
  - Изменения в коде не применяются в APK - ИСПРАВЛЕНО

### Технические детали
- **Платформа**: React Native 0.81.1
- **Язык**: JavaScript/TypeScript
- **Стиль**: Тёмно-синий градиент (#0b1f4b → #122e78 → #1a4bd9)
- **Иконка**: Сгенерирована (мозг с нейронной сетью, синий градиент)

### Структура проекта
```
GigaMindMobile/
├── src/
│   ├── components/
│   │   ├── MessageBubble.js      # Пузырьки сообщений
│   │   └── MessageInput.js       # Поле ввода
│   ├── context/
│   │   └── AppContext.js         # Глобальное состояние
│   ├── screens/
│   │   └── ChatScreen.js         # Главный экран чата
│   └── services/
│       └── api.js                # API клиент
├── android/
│   └── app/src/main/res/
│       └── mipmap-*/             # Иконки приложения
└── App.tsx                       # Корневой компонент
```

### API подключение
- **Сервер**: `http://germannm3-gigamind-9814.twc1.net:8000`
- **Endpoints**:
  - `POST /chat` - отправка сообщения
  - `GET /messages` - история сообщений
  - `GET /health` - проверка статуса
  - `GET /test` - тестовый endpoint

### Функциональность
- **Чат с ИИ**: Отправка сообщений, получение ответов
- **Память**: Сохранение контекста разговора
- **Саморефлексия**: Оценка качества ответов (1-5)
- **Статус подключения**: Индикатор связи с сервером
- **Анимации**: Плавные переходы и эффекты

### Визуальный дизайн
- **Цветовая схема**: Тёмно-синий градиент
- **Типографика**: Белый текст на тёмном фоне (Roboto для Android)
- **Иконки**: Material Icons (smart-toy, account-circle, send, etc.)
- **Анимации**: Fade-in, scale effects, smooth transitions

## 🖥️ Backend (Сервер)

### Развертывание
- **Платформа**: Timeweb Cloud Apps
- **Домен**: `germannm3-gigamind-9814.twc1.net`
- **IP**: 185.104.114.181 (публичный), 192.168.0.4 (приватный)
- **Порт**: 8000
- **Статус**: ✅ Развернут и работает

### Технологии
- **Backend**: Python FastAPI
- **AI**: GigaChat API (Сбер)
- **Память**: SQLite + FAISS (векторный поиск)
- **UI**: Gradio (веб-интерфейс)
- **Контейнеризация**: Docker

### API Endpoints
```python
# Основные endpoints
GET  /                    # Статус сервера
GET  /health             # Проверка здоровья
GET  /test               # Тестовый endpoint
POST /chat               # Отправка сообщения
GET  /history            # История сообщений
GET  /memory             # Управление памятью
```

### Переменные окружения
```env
GIGACHAT_CLIENT_ID=0ac3bc43-79fb-49cf-86bc-c9c806a8e3d6
GIGACHAT_AUTH_KEY=MGFjM2JjNDMtNzlmYi00OWNmLTg2YmMtYzljODA2YThlM2Q2OmUyMGFlMDJjLTNmMjAtNGE4ZC1iMWE4LTRiMTA1YmI2OGMwZQ==
GIGACHAT_ACCESS_TOKEN=eyJjdHkiOiJqd3QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.aOK9-2zcblRoXqPbLCJB4yIbtC8muMZib9-qVA58lYDhzFNik
```

### Архитектура
```
main.py          # Основная логика (GigaChat, память, judge)
api.py           # FastAPI endpoints
memory.py        # Система памяти (SQLite + FAISS)
judge.py         # Саморефлексия ИИ
requirements.txt # Зависимости Python
Dockerfile       # Контейнер для деплоя
```

## 🔧 Проблемы и решения

### Мобильное приложение
1. **Китайские символы в UI**
   - **Проблема**: В интерфейсе отображались иероглифы вместо русских текстов
   - **Причина**: Отсутствие явного указания шрифтов для кириллицы
   - **Решение**: Добавлены явные указания шрифтов (Roboto для Android) и исправлены настройки Metro

2. **Системная панель перекрывает чат**
   - **Проблема**: Android navigation bar накладывалась на интерфейс
   - **Решение**: Добавлены SafeAreaView и правильные отступы для системной панели

3. **Изменения не применяются**
   - **Проблема**: Код обновлялся, но в APK оставались старые изменения
   - **Решение**: Созданы скрипты для полной очистки кэша (Metro, Gradle, npm)

### Backend
1. **Docker Compose не собирается локально**
   - **Проблема**: Ошибки при сборке контейнера
   - **Статус**: Решено через Timeweb Cloud Apps

## 📋 Инструкции для разработчика

### Важные примечания к сборке (Обновлено 08.09.2025)
- **Требуется Java 17**: Плагин Android Gradle для этого проекта требует **Java 17**. Сборка не удастся с другими версиями.
- **Переменная JAVA_HOME**: Перед запуском сборки необходимо правильно установить переменную окружения `JAVA_HOME`.
- **Проверенный путь для JAVA_HOME**: `C:\ Program Files\Microsoft\jdk-17.0.16.8-hotspot`

### Ручная сборка APK (Проверенный метод)

Следующие шаги были проверены и успешно приводят к созданию APK:

1.  **Очистка проекта (Clean Build):**
    ```bash
    cmd.exe /c "set "JAVA_HOME=C:\ Program Files\Microsoft\jdk-17.0.16.8-hotspot" && cd GigaMindMobile\android && gradlew.bat clean"
    ```

2.  **Установка NPM зависимостей:**
    ```bash
    cmd.exe /c "cd GigaMindMobile && npm install"
    ```

3.  **Сборка APK (Assemble Release):**
    ```bash
    cmd.exe /c "set "JAVA_HOME=C:\ Program Files\Microsoft\jdk-17.0.16.8-hotspot" && cd GigaMindMobile\android && gradlew.bat assembleRelease"
    ```

### Расположение готового файла
Готовый файл `app-release.apk` будет находиться по пути:
`D:\GigaMind\GigaMindMobile\android\app\build\outputs\apk\release\app-release.apk`

### Использование скриптов сборки (может потребовать адаптации)
- `build-apk.bat` - простая сборка APK
- `build-complete.bat` - полная сборка с очисткой кэша
- `clear-cache.bat` - очистка всех кэшей
- `test-server.bat` - тестирование подключения к серверу
**Примечание:** Стандартные скрипты могут не работать, если переменная `JAVA_HOME` не установлена корректно в их среде выполнения. Рекомендуется использовать ручной метод выше.


### Файлы для редактирования
- `src/screens/ChatScreen.js` - главный экран
- `src/components/MessageBubble.js` - пузырьки сообщений
- `src/components/MessageInput.js` - поле ввода
- `src/services/api.js` - API клиент

### Ключевые настройки
- **API URL**: `http://germannm3-gigamind-9814.twc1.net:8000`
- **Цвета**: `#0b1f4b`, `#122e78`, `#1a4bd9`
- **Иконки**: Material Icons
- **Шрифты**: Roboto для Android, System для iOS

## 🎯 Цели проекта

### Краткосрочные
1. ✅ Исправить китайские символы в UI
2. ✅ Реализовать fullscreen режим
3. ✅ Убедиться, что изменения применяются в APK

### Долгосрочные
1. Добавить OTA обновления (CodePush)
2. Публикация в Google Play Store
3. Публикация в Microsoft Store
4. Улучшение UX/UI

## 📞 Контакты и доступы

### Репозиторий
- **GitHub**: `https://github.com/GermannM3/gigamind.git`
- **Ветка**: `main`

### Сервер
- **Домен**: `germannm3-gigamind-9814.twc1.net`
- **Проверка**: `http://germannm3-gigamind-9814.twc1.net:8000/health`

### Разработка
- **Локальная папка**: `D:\GigaMind\GigaMindMobile`
- **APK файл**: `android\app\build\outputs\apk\release\app-release.apk`

## 🔍 Отладка

### Проверка сервера
```bash
curl http://germannm3-gigamind-9814.twc1.net:8000/health
curl http://germannm3-gigamind-9814.twc1.net:8000/test
```

### Логи мобильного приложения
```bash
npx react-native log-android
```

### Очистка кэша
```bash
# Metro кэш
npx react-native start --reset-cache

# Gradle кэш
cd android && .\gradlew clean

# npm кэш
npm start -- --reset-cache
```

---

**Дата создания**: 07.09.2025  
**Версия**: 1.0  
**Статус**: В разработке (UI проблемы)
