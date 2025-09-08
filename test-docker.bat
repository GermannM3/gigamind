@echo off
REM Test script for GigaMind Docker deployment

echo Testing GigaMind Docker deployment...

REM Build the Docker image
echo Building Docker image...
docker-compose build

REM Start the services
echo Starting services...
docker-compose up -d

REM Wait for the service to start
echo Waiting for service to start...
timeout /t 30 /nobreak >nul

REM Check if the service is running
echo Checking service status...
docker-compose ps

REM Test the health endpoint
echo Testing health endpoint...
curl -f http://localhost:8000/health || echo Health check failed

REM Test the root endpoint
echo Testing root endpoint...
curl -f http://localhost:8000/ || echo Root endpoint failed

echo Test completed.