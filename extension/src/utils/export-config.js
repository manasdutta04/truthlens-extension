// This script exports the config for direct inclusion in the HTML
(function() {
  window.truthlensConfig = {
    development: {
      apiUrl: 'http://localhost:8000'
    },
    production: {
      apiUrl: 'https://truthlens-ii4r.onrender.com'
    }
  };
  
  // Determine environment
  const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  
  // Export the config
  window.currentConfig = window.truthlensConfig[environment];
})(); 