import os
import redis
from loguru import logger

# Initialize Redis client
redis_client = None
if os.getenv("REDIS_URL"):
    try:
        redis_client = redis.from_url(os.getenv("REDIS_URL"))
        logger.info("Connected to Redis successfully")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")

def get_redis():
    """Return the Redis client instance"""
    return redis_client 