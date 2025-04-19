@echo off
echo TruthLens Production Build
echo ========================
echo.

echo Building extension with production settings...
call npm run build:prod

echo.
echo Production build completed!
echo.
echo The extension is ready in the 'dist' directory.
echo To load it in Chrome:
echo 1. Go to chrome://extensions/
echo 2. Enable Developer mode
echo 3. Click "Load unpacked" and select the 'dist' directory
echo.
echo To package for the Chrome Web Store:
echo - Run 'package-extension.bat' to create a ZIP file
echo.
pause 