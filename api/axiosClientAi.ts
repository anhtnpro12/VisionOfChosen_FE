import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const axiosClientAi: AxiosInstance = axios.create({
  baseURL: 'http://54.206.79.208:8000',
  timeout: 60 * 60 * 1000, // 60p
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

axiosClientAi.interceptors.request.use(
  (config) => {
    const sessionId = Cookies.get('sessionId');
    if (sessionId) {
      config.headers['X-Session-ID'] = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosClientAi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 8000 error:", error);
    return Promise.reject(error);
  }
);

export default axiosClientAi; 