#!/bin/bash
# Test script for GigaMind Docker deployment

echo "Testing GigaMind Docker deployment..."

# Build the Docker image
echo "Building Docker image..."
docker-compose build

# Start the services
echo "Starting services..."
docker-compose up -d

# Wait for the service to start
echo "Waiting for service to start..."
sleep 30

# Check if the service is running
echo "Checking service status..."
docker-compose ps

# Test the health endpoint
echo "Testing health endpoint..."
curl -f http://localhost:8000/health || echo "Health check failed"

# Test the root endpoint
echo "Testing root endpoint..."
curl -f http://localhost:8000/ || echo "Root endpoint failed"

echo "Test completed."