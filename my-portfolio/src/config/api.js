import axios from 'axios';

/**
 * This is a smart API configuration module.
 *
 * In a local development environment ('npm run dev'), Vite does not
 * replace `import.meta.env.VITE_API_BASE_URL`, so it will be undefined.
 * In that case, we fall back to our local backend server.
 *
 * When Vercel builds the project for production, it will find the
 * VITE_API_BASE_URL environment variable we set in the dashboard
 * and inject its value into the code.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// We log the URL to the console for easy debugging, so you can see
// which API endpoint your application is trying to use.
console.log(`API Base URL is set to: ${API_BASE_URL}`);

// Create a pre-configured instance of axios.
// Any part of your app can now import 'api' and use it to make requests.
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});