# TruthLens: AI-Powered Fake News Detection Extension

TruthLens is a Chrome extension that uses AI to detect fake news in real-time and verifies credibility through trusted sources.


<p align="center">
  <img src="public/icons/TruthLens.gif" alt="Demo animation" />
</p>


## 📋 Overview

TruthLens helps users:
- Analyze news articles for credibility in real-time
- Detect bias and sentiment in content
- Cross-verify information with trusted sources
- Store verified news metadata for transparency
- Make more informed decisions about the content they consume

## 🔧 Tech Stack

- **Extension**: React.js, Tailwind CSS, TypeScript, Manifest V3
- **Backend**: Python, FastAPI, Hugging Face Transformers
- **Data Storage**: Redis (caching), PostgreSQL (optional for production)
- **APIs**: Google Fact-Check API, Newspaper3k

## 🚀 Features

- Real-time credibility analysis of news articles
- Visual trust indicators (High ✅, Medium ⚠️, Low ❌)
- Detailed analysis popup with sentiment, bias tags, and source verification
- Persistent storage of verified articles
- User reporting system for feedback

## 🔍 Project Structure

- `extension/`: Chrome extension frontend code
- `backend/`: FastAPI backend for NLP analysis
- `shared/`: Common interfaces and types

## 📥 Setup Instructions

### Extension Setup

1. Clone this repository
2. Navigate to the extension directory:
   ```
   cd extension
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Build the extension:
   ```
   npm run build
   ```
5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension/dist` directory

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Start the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

## 🧪 Testing with Sample Articles

1. Ensure both the extension and backend are running
2. Visit any news article website
3. The TruthLens badge will appear, analyzing the article content
4. Click on the extension icon for detailed analysis
5. Test verification by clicking "Verify Article" in the extension popup

## 🔐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

### Backend .env
```
# API Keys
HUGGINGFACE_API_KEY=your_huggingface_key
GOOGLE_FACT_CHECK_API_KEY=your_google_api_key

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379/0

# Database Configuration (for production)
DB_CONNECTION_STRING=postgresql://username:password@localhost/truthlens

# Other Settings
USE_GPU=false
LOG_LEVEL=INFO
PORT=8000
```

## 📚 Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers/index)

## 👨‍💻 Lead Developer

**Manas Dutta**  
Lead Developer


- **GitHub**: [github.com/manasdutta04](https://github.com/manasdutta04)
- **LinkedIn**: [linkedin.com/in/manasdutta04](https://linkedin.com/in/manasdutta04)



## 📝 License

This project is licensed under the MIT License. 
