# TruthLens Troubleshooting Guide

If you're experiencing issues with the TruthLens extension, this guide will help you diagnose and fix common problems.

## Common Issues

### "Something went wrong" Error Message

If you see "No analysis data available. Please navigate to a news article and try again." in the popup:

1. Make sure you're on an actual news article page.
2. Try reloading the page and then opening the extension again.
3. Check if your network connection is working.
4. Verify that the API is operational (see below).

### Extension Not Analyzing Articles

If the extension doesn't seem to be working when you visit news articles:

1. Check the browser console for any error messages (press F12 to open developer tools, then click on "Console").
2. Verify that the extension has the necessary permissions. Go to `chrome://extensions/`, find TruthLens, and click "Details" to check permissions.
3. Make sure the content script is running by looking for "TruthLens" messages in the console.

### API Connection Issues

If the extension can't connect to the backend API:

1. Verify that the API is running by visiting [https://truthlens-ii4r.onrender.com](https://truthlens-ii4r.onrender.com) in your browser.
2. Check if there are any CORS-related errors in the console.
3. Use the debug page to test API connections (see below).

## Using the Debug Page

TruthLens includes a built-in debug page that can help diagnose issues:

1. Go to `chrome://extensions/` and find TruthLens.
2. Copy the ID of the extension (it looks like a string of letters and numbers).
3. Visit `chrome-extension://YOUR_EXTENSION_ID/debug.html` in your browser (replace YOUR_EXTENSION_ID with the actual ID).

The debug page provides tools to:
- Test API connections
- View environment information
- See current tab data
- Check stored analysis data
- Clear cached data

## Resetting the Extension

If you're still having issues, try resetting the extension:

1. Go to `chrome://extensions/`
2. Find TruthLens and click the "Details" button
3. Scroll down and click "Clear site data"
4. Reload any open tabs

## Rebuilding the Extension

If you're a developer and need to rebuild the extension:

1. Make sure you have the correct API URL in `src/utils/config.ts`
2. Run `npm run build:prod` to build a production version
3. Load the updated extension from the `dist` folder

## Contact Support

If you continue to experience issues, please:

1. Take a screenshot of the problem
2. Note any error messages from the console
3. Describe the steps to reproduce the issue
4. Contact support at [github.com/manasdutta04/truthlens](https://github.com/manasdutta04/truthlens) 