@echo off
echo TruthLens Extension Packaging
echo ============================
echo.

REM Check if dist directory exists
if not exist "dist" (
  echo Error: dist directory not found. 
  echo Please run 'npm run build:prod' first.
  exit /b 1
)

REM Create a releases directory if it doesn't exist
if not exist "releases" mkdir releases

REM Get current date for version
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "date_version=%YY%%MM%%DD%"

echo Packaging extension version %date_version%...

REM Create ZIP file using PowerShell
powershell -Command "& {Compress-Archive -Path dist\* -DestinationPath releases\truthlens-%date_version%.zip -Force}"

echo.
echo Packaging complete!
echo Created: releases\truthlens-%date_version%.zip
echo.
echo Next steps:
echo 1. Go to Chrome Web Store Developer Dashboard
echo 2. Upload the ZIP file
echo 3. Fill in the store listing information
echo 4. Submit for review
echo. 