import os
import asyncio
import aiohttp
import time
import random
from typing import List, Dict, Any
from loguru import logger
from newspaper import Article
from urllib.parse import urlparse

from app.models.article import SourceReference

# For MVP, we're using simulated data
# In production, this would connect to Google Fact Check API and other sources

async def cross_verify_sources(url: str, title: str) -> List[SourceReference]:
    """
    Cross-verify article with trusted sources.
    """
    logger.info(f"Cross-verifying article: {url}")
    
    # Simulate a network delay
    await asyncio.sleep(0.3)
    
    # For MVP, we'll return simulated sources
    # In production, we would:
    # 1. Use Google Fact Check API to find related fact checks
    # 2. Use search API to find similar articles from reliable sources
    # 3. Use Newspaper3k to extract and compare content
    
    # Get the domain from the URL for simulated matching
    try:
        domain = urlparse(url).netloc
    except:
        domain = "unknown"
    
    # List of trusted news sources for simulation
    trusted_sources = [
        {"name": "Reuters", "domain": "reuters.com", "reliability": 0.95},
        {"name": "Associated Press", "domain": "apnews.com", "reliability": 0.93},
        {"name": "BBC", "domain": "bbc.com", "reliability": 0.92},
        {"name": "NPR", "domain": "npr.org", "reliability": 0.9},
        {"name": "The New York Times", "domain": "nytimes.com", "reliability": 0.89},
        {"name": "The Washington Post", "domain": "washingtonpost.com", "reliability": 0.88},
        {"name": "The Wall Street Journal", "domain": "wsj.com", "reliability": 0.87},
        {"name": "The Guardian", "domain": "theguardian.com", "reliability": 0.86},
        {"name": "CNN", "domain": "cnn.com", "reliability": 0.85},
        {"name": "ABC News", "domain": "abcnews.go.com", "reliability": 0.84}
    ]
    
    # Simulate finding 2-4 related sources
    num_sources = random.randint(2, 4)
    
    # Filter out the current source if it's in our trusted list
    sources_pool = [s for s in trusted_sources if domain not in s["domain"]]
    selected_sources = random.sample(sources_pool, min(num_sources, len(sources_pool)))
    
    # Generate related article URLs and titles
    result_sources = []
    
    # Words to use in simulated titles
    title_words = title.split()
    if len(title_words) > 3:
        title_words = [w for w in title_words if len(w) > 3]
    
    for source in selected_sources:
        # Create a simulated matching score
        match_score = random.uniform(0.65, 0.95)
        
        # Create a simulated similar title
        if len(title_words) > 3:
            # Use some words from the original title
            num_words = min(len(title_words), random.randint(2, 4))
            words = random.sample(title_words, num_words)
            simulated_title = " ".join(words)
            
            # Add some generic words
            prefix = random.choice(["Report: ", "Analysis: ", "", ""])
            suffix = random.choice([
                " - What You Need to Know",
                ": Experts Weigh In",
                " and Its Implications",
                ": The Facts",
                ""
            ])
            
            simulated_title = f"{prefix}{simulated_title}{suffix}"
        else:
            # Fallback for very short titles
            simulated_title = f"Report related to: {title}"
        
        # Create the source reference
        source_ref = SourceReference(
            url=f"https://{source['domain']}/article/{int(time.time())}-{hash(title) % 10000}",
            title=simulated_title,
            publisher=source["name"],
            matchScore=float(match_score)
        )
        
        result_sources.append(source_ref)
    
    logger.info(f"Found {len(result_sources)} related sources")
    return result_sources

async def get_fact_checks(claim: str) -> List[Dict[str, Any]]:
    """
    Get fact checks for a specific claim using Google Fact Check API.
    
    In a production system, this would connect to the actual API.
    For the MVP, we'll simulate responses.
    """
    # Simulate API delay
    await asyncio.sleep(0.3)
    
    # In production, this would use:
    # Google Fact Check API: https://developers.google.com/fact-check/tools/api/
    
    api_key = os.getenv("GOOGLE_FACT_CHECK_API_KEY")
    if not api_key:
        logger.warning("No Google Fact Check API key found")
        return []
    
    # For MVP, return simulated data
    return [
        {
            "claimant": "Social Media",
            "claimDate": "2023-01-15T00:00:00Z",
            "claimReview": [
                {
                    "publisher": {
                        "name": "Fact Check Organization",
                        "site": "https://factcheck.org"
                    },
                    "textualRating": "Partly False",
                    "title": "Claim contains some true elements but includes significant inaccuracies",
                    "url": "https://factcheck.org/example-check"
                }
            ]
        }
    ]

async def extract_article_content(url: str) -> Dict[str, str]:
    """
    Extract article content using Newspaper3k.
    
    In production, this would download and parse the actual article.
    For MVP, we'll simulate the behavior.
    """
    try:
        # Simulate download delay
        await asyncio.sleep(0.5)
        
        # In production, we would use:
        # article = Article(url)
        # article.download()
        # article.parse()
        # return {"title": article.title, "text": article.text}
        
        # For MVP, return simulated content
        return {
            "title": "Simulated Article Title",
            "text": "This is simulated article content for demonstration purposes."
        }
    except Exception as e:
        logger.error(f"Error extracting article content: {str(e)}")
        return {"title": "", "text": ""} 