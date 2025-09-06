@echo off
echo Setting up GigaMind environment...
echo.

echo Creating virtual environment...
python -m venv venv
echo.

echo Activating virtual environment...
call venv\Scripts\activate
echo.

echo Installing dependencies...
pip install -r requirements-light.txt
echo.

echo Setup complete!
echo To run the application, execute:
echo   1. venv\Scripts\activate
echo   2. python main.py
echo.
echo Then open http://127.0.0.1:7860 in your browser
pause