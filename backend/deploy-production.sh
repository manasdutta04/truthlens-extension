#!/bin/bash

# Production deployment script for TruthLens backend

echo "TruthLens API Production Deployment"
echo "==================================="

# Check for Python
if ! [ -x "$(command -v python3)" ]; then
  echo "Error: Python 3 is not installed." >&2
  exit 1
fi

# Check for virtual environment
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install production dependencies
echo "Installing production dependencies..."
pip install -r requirements-prod.txt

# Check for .env file
if [ ! -f ".env" ]; then
  echo "Warning: .env file not found. Using default configuration."
  echo "Creating a sample .env file..."
  cp .env.example .env
  echo "Please update the .env file with your API keys and configuration."
fi

# Create required directories
echo "Setting up directories..."
mkdir -p logs
mkdir -p data

# Run database migrations if using a database
# echo "Running database migrations..."
# python manage_db.py migrate

# Start the server with gunicorn
echo "Starting TruthLens API in production mode..."
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --log-level info \
  --access-logfile logs/access.log \
  --error-logfile logs/error.log \
  --daemon

echo "TruthLens API is now running in the background."
echo "Check logs at logs/access.log and logs/error.log"
echo ""
echo "To stop the service:"
echo "  pkill -f gunicorn"
echo ""
echo "To check if the service is running:"
echo "  ps aux | grep gunicorn"
echo ""
echo "API available at: http://localhost:8000" 