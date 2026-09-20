import axios from 'axios';

const api = axios.create({
  baseURL: 'https://engima-technical-club-website-3.onrender.com/api',
  withCredentials: true
});

export default api;
