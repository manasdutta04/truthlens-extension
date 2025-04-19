import requests
import json
import time
import argparse
import sys

def check_api_status(url, verbose=False):
    """Check if the API is up and running."""
    try:
        if verbose:
            print(f"Checking API status at {url}...")
        
        # Try to fetch the root endpoint
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            if verbose:
                print(f"✓ API is online (HTTP {response.status_code})")
                print(f"Response: {json.dumps(response.json(), indent=2)}")
            return True
        else:
            if verbose:
                print(f"✗ API returned HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        if verbose:
            print(f"✗ Error connecting to API: {e}")
        return False

def check_health_endpoint(url, verbose=False):
    """Check the health status of the API."""
    try:
        if verbose:
            print(f"Checking health endpoint at {url}/health...")
        
        response = requests.get(f"{url}/health", timeout=10)
        
        if response.status_code == 200:
            health_data = response.json()
            status = health_data.get("status")
            services = health_data.get("services", {})
            
            if status == "healthy":
                if verbose:
                    print(f"✓ API is healthy")
                    print(f"Services: {json.dumps(services, indent=2)}")
                return True
            else:
                if verbose:
                    print(f"⚠ API status is '{status}'")
                    print(f"Services: {json.dumps(services, indent=2)}")
                return status == "healthy"
        else:
            if verbose:
                print(f"✗ Health endpoint returned HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        if verbose:
            print(f"✗ Error connecting to health endpoint: {e}")
        return False

def check_render_health_endpoint(url, verbose=False):
    """Check the Render-specific health endpoint."""
    try:
        if verbose:
            print(f"Checking Render health endpoint at {url}/healthz...")
        
        response = requests.get(f"{url}/healthz", timeout=10)
        
        if response.status_code == 200:
            health_data = response.json()
            status = health_data.get("status")
            
            if status == "healthy":
                if verbose:
                    print(f"✓ Render health check passed")
                return True
            else:
                if verbose:
                    print(f"⚠ Render health status is '{status}'")
                return False
        else:
            if verbose:
                print(f"✗ Render health endpoint returned HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        if verbose:
            print(f"✗ Error connecting to Render health endpoint: {e}")
        return False

def monitor_api(url, interval=60, count=None, verbose=True):
    """
    Monitor the API continuously.
    
    Args:
        url: The base URL of the API
        interval: Time between checks in seconds
        count: Number of checks to perform (None for infinite)
        verbose: Whether to print detailed information
    """
    print(f"Starting API monitor for {url}")
    print(f"Press Ctrl+C to stop monitoring")
    
    check_count = 0
    try:
        while count is None or check_count < count:
            if check_count > 0:
                time.sleep(interval)
            
            print(f"\n--- Check #{check_count + 1} at {time.strftime('%Y-%m-%d %H:%M:%S')} ---")
            
            api_status = check_api_status(url, verbose)
            health_status = check_health_endpoint(url, verbose)
            render_status = check_render_health_endpoint(url, verbose)
            
            if api_status and health_status and render_status:
                print(f"✓ Overall Status: All systems operational")
            elif api_status:
                print(f"⚠ Overall Status: API is up but some services may be degraded")
            else:
                print(f"✗ Overall Status: API appears to be down")
            
            check_count += 1
    except KeyboardInterrupt:
        print("\nMonitoring stopped by user")
    except Exception as e:
        print(f"\nError during monitoring: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Monitor TruthLens API status")
    parser.add_argument("--url", default="https://truthlens-ii4r.onrender.com", help="API base URL")
    parser.add_argument("--interval", type=int, default=60, help="Check interval in seconds")
    parser.add_argument("--count", type=int, default=None, help="Number of checks (default: infinite)")
    parser.add_argument("--quiet", action="store_true", help="Reduce output verbosity")
    
    args = parser.parse_args()
    
    monitor_api(args.url, args.interval, args.count, not args.quiet) 