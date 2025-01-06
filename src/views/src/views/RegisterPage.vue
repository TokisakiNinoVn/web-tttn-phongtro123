<template>
  <HeaderC />
  <div class="register-container flex flex-column items-center pa4">
    <h2 class="f2 fw6 mb4">Đăng ký tài khoản</h2>
    <div class="register-box w-100 w-50-m w-30-l bg-white pa4 br3 shadow-1">
      <form @submit.prevent="register" class="flex flex-column">
        <div class="mb3">
          <label for="name" class="db mb2 fw6">Tên:</label>
          <input
            v-model="name"
            type="text"
            id="name"
            required
            class="input-reset ba b--black-20 pa2 br2 w-100 focus-outline"
          />
        </div>
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
          class="bg-green white pv2 ph3 br2 grow pointer fw6 hover-bg-dark-green shadow-2"
        >
          Đăng ký
        </button>
        <p v-if="errorMessage" class="error mt3 tc red f6 fw5">
          {{ errorMessage }}
        </p>
      </form>
      <div class="mt4">
        <p class="tc">
          Đã có tài khoản? <router-link to="/login" class="blue underline">Đăng nhập</router-link>
        </p>
      </div>
    </div>
  </div>
  <FooterC />
</template>

<style scoped>
.register-container {
  margin-top: 140px;
  min-height: 90vh;
  background: linear-gradient(135deg, #e3ffe7, #d9e7ff);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 1s ease-in-out;
}

.register-box {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.register-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.input-reset {
  outline: none;
  transition: box-shadow 0.3s;
}

.input-reset:focus {
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.6);
  border-color: #4caf50;
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
import { registerApi } from '@/api/modules/auth.api.js';
import HeaderC from '@/views/components/HeaderC.vue';
import FooterC from '@/views/components/FooterC.vue';

const name = ref('');
const phone = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

// Kiểm tra số điện thoại, mật khẩu và tên
const validateForm = () => {
  const phoneRegex = /^0\d{9}$/; // Số điện thoại bắt đầu bằng 0 và có 10 số
  if (!name.value.trim()) {
    errorMessage.value = 'Tên không được để trống!';
    return false;
  }
  if (!phoneRegex.test(phone.value)) {
    errorMessage.value = 'Số điện thoại phải bắt đầu bằng 0 và có 10 số!';
    return false;
  }
  if (password.value.length < 6) {
    errorMessage.value = 'Mật khẩu phải có ít nhất 6 ký tự!';
    return false;
  }
  return true;
};

const register = async () => {
  if (!validateForm()) return;

  try {
    const response = await registerApi({ name: name.value, phone: phone.value, password: password.value });
    if (response.data?.code == 401) {
      errorMessage.value = response.data?.message || 'Đăng ký thất bại, vui lòng kiểm tra lại thông tin!';
    } else {
      alert('Đăng ký thành công!');
      router.push('/login');
    }
  } catch (error) {
    errorMessage.value = 'Đăng ký thất bại, vui lòng kiểm tra lại thông tin!';
  }
};
</script>