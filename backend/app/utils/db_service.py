import os
import json
from typing import Dict, Any, List, Optional
from loguru import logger
import time

# Note: For real production, you would use a proper database like PostgreSQL
# This is a simplified in-memory database service that could be replaced 
# with an actual database implementation

# In-memory storage
_verification_store = {}
_reports_store = {}

def init_db():
    """Initialize database connection"""
    # For production, you would connect to your database here
    db_connection_string = os.getenv("DB_CONNECTION_STRING")
    if db_connection_string:
        logger.info("Database connection string found, but using in-memory store for MVP")
        # In production: connect_to_real_database(db_connection_string)
    
    logger.info("Initialized database service (in-memory for MVP)")
    return True

def save_verification(verification_data: Dict[str, Any]) -> Dict[str, Any]:
    """Save article verification to the database"""
    verification_id = verification_data.get("id")
    if not verification_id:
        # Generate an ID if not provided
        import uuid
        verification_id = str(uuid.uuid4())
        verification_data["id"] = verification_id
    
    # Store in our in-memory database
    _verification_store[verification_id] = verification_data
    
    # Also store by URL for quick lookups
    url = verification_data.get("url")
    if url:
        _verification_store[f"url:{url}"] = verification_data
    
    logger.info(f"Saved verification: {verification_id} for URL: {url}")
    return verification_data

def get_verification(verification_id: str) -> Optional[Dict[str, Any]]:
    """Get a verification by ID"""
    return _verification_store.get(verification_id)

def get_verification_by_url(url: str) -> Optional[Dict[str, Any]]:
    """Get a verification by article URL"""
    return _verification_store.get(f"url:{url}")

def save_report(report_data: Dict[str, Any]) -> Dict[str, Any]:
    """Save a user report"""
    report_id = report_data.get("id")
    if not report_id:
        import uuid
        report_id = str(uuid.uuid4())
        report_data["id"] = report_id
    
    # Ensure timestamp exists
    if "timestamp" not in report_data:
        report_data["timestamp"] = int(time.time())
    
    # Store in our in-memory database
    _reports_store[report_id] = report_data
    
    # Also track reports by article URL for quick lookup
    url = report_data.get("articleUrl")
    if url:
        if f"url:{url}" not in _reports_store:
            _reports_store[f"url:{url}"] = []
        _reports_store[f"url:{url}"].append(report_data)
    
    logger.info(f"Saved report: {report_id} for URL: {url}")
    return report_data

def get_reports_by_url(url: str) -> List[Dict[str, Any]]:
    """Get all reports for a specific URL"""
    return _reports_store.get(f"url:{url}", [])

def get_report_stats() -> Dict[str, Any]:
    """Get basic report statistics"""
    # Count reports by reason
    reason_counts = {}
    total_reports = 0
    
    for key, value in _reports_store.items():
        if not key.startswith("url:"):
            total_reports += 1
            reason = value.get("reason")
            if reason:
                reason_counts[reason] = reason_counts.get(reason, 0) + 1
    
    return {
        "totalReports": total_reports,
        "reasonCounts": reason_counts,
        "timestamp": int(time.time())
    }

# Initialize the database service
init_db() 