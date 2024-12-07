//api/modules/auth.api.js
import instance from '@/api/axiosConfig';

const loginApi = async ({ phone, password }) =>
  instance.post('api/public/auth/login', { phone, password });

const registerApi = async ({ name, phone, password }) =>
  instance.post('api/public/auth/register', { name, phone, password });

export { loginApi, registerApi };



