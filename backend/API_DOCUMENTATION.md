# TruthLens API Documentation

## Base URL
The API is deployed at: [https://truthlens-ii4r.onrender.com](https://truthlens-ii4r.onrender.com)

## Interactive Documentation
Interactive API documentation is available at:
[https://truthlens-ii4r.onrender.com/docs](https://truthlens-ii4r.onrender.com/docs)

## Endpoints

### Root Endpoint
- **URL**: `/`
- **Method**: GET
- **Description**: Provides basic information about the API.
- **Response Example**:
  ```json
  {
    "message": "Welcome to TruthLens API",
    "version": "1.0.0",
    "status": "operational",
    "docs_url": "/docs"
  }
  ```

### Health Check
- **URL**: `/health`
- **Method**: GET
- **Description**: Checks the health status of the API and its dependencies.
- **Response Example**:
  ```json
  {
    "status": "healthy",
    "services": {
      "api": true,
      "models": true,
      "redis": true
    }
  }
  ```

### Render Health Check
- **URL**: `/healthz`
- **Method**: GET
- **Description**: Simple health check endpoint for Render's health monitoring.
- **Response Example**:
  ```json
  {
    "status": "healthy"
  }
  ```

### Analyze Article
- **URL**: `/api/analyze`
- **Method**: POST
- **Description**: Analyzes an article for credibility, sentiment, and bias.
- **Request Body**:
  ```json
  {
    "title": "Article Title",
    "content": "Article content text...",
    "url": "https://example.com/article-url"
  }
  ```
- **Response Example**:
  ```json
  {
    "credibilityScore": 0.75,
    "sentiment": "neutral",
    "biasTags": ["political", "factual"],
    "sources": [
      {
        "url": "https://trusted-source.com/related-article",
        "title": "Related Article Title",
        "publisher": "Trusted Publisher",
        "matchScore": 0.82
      }
    ],
    "trustLevel": "medium"
  }
  ```

### Get Previous Analysis
- **URL**: `/api/analyze/{url}`
- **Method**: GET
- **Description**: Retrieves a previously analyzed article by URL.
- **Parameters**: url (path parameter, URL-encoded)
- **Response**: Same format as the analyze endpoint response.

### Submit Report
- **URL**: `/api/report`
- **Method**: POST
- **Description**: Submit a user report for an article.
- **Request Body**:
  ```json
  {
    "articleUrl": "https://example.com/article",
    "reason": "missed_context",
    "comment": "The article is missing important context.",
    "userReference": "optional-email@example.com",
    "timestamp": 1631234567
  }
  ```
- **Response Example**:
  ```json
  {
    "success": true,
    "message": "Report submitted successfully"
  }
  ```

### Get Reports
- **URL**: `/api/reports/{article_url}`
- **Method**: GET
- **Description**: Get all reports for a specific article.
- **Parameters**: article_url (path parameter, URL-encoded)
- **Response Example**:
  ```json
  {
    "reports": [
      {
        "articleUrl": "https://example.com/article",
        "reason": "missed_context",
        "comment": "Missing important context",
        "timestamp": 1631234567
      }
    ]
  }
  ```

## Error Responses
API errors will return with appropriate HTTP status codes and a JSON error message:
```json
{
  "detail": "Error message description"
}
```

## Usage Notes
1. The API uses simulated data for the MVP version.
2. Analysis results are cached for 24 hours.
3. No API key is required for the demo version. 