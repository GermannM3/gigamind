@echo off
REM Simple test script to verify Docker configuration

echo Testing Docker configuration...

REM Test 1: Check if Dockerfile references the correct module
findstr "api:app" Dockerfile >nul
if %errorlevel% == 0 (
    echo ✅ Dockerfile correctly references api:app
) else (
    echo ❌ Dockerfile does not reference api:app
    exit /b 1
)

REM Test 2: Check if deploy script references the correct module
findstr "api:app" deploy.sh >nul
if %errorlevel% == 0 (
    echo ✅ Deploy script correctly references api:app
) else (
    echo ❌ Deploy script does not reference api:app
    exit /b 1
)

REM Test 3: Check if api.py exists
if exist "api.py" (
    echo ✅ api.py file exists
) else (
    echo ❌ api.py file does not exist
    exit /b 1
)

REM Test 4: Check if main.py exists
if exist "main.py" (
    echo ✅ main.py file exists
) else (
    echo ❌ main.py file does not exist
    exit /b 1
)

echo ✅ All tests passed! Docker configuration should work correctly.