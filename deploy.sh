#!/bin/bash

# GigaMind Deployment Script
echo "🚀 Deploying GigaMind AI Assistant..."

# Update system packages
sudo apt update

# Install Python 3.9 and pip
sudo apt install -y python3.9 python3.9-pip python3.9-venv

# Install system dependencies
sudo apt install -y gcc g++ curl

# Create application directory
sudo mkdir -p /opt/gigamind
sudo chown $USER:$USER /opt/gigamind
cd /opt/gigamind

# Clone repository
git clone https://github.com/GermannM3/gigamind.git .

# Create virtual environment
python3.9 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements-light.txt

# Create data directory
mkdir -p data

# Create systemd service
sudo tee /etc/systemd/system/gigamind.service > /dev/null <<EOF
[Unit]
Description=GigaMind AI Assistant
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/opt/gigamind
Environment=PATH=/opt/gigamind/venv/bin
ExecStart=/opt/gigamind/venv/bin/gunicorn main:app --bind 0.0.0.0:8000 --timeout 60 --workers 2
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start service
sudo systemctl daemon-reload
sudo systemctl enable gigamind
sudo systemctl start gigamind

echo "✅ GigaMind deployed successfully!"
echo "📝 Don't forget to set GigaChat credentials in /opt/gigamind/.env:"
echo "   - GIGACHAT_CLIENT_ID"
echo "   - GIGACHAT_AUTH_KEY" 
echo "   - GIGACHAT_ACCESS_TOKEN (optional, for direct token usage)"
echo "🌐 Service will be available at http://your-server-ip:8000"
echo "📊 Check status with: sudo systemctl status gigamind"
