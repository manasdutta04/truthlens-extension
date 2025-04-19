from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import time
from app.utils.redis_client import get_redis
from app.utils.db_service import save_report, get_reports_by_url, get_report_stats
from loguru import logger

router = APIRouter()

class UserReport(BaseModel):
    articleUrl: str
    reason: str
    comment: Optional[str] = None
    userReference: Optional[str] = None
    timestamp: int

@router.post("/report")
async def submit_report(report: UserReport, redis_client = Depends(get_redis)):
    """
    Submit a user report for an article.
    """
    logger.info(f"Received report for article: {report.articleUrl}")
    
    try:
        # Create the report object
        report_data = report.dict()
        
        # Use the current timestamp if not provided
        if not report_data.get("timestamp"):
            report_data["timestamp"] = int(time.time())
        
        # Save to database service
        saved_report = save_report(report_data)
        
        # Also cache in Redis if available
        if redis_client:
            redis_client.lpush(f"reports:{report.articleUrl}", 
                             saved_report)
            redis_client.expire(f"reports:{report.articleUrl}", 7776000)  # 90 days
        
        return {"success": True, "message": "Report submitted successfully"}
    
    except Exception as e:
        logger.error(f"Error submitting report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to submit report: {str(e)}")

@router.get("/reports/{article_url:path}")
async def get_reports_for_article(article_url: str, redis_client = Depends(get_redis)):
    """
    Get all reports for a specific article URL.
    """
    try:
        # Get reports from database service
        reports = get_reports_by_url(article_url)
        
        if not reports and redis_client:
            # Try to get from Redis cache if not in DB
            report_key = f"reports:{article_url}"
            report_list = redis_client.lrange(report_key, 0, -1)
            
            if report_list:
                reports = [report_list for report in report_list]
        
        return {"reports": reports or []}
    
    except Exception as e:
        logger.error(f"Error retrieving reports: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve reports: {str(e)}")

@router.get("/reports/stats")
async def get_report_statistics():
    """
    Get report statistics (admin endpoint).
    """
    try:
        # Get stats from database service
        stats = get_report_stats()
        return stats
    
    except Exception as e:
        logger.error(f"Error retrieving report stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve report stats: {str(e)}") 