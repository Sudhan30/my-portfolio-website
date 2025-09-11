// Environment variables utility
// Handles both development (.env) and production (injected) environment variables

const getEnvVar = (key, defaultValue = '') => {
  // In production, environment variables are injected via window.env
  if (window.env && window.env[key]) {
    return window.env[key];
  }
  
  // In development, use process.env
  if (process.env[key]) {
    return process.env[key];
  }
  
  // Fallback to default value
  return defaultValue;
};

export const config = {
  // Google Cloud Project ID
  GCP_PROJECT_ID: getEnvVar('REACT_APP_GCP_PROJECT_ID', 'your-project-id'),
  
  // Cloud Functions Base URL
  CLOUD_FUNCTIONS_URL: getEnvVar('REACT_APP_CLOUD_FUNCTIONS_URL', 'https://us-central1-your-project-id.cloudfunctions.net'),
  
  // Individual function URLs
  get pageViewUrl() {
    return `${this.CLOUD_FUNCTIONS_URL}/pageView`;
  },
  
  get submitFeedbackUrl() {
    return `${this.CLOUD_FUNCTIONS_URL}/submitFeedback`;
  },
  
  get submitContactFormUrl() {
    return `${this.CLOUD_FUNCTIONS_URL}/submitContactForm`;
  },
  
  get analyzeJobDescriptionUrl() {
    return `${this.CLOUD_FUNCTIONS_URL}/analyzeJobDescription`;
  }
};

// Debug function to check environment variables
export const debugEnv = () => {
  console.log('Environment Configuration:');
  console.log('GCP_PROJECT_ID:', config.GCP_PROJECT_ID);
  console.log('CLOUD_FUNCTIONS_URL:', config.CLOUD_FUNCTIONS_URL);
  console.log('window.env:', window.env);
  console.log('process.env keys:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
};

// Alias for backward compatibility
export const getEnvConfig = () => config;

export default config;
