<template>
  <div class="register-container">
    <h2>Đăng ký tài khoản</h2>
    <form @submit.prevent="register">
      <div>
        <label for="name">Tên:</label>
        <input v-model="name" type="text" id="name" required />
      </div>
      <div>
        <label for="phone">Số điện thoại:</label>
        <input v-model="phone" type="text" id="phone" required />
      </div>
      <div>
        <label for="password">Mật khẩu:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit">Đăng ký</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
    </form>
  </div>
</template>

<script>
// Import API service để sử dụng hàm đăng ký
import { registerApi } from '@/api/modules/auth.api.js';

export default {
  data() {
    return {
      name: '',
      phone: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async register() {
      try {
        const response = await registerApi({name: this.name, phone: this.phone, password: this.password });
        if (response.data?.code == 401) {
          this.errorMessage = response.data?.message || 'Đăng ký thất bại, vui lòng kiểm tra lại thông tin!';
        } else {
          alert('Đăng ký thành công!');
          this.$router.push('/login');
        }
      } catch (error) {
        this.errorMessage = 'Đăng ký thất bại, vui lòng kiểm tra lại thông tin!';
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
