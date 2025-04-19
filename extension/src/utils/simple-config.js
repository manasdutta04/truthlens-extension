// Simple configuration without module system
const TruthLensConfig = {
  development: {
    apiUrl: 'http://localhost:8000'
  },
  production: {
    apiUrl: 'https://truthlens-ii4r.onrender.com'
  }
};

// Determine current environment (defaulting to production for safety)
const environment = 'production';

// Export the config for direct use
const config = TruthLensConfig[environment]; 