# Инструкция по сборке APK для GigaMind Mobile

## Требования для сборки APK

1. **Java Development Kit (JDK) 17**
   - Установите JDK 17 на вашу систему
   - Убедитесь, что установлены компоненты разработки (javac)

2. **Android SDK**
   - Установите Android SDK с необходимыми компонентами:
     - Android SDK Platform 31 или выше
     - Android SDK Build-Tools 31.0.0 или выше
     - Android SDK Platform-Tools

3. **Node.js и npm**
   - Установите Node.js версии 16 или выше
   - Установите npm версии 8 или выше

4. **React Native CLI**
   - Установите React Native CLI глобально:
     ```
     npm install -g react-native-cli
     ```

## Шаги для сборки APK

1. **Подготовка проекта**
   ```bash
   # Перейдите в папку проекта
   cd GigaMindMobile
   
   # Установите зависимости
   npm install
   
   # Установите дополнительные зависимости
   npm install react-native-vector-icons react-native-linear-gradient @react-native-async-storage/async-storage
   ```

2. **Настройка Android SDK**
   - Установите переменную окружения ANDROID_HOME:
     ```bash
     export ANDROID_HOME=/path/to/your/android/sdk
     export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
     ```

3. **Принятие лицензий Android SDK**
   ```bash
   $ANDROID_HOME/tools/bin/sdkmanager --licenses
   ```

4. **Сборка APK**
   ```bash
   # Перейдите в папку android
   cd android
   
   # Соберите release APK
   ./gradlew assembleRelease
   ```

5. **Расположение APK**
   - Release APK будет находиться в:
     `android/app/build/outputs/apk/release/app-release.apk`

## Альтернативные способы сборки

### Использование Expo
1. Установите Expo CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Войдите в аккаунт Expo:
   ```bash
   eas login
   ```

3. Соберите APK:
   ```bash
   eas build --platform android
   ```

### Использование облачной сборки
1. Зарегистрируйтесь на https://expo.dev
2. Создайте проект в Expo
3. Загрузите исходный код проекта
4. Используйте облачную сборку Expo

## Настройка API
Убедитесь, что в файле `src/services/api.js` указан правильный URL API:
```javascript
// Базовый URL сервера GigaMind
const BASE_URL = 'https://germannm3-gigamind-9814.twc1.net';
```

## Решение возможных проблем

1. **Ошибка компиляции Java**
   - Убедитесь, что установлена Java 17 с компонентами разработки
   - Проверьте переменные окружения JAVA_HOME и PATH

2. **Ошибка лицензий Android SDK**
   - Запустите команду `sdkmanager --licenses` для принятия лицензий

3. **Ошибка с Hermes**
   - Убедитесь, что в файле `android/app/build.gradle` правильно настроена переменная hermesEnabled

4. **Ошибка с react-native-vector-icons**
   - Добавьте настройки шрифтов в `android/app/build.gradle`:
     ```gradle
     apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle");
     ```

## Тестирование APK
После сборки APK вы можете протестировать его на:
1. Физическом Android устройстве
2. Эмуляторе Android (Android Studio)
3. Waydroid (если установлен)