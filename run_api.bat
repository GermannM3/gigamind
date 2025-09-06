@echo off
echo Starting GigaMind API Server...
echo.

echo Activating virtual environment...
call venv\Scripts\activate
echo.

echo Starting GigaMind API server on http://localhost:8000
echo To access from mobile devices, make sure they are on the same network
echo and replace 'localhost' with your computer's IP address
echo.
echo Press Ctrl+C to stop the server
echo.

python main.py api

pause