import axios from 'axios';

// Dynamically choose the base URL
const productionUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:7000/api'
    : 'https://brokers-backend-h2nt.onrender.com/api';

// Use typeof to infer the type from axios.create()
export const customFetch = axios.create({
  baseURL: productionUrl,
} as const);

// Formatter for EUR currency
export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});