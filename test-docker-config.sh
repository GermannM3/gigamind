#!/bin/bash
# Simple test script to verify Docker configuration

echo "Testing Docker configuration..."

# Test 1: Check if Dockerfile references the correct module
if grep -q "api:app" Dockerfile; then
    echo "✅ Dockerfile correctly references api:app"
else
    echo "❌ Dockerfile does not reference api:app"
    exit 1
fi

# Test 2: Check if deploy script references the correct module
if grep -q "api:app" deploy.sh; then
    echo "✅ Deploy script correctly references api:app"
else
    echo "❌ Deploy script does not reference api:app"
    exit 1
fi

# Test 3: Check if api.py exists
if [ -f "api.py" ]; then
    echo "✅ api.py file exists"
else
    echo "❌ api.py file does not exist"
    exit 1
fi

# Test 4: Check if main.py exists
if [ -f "main.py" ]; then
    echo "✅ main.py file exists"
else
    echo "❌ main.py file does not exist"
    exit 1
fi

echo "✅ All tests passed! Docker configuration should work correctly."