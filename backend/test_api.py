import requests
import json
import time
import hashlib

# Base URL for your API
BASE_URL = "http://localhost:8000"

def test_root():
    """Test the root endpoint"""
    response = requests.get(f"{BASE_URL}/")
    print(f"Root Endpoint Response: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_health():
    """Test the health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health Endpoint Response: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print("Health endpoint not available")

def test_analyze_article():
    """Test the article analysis endpoint"""
    # Sample article data
    article_data = {
        "title": "Sample News Article for Testing",
        "content": "This is a sample news article created for testing the TruthLens API. It contains information that may or may not be accurate. The purpose is to test the analysis capabilities of the system.",
        "url": "https://example.com/sample-article"
    }
    
    # Send analysis request
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json=article_data
    )
    
    print(f"Analyze Endpoint Response: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(json.dumps(result, indent=2))
        return result
    else:
        print(f"Error: {response.text}")
        return None

def test_blockchain_verification(analysis_result=None):
    """Test blockchain verification endpoint"""
    if not analysis_result:
        # If no analysis result provided, create dummy data
        analysis_result = {
            "credibilityScore": 0.75,
            "trustLevel": "medium"
        }
        article_data = {
            "title": "Sample Article",
            "url": "https://example.com/sample"
        }
    else:
        article_data = {
            "title": "Sample News Article for Testing",
            "url": "https://example.com/sample-article"
        }
    
    # Create a hash of the article content
    article_hash = hashlib.sha256(article_data["url"].encode()).hexdigest()
    
    # Prepare verification request
    verification_data = {
        "url": article_data["url"],
        "hash": article_hash,
        "title": article_data["title"],
        "credibilityScore": analysis_result["credibilityScore"],
        "publisher": "Example News"
    }
    
    # Send verification request
    response = requests.post(
        f"{BASE_URL}/api/verify_on_chain",
        json=verification_data
    )
    
    print(f"Blockchain Verification Endpoint Response: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(json.dumps(result, indent=2))
        return result
    else:
        print(f"Error: {response.text}")
        return None

def test_submit_report():
    """Test report submission endpoint"""
    report_data = {
        "articleUrl": "https://example.com/sample-article",
        "reason": "missed_context",
        "comment": "The article is missing important context about the event.",
        "userReference": "test@example.com",
        "timestamp": int(time.time())
    }
    
    # Send report submission request
    response = requests.post(
        f"{BASE_URL}/api/report",
        json=report_data
    )
    
    print(f"Report Submission Endpoint Response: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(json.dumps(result, indent=2))
        return result
    else:
        print(f"Error: {response.text}")
        return None

if __name__ == "__main__":
    print("Testing TruthLens API...")
    print("\n=== Root Endpoint ===")
    test_root()
    
    print("\n=== Health Endpoint ===")
    test_health()
    
    print("\n=== Article Analysis Endpoint ===")
    analysis_result = test_analyze_article()
    
    print("\n=== Blockchain Verification Endpoint ===")
    verification_result = test_blockchain_verification(analysis_result)
    
    print("\n=== Report Submission Endpoint ===")
    test_submit_report()
    
    print("\nAPI Testing Complete!") 