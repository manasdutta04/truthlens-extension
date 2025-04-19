@echo off
echo TruthLens Fix and Build Script
echo ============================
echo.

echo Cleaning previous build...
if exist "dist" rd /s /q dist

echo Creating necessary directories...
mkdir dist\utils

echo Copying config directly...
copy src\utils\config.ts dist\utils\config.js
echo // Fixed direct import addition > dist\utils\config.js
echo window.config = config; >> dist\utils\config.js
echo export default config; >> dist\utils\config.js

echo Building extension...
call npm run build:prod

echo Copying config file again to be safe...
copy src\utils\config.ts dist\utils\config.js
echo // Fixed direct import addition > dist\utils\config.js
echo window.config = config; >> dist\utils\config.js
echo export default config; >> dist\utils\config.js

echo Copying icon files to root of dist folder...
copy public\icon16.png dist\
copy public\icon48.png dist\
copy public\icon128.png dist\
echo Icon files copied successfully.

echo.
echo Build completed!
echo.
echo Instructions:
echo 1. Go to chrome://extensions/
echo 2. Enable Developer mode
echo 3. Click "Load unpacked" and select the dist folder
echo 4. Go to a news article and test the extension
echo.
pause 