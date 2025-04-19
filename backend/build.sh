#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting build process..."

# Install Python dependencies
echo "Installing dependencies from requirements-prod.txt..."
pip install -r requirements-prod.txt

# Explicitly install lxml with html_clean extra
echo "Ensuring lxml with html_clean extra is installed..."
pip install "lxml[html_clean]>=5.0.0"

# Print confirmation of successful installation
echo "Dependencies installed successfully!"

# For future database migrations if needed
# python manage_db.py migrate

echo "Build completed successfully!" 