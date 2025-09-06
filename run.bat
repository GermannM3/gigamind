@echo off
echo Starting GigaMind...
echo.

echo Activating virtual environment...
call venv\Scripts\activate
echo.

echo Starting GigaMind application...
python main.py
echo.

pause