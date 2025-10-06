
import axios, { AxiosError } from 'axios';

// Helper to send log messages to our own logging API
const sendLog = async (data: any) => {
    // Use a separate, basic fetch to avoid creating a loop with axios interceptors
    try {
        await fetch('/api/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    } catch (logError) {
        // If the logging API itself fails, log to console as a last resort.
        console.error("Logging to /api/log failed:", logError);
    }
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    // Log the request before sending it
    sendLog({ 
        type: 'request', 
        url: config.url, 
        method: config.method, 
        data: config.data 
    });
    return config;
  },
  (error) => {
    // Log request errors
    sendLog({ type: 'request_error', error });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Log successful responses
    sendLog({ 
        type: 'response', 
        url: response.config.url, 
        status: response.status, 
        data: response.data 
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Detailed error logging
    const errorLog = {
        type: 'response_error',
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        response: error.response?.data,
        request: {
            method: error.config?.method,
            data: error.config?.data,
        },
    };
    sendLog(errorLog);
    // Log the full error object as a string to prevent browser console from collapsing it
    console.error("API Error:", JSON.stringify(errorLog, null, 2));

    // @ts-ignore
    if (error.response?.status === 401 && !originalRequest?._retry) {
      // @ts-ignore
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        if (originalRequest) {
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            // @ts-ignore
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            return api(originalRequest);
        }

      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
