// Configuration values for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:8000'
  },
  production: {
    apiUrl: 'https://truthlens-ii4r.onrender.com' // Updated to the live Render URL
  }
};

// Determine which environment to use
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// Export the configuration for the current environment
export default config[environment]; 