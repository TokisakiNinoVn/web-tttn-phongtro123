// src/apis/axiosConfig.js
import axios from 'axios';
// import { useRouter } from 'vue-router'; // Nếu bạn đang dùng Vue Router
// const router = useRouter();
const instance = axios.create({
  baseURL: 'http://localhost:5007',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => {
    // Xử lý phản hồi thành công
    return response;
  },
  (error) => {
    if (error.response) {
      const { code, status, message } = error.response.data;

      // Kiểm tra nếu lỗi liên quan đến JWT hết hạn
      if (code === 400 && status === 'JsonWebTokenError' && message === 'jwt expired') {
        alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/login'; 
          // router.push('/login');
      }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;

