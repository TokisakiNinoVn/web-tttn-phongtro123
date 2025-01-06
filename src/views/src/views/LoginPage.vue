<template>
  <HeaderC />
  <div class="login-container flex flex-column items-center pa4">
    <h2 class="f2 fw6 mb4">Đăng nhập</h2>
    <div class="login-box w-100 w-50-m w-30-l bg-white pa4 br3 shadow-1">
      <form @submit.prevent="handleLogin" class="flex flex-column">
        <div class="mb3">
          <label for="phone" class="db mb2 fw6">Số điện thoại:</label>
          <input
            v-model="phone"
            type="text"
            id="phone"
            required
            class="input-reset ba b--black-20 pa2 br2 w-100 focus-outline"
          />
        </div>
        <div class="mb3">
          <label for="password" class="db mb2 fw6">Mật khẩu:</label>
          <input
            v-model="password"
            type="password"
            id="password"
            required
            class="input-reset ba b--black-20 pa2 br2 w-100 focus-outline"
          />
        </div>
        <button
          type="submit"
          class="bg-blue white pv2 ph3 br2 grow pointer fw6 hover-bg-dark-blue shadow-2"
        >
          Đăng nhập
        </button>
        <p v-if="errorMessage" class="error mt3 tc red f6 fw5">
          {{ errorMessage }}
        </p>
      </form>
      <div class="mt4">
        <p class="tc">
          Chưa có tài khoản?
          <router-link to="/register" class="blue underline">Đăng ký</router-link>
        </p>
        <p class="tc">
          <router-link to="/get-otp-forget-password" class="blue underline">
            Quên mật khẩu
          </router-link>
        </p>
      </div>
    </div>
  </div>
  <FooterC />
</template>

<style scoped>
.login-container {
  margin-top: 140px;
  min-height: 90vh;
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 1s ease-in-out;
}

.login-box {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.login-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.login-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.input-reset {
  outline: none;
  transition: box-shadow 0.3s;
}

.input-reset:focus {
  box-shadow: 0 0 5px rgba(33, 150, 243, 0.6);
  border-color: #2196f3;
}

.error {
  font-size: 0.9em;
  color: red;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginApi } from '@/api/modules/auth.api.js';
import HeaderC from '@/views/components/HeaderC.vue';
import FooterC from '@/views/components/FooterC.vue';

const phone = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
    const response = await loginApi({ phone: phone.value, password: password.value });
    if (response.data?.code == 400 || response.data?.code == 401 || response.data?.code == 404) { 
      errorMessage.value = response.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại!';
    } else {
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('userInfo', JSON.stringify(response.data.data));
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('token', JSON.stringify(response.data.token));
      const loginTime = new Date().toISOString();
      localStorage.setItem('loginTime', loginTime);
      await router.push('/');
    }
  };
</script>