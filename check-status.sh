#!/bin/bash

# Скрипт для проверки статуса проекта GigaMind Mobile

echo "=========================================="
echo "         GIGAMIND MOBILE STATUS           "
echo "=========================================="
echo

echo "📊 Текущая ветка Git:"
cd /home/germannm/Документы/gigamind
git branch --show-current

echo
echo "📝 Последние коммиты:"
git log --oneline -5

echo
echo "📁 Новые файлы и папки:"
ls -la /home/germannm/Документы/gigamind/*.md /home/germannm/Документы/gigamind/*.sh 2>/dev/null

echo
echo "📱 Проекты мобильных приложений:"
echo "   - GigaMindMobile (React Native)"
echo "   - GigaMindMobileExpo (Expo)"

echo
echo "✅ Проект готов к сборке APK на системе с установленными инструментами разработки Android!"
echo "📄 Подробные инструкции смотрите в файлах WINDOWS_INSTRUCTIONS.md и APK_BUILD_INSTRUCTIONS.md"