#!/bin/bash

# TruthLens API Deployment Script for Render.com

# This script prepares your backend for deployment to Render.com
# You should run this script before pushing to GitHub

# Create the necessary files for deployment
echo "Preparing TruthLens API for deployment..."

# Make sure .env.sample exists
if [ ! -f ".env.example" ]; then
  echo "Creating .env.example file..."
  cat > .env.example << EOL
# API Keys (required)
HUGGINGFACE_API_KEY=your_huggingface_key
GOOGLE_FACT_CHECK_API_KEY=your_google_api_key

# Redis Configuration (optional)
# REDIS_URL=redis://localhost:6379/0

# Database Configuration (for production)
# DB_CONNECTION_STRING=postgresql://username:password@localhost/truthlens

# Other Settings
USE_GPU=false
LOG_LEVEL=INFO
PORT=8000
EOL
fi

# Make sure requirements-prod.txt exists
if [ ! -f "requirements-prod.txt" ]; then
  echo "Creating requirements-prod.txt file..."
  cp requirements.txt requirements-prod.txt
  # Add production dependencies
  echo "gunicorn==21.2.0" >> requirements-prod.txt
  echo "psycopg2-binary==2.9.9" >> requirements-prod.txt
  echo "uvloop==0.19.0" >> requirements-prod.txt
  echo "httptools==0.6.1" >> requirements-prod.txt
fi

# Create build.sh for Render
echo "Creating build.sh script for Render..."
cat > build.sh << EOL
#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements-prod.txt

# For future database migrations if needed
# python manage_db.py migrate
EOL

# Make the build script executable
chmod +x build.sh

# Create a .gitignore file if it doesn't exist
if [ ! -f ".gitignore" ]; then
  echo "Creating .gitignore file..."
  cat > .gitignore << EOL
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.env
.env.local
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
*.egg-info/
.installed.cfg
*.egg
.DS_Store
.idea/
EOL
fi

echo "Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Sign up at render.com"
echo "3. Create a new Web Service, linking to your GitHub repository"
echo "4. Set the following configuration:"
echo "   - Build Command: ./build.sh"
echo "   - Start Command: gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:\$PORT"
echo "5. Add your environment variables in the Render dashboard"
echo ""
echo "Your TruthLens API will be deployed automatically!" 