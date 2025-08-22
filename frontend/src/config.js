// Configuration for backend URLs
const config = {
  // Backend API URL - change this to your Railway deployment URL
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  
  // ML API URL - change this to your Railway ML deployment URL
  ML_API_URL: import.meta.env.VITE_ML_API_URL || 'http://localhost:5001',
  
  // Environment
  ENV: import.meta.env.MODE || 'development'
};

export default config;
