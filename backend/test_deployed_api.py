import requests
import json
import time

# Base URL for your deployed API
BASE_URL = "https://truthlens-ii4r.onrender.com"

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
        
def test_render_health():
    """Test the Render-specific health endpoint"""
    response = requests.get(f"{BASE_URL}/healthz")
    print(f"Render Health Endpoint Response: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print("Render health endpoint not available")

def test_analyze_article():
    """Test the article analysis endpoint"""
    # Sample article data
    article_data = {
        "title": "Sample News Article for Testing",
        "content": "This is a sample news article created for testing the TruthLens API. It contains information that may or may not be accurate. The purpose is to test the analysis capabilities of the system.",
        "url": "https://example.com/sample-article"
    }
    
    # Send analysis request
    print("Sending analysis request...")
    start_time = time.time()
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json=article_data
    )
    end_time = time.time()
    print(f"Response time: {end_time - start_time:.2f} seconds")
    
    print(f"Analyze Endpoint Response: {response.status_code}")
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
    print("Sending report submission...")
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
    print("Testing Deployed TruthLens API...")
    print("\n=== Root Endpoint ===")
    test_root()
    
    print("\n=== Health Endpoint ===")
    test_health()
    
    print("\n=== Render Health Endpoint ===")
    test_render_health()
    
    print("\n=== Article Analysis Endpoint ===")
    analysis_result = test_analyze_article()
    
    print("\n=== Report Submission Endpoint ===")
    test_submit_report()
    
    print("\nAPI Testing Complete!") 