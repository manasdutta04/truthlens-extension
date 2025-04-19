import os
import subprocess
import sys
import argparse

def setup_production_env():
    """Set up production environment variables"""
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("Warning: .env file not found. Using default values.")
    
    # Set production environment variables
    os.environ['LOG_LEVEL'] = 'INFO'
    os.environ['UVICORN_LOG_LEVEL'] = 'warning'
    
    # Override with command line arguments if provided
    parser = argparse.ArgumentParser(description='Deploy TruthLens API in production mode')
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to')
    parser.add_argument('--port', default=8000, type=int, help='Port to bind to')
    parser.add_argument('--workers', default=4, type=int, help='Number of worker processes')
    parser.add_argument('--ssl-keyfile', help='SSL key file path')
    parser.add_argument('--ssl-certfile', help='SSL certificate file path')
    args = parser.parse_args()
    
    # Validate SSL configuration
    if bool(args.ssl_keyfile) != bool(args.ssl_certfile):
        print("Error: Both SSL key file and certificate file must be provided together.")
        sys.exit(1)
    
    return args

def deploy_production(args):
    """Deploy the API in production mode"""
    print(f"Starting TruthLens API in production mode on {args.host}:{args.port} with {args.workers} workers")
    
    # Base command
    cmd = [
        "gunicorn",
        "app.main:app",
        "-w", str(args.workers),
        "-k", "uvicorn.workers.UvicornWorker",
        "-b", f"{args.host}:{args.port}"
    ]
    
    # Add SSL if configured
    if args.ssl_keyfile and args.ssl_certfile:
        cmd.extend([
            "--keyfile", args.ssl_keyfile,
            "--certfile", args.ssl_certfile
        ])
    
    # Start the server
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Failed to start server: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("Server stopped by user")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)

def check_dependencies():
    """Check if necessary dependencies are installed"""
    try:
        import gunicorn
        import uvicorn
        print("Dependencies check passed")
        return True
    except ImportError as e:
        print(f"Missing dependency: {e}")
        print("Please install required dependencies:")
        print("pip install gunicorn uvicorn")
        return False

if __name__ == '__main__':
    # Make sure we're in the backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    if not check_dependencies():
        sys.exit(1)
    
    args = setup_production_env()
    deploy_production(args) 