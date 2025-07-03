// my-portfolio/src/config/api.js
import axios from 'axios';
// This file centralizes the API URL for easy configuration between development and production.
export const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});