import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from dotenv import load_dotenv
from loguru import logger
from contextlib import asynccontextmanager
import pathlib

# Import routers
from app.routers import analysis, reports

# Load environment variables
load_dotenv()

# Startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML models, establish connections
    logger.info("Starting TruthLens API")
    
    # Initialize NLP models - this will be handled by our model service
    from app.utils.model_service import initialize_models
    initialize_models()
    
    yield
    
    # Shutdown: Clean up resources
    logger.info("Shutting down TruthLens API")
    # Redis client is now managed in the redis_client module
    
# Create the FastAPI app
app = FastAPI(
    title="TruthLens API",
    description="API for fake news detection and analysis",
    version="1.0.0",
    lifespan=lifespan
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you should specify your extension's chrome-extension:// origin
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(reports.router, prefix="/api", tags=["reports"])

# Create the static directory if it doesn't exist
static_dir = pathlib.Path(__file__).parent / "static"
static_dir.mkdir(exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

# Root endpoint
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    # Check if the index.html file exists
    index_file = static_dir / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    
    # Fallback to JSON response if index.html doesn't exist
    return {
        "message": "Welcome to TruthLens API",
        "version": "1.0.0",
        "status": "operational",
        "docs_url": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    from app.utils.redis_client import redis_client
    
    status = {
        "api": True,
        "models": True,
        "redis": bool(redis_client),
    }
    
    return {
        "status": "healthy" if all(status.values()) else "degraded",
        "services": status
    }

# Specific health check endpoint for Render
@app.get("/healthz")
async def render_health_check():
    """
    Simple health check endpoint for Render.
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True) 