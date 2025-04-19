from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import time
from app.utils.redis_client import get_redis
from app.utils.model_service import get_credibility_score, get_sentiment, extract_bias_tags
from app.utils.fact_check import cross_verify_sources
from app.models.article import ArticleData, AnalysisResult, SourceReference
from loguru import logger
import json
import uuid

router = APIRouter()

class AnalysisRequest(BaseModel):
    title: str
    content: str
    url: str

@router.post("/analyze")
async def analyze_article(
    article: AnalysisRequest,
    background_tasks: BackgroundTasks,
    redis_client = Depends(get_redis)
):
    """
    Analyze an article for credibility, sentiment, and bias.
    """
    start_time = time.time()
    logger.info(f"Analyzing article: {article.url}")
    
    # Check Redis cache first if available
    if redis_client:
        cached_result = redis_client.get(f"article:{article.url}")
        if cached_result:
            logger.info(f"Cache hit for {article.url}")
            return json.loads(cached_result)
    
    try:
        # 1. Get credibility score using transformer model
        credibility_score = get_credibility_score(article.title, article.content)
        
        # 2. Determine trust level based on credibility score
        trust_level = "high" if credibility_score >= 0.7 else "medium" if credibility_score >= 0.4 else "low"
        
        # 3. Get sentiment analysis
        sentiment = get_sentiment(article.content)
        
        # 4. Extract bias tags
        bias_tags = extract_bias_tags(article.content)
        
        # 5. Cross-verify with other sources (run in background to not delay response)
        # For MVP, we'll return empty sources and update the cache later
        sources: List[SourceReference] = []
        
        # Add background task to fetch sources
        background_tasks.add_task(
            update_with_sources, 
            article.url, 
            article.title, 
            credibility_score, 
            sentiment, 
            bias_tags, 
            trust_level, 
            redis_client
        )
        
        result = {
            "credibilityScore": float(credibility_score),
            "sentiment": sentiment,
            "biasTags": bias_tags,
            "sources": sources,
            "trustLevel": trust_level
        }
        
        # Cache the result (without sources initially)
        if redis_client:
            redis_client.setex(
                f"article:{article.url}", 
                3600,  # Cache for 1 hour
                json.dumps(result)
            )
        
        logger.info(f"Analysis completed in {time.time() - start_time:.2f}s")
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing article: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

async def update_with_sources(
    url: str, 
    title: str, 
    credibility_score: float, 
    sentiment: str, 
    bias_tags: List[str], 
    trust_level: str, 
    redis_client
):
    """Background task to fetch sources and update the cached result."""
    try:
        # Fetch verified sources
        sources = await cross_verify_sources(url, title)
        
        # Update the result with sources
        result = {
            "credibilityScore": float(credibility_score),
            "sentiment": sentiment,
            "biasTags": bias_tags,
            "sources": sources,
            "trustLevel": trust_level
        }
        
        # Update cache if available
        if redis_client:
            redis_client.setex(
                f"article:{url}", 
                3600,  # Cache for 1 hour
                json.dumps(result)
            )
            
        logger.info(f"Updated {url} with {len(sources)} sources")
        
    except Exception as e:
        logger.error(f"Error updating sources for {url}: {str(e)}")

@router.get("/analyze/{url:path}")
async def get_analysis(url: str, redis_client = Depends(get_redis)):
    """
    Get cached analysis for a specific URL.
    """
    if not redis_client:
        raise HTTPException(status_code=501, detail="Caching not available")
    
    cached_result = redis_client.get(f"article:{url}")
    if not cached_result:
        raise HTTPException(status_code=404, detail="Analysis not found for this URL")
    
    return json.loads(cached_result)

@router.post("/save_verification")
async def save_verification(
    verification: dict,
    background_tasks: BackgroundTasks,
    redis_client = Depends(get_redis)
):
    """
    Save article verification to database instead of blockchain.
    """
    logger.info(f"Saving verification for article: {verification.get('url')}")
    
    try:
        # Generate a unique ID
        verification_id = str(uuid.uuid4())
        
        # Add ID and ensure timestamp exists
        verification_data = {
            "id": verification_id,
            "timestamp": verification.get("timestamp", int(time.time())),
            "url": verification.get("url"),
            "title": verification.get("title"),
            "credibilityScore": verification.get("credibilityScore"),
            "trustLevel": verification.get("trustLevel")
        }
        
        # Store in Redis (or you could use a database in production)
        if redis_client:
            # Store by ID
            redis_client.set(
                f"verification:{verification_id}", 
                json.dumps(verification_data),
                ex=2592000  # Cache for 30 days
            )
            
            # Also index by URL
            redis_client.set(
                f"verification:url:{verification_data['url']}", 
                json.dumps(verification_data),
                ex=2592000  # Cache for 30 days
            )
        else:
            logger.warning("Redis not available, logging verification only")
            logger.info(f"Verification data: {verification_data}")
        
        return verification_data
    
    except Exception as e:
        logger.error(f"Error saving verification: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save verification: {str(e)}") 