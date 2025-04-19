import os
import random
import time
from typing import List
from loguru import logger

# Global variable to store loaded models
models = {
    "credibility": None,
    "sentiment": None,
    "bias": None
}

def initialize_models():
    """
    Initialize NLP models for text analysis.
    
    For the MVP, we'll use simulated data instead of actual models.
    """
    logger.info("Initializing NLP models...")
    
    # Simulate model loading time
    time.sleep(0.5)
    
    # In a real implementation, we would load models like this:
    # if os.getenv("USE_GPU", "false").lower() == "true":
    #     device = "cuda"
    # else:
    #     device = "cpu"
    # 
    # models["credibility"] = AutoModelForSequenceClassification.from_pretrained("...")
    # models["sentiment"] = pipeline("sentiment-analysis", ...)
    # models["bias"] = ...
    
    # For MVP, just use dummy models
    models["credibility"] = "dummy_credibility_model"
    models["sentiment"] = "dummy_sentiment_model"
    models["bias"] = "dummy_bias_model"
    
    logger.info("NLP models initialized successfully")

def get_credibility_score(title: str, content: str) -> float:
    """
    Analyze article for credibility and return a score.
    
    For the MVP, we'll return simulated scores.
    """
    # Simulate processing time
    time.sleep(0.2)
    
    # In a real implementation, we would use the model to get the score:
    # inputs = tokenizer(title + " " + content[:1000], return_tensors="pt")
    # outputs = models["credibility"](**inputs)
    # score = outputs.logits.softmax(dim=-1)[0][1].item()  # Probability of being credible
    
    # For MVP, generate a pseudo-random score based on the content
    # This makes the scoring deterministic for the same input
    content_hash = sum(ord(c) for c in (title + content[:100]))
    base_score = (content_hash % 100) / 100.0
    
    # Add a small random factor for variation
    random_factor = random.uniform(-0.1, 0.1)
    score = max(0.0, min(1.0, base_score + random_factor))
    
    logger.info(f"Credibility score: {score:.2f}")
    return score

def get_sentiment(content: str) -> str:
    """
    Analyze article sentiment.
    
    For the MVP, we'll return simulated sentiment.
    """
    # Simulate processing time
    time.sleep(0.1)
    
    # In a real implementation, we would use the model to get the sentiment:
    # result = models["sentiment"](content[:1000])
    # sentiment = result[0]["label"]
    
    # For MVP, generate a deterministic sentiment based on content
    content_hash = sum(ord(c) for c in content[:100])
    sentiment_idx = content_hash % 3
    
    sentiments = ["positive", "negative", "neutral"]
    sentiment = sentiments[sentiment_idx]
    
    logger.info(f"Sentiment analysis: {sentiment}")
    return sentiment

def extract_bias_tags(content: str) -> List[str]:
    """
    Extract bias tags from article content.
    
    For the MVP, we'll return simulated bias tags.
    """
    # Simulate processing time
    time.sleep(0.15)
    
    # In a real implementation, we would use models and keyword extraction:
    # bias_tags = []
    # keywords = extract_keywords(content)
    # for keyword in keywords:
    #    if keyword in bias_dictionary:
    #        bias_tags.append(bias_dictionary[keyword])
    
    # For MVP, generate deterministic bias tags based on content
    content_hash = sum(ord(c) for c in content[:100])
    
    # All possible bias tags
    all_bias_tags = [
        "political", "left-leaning", "right-leaning", "center", 
        "opinion", "factual", "emotional", "sensationalist",
        "corporate", "independent", "scientific", "religious",
        "economic", "historical", "cultural"
    ]
    
    # Select a subset of tags based on the content hash
    num_tags = (content_hash % 3) + 1  # 1-3 tags
    
    # Deterministically select tags based on content hash
    selected_indices = [(content_hash + i * 7) % len(all_bias_tags) for i in range(num_tags)]
    bias_tags = [all_bias_tags[idx] for idx in selected_indices]
    
    logger.info(f"Extracted bias tags: {bias_tags}")
    return bias_tags 