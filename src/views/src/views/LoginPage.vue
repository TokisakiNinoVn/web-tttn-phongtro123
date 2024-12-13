<template>
  <div class="login-container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="phone">Số điện thoại:</label>
        <input v-model="phone" type="text" id="phone" required />
      </div>
      <div>
        <label for="password">Mật khẩu:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit">Đăng nhập</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>Chưa có tài khoản? <router-link to="/register">Đăng ký</router-link></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginApi } from '@/api/modules/auth.api.js';

const phone = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await loginApi({ phone: phone.value, password: password.value });

    if (response?.status === 'success' || response.data) {
      // Lưu toàn bộ dữ liệu từ field `data` vào localStorage
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('userInfo', JSON.stringify(response.data.data));
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('token', JSON.stringify(response.data.token));

      // Lấy thời gian hiện tại
      const loginTime = new Date().toISOString();

      // Lưu vào localStorage
      localStorage.setItem('loginTime', loginTime);

      // Chuyển hướng về trang chính
      await router.push('/');
    } else {
      throw new Error('Đăng nhập thất bại, thông tin không chính xác.');
    }
  } catch (error) {
    errorMessage.value = error.message || 'Đã xảy ra lỗi, vui lòng thử lại!';
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9em;
  margin-top: 8px;
}
</style>
