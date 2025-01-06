<template>
    <HeaderC />
    <div class="main-getotp tc">
    <div class="pa4 w-90 w-50-l mw6 center bg-white br3 shadow-5">
        <h1 class="f3 f2-ns fw6 mb3 pink">Quên mật khẩu</h1>
        <form @submit.prevent="submitForm">
        <div class="form-group mb4">
            <label for="phone" class="f6 fw5 db mb2">
            <i class="fas fa-phone-alt mr2"></i> Nhập số điện thoại bạn đã đăng ký:
            </label>
            <input
            type="phone"
            v-model="phone"
            id="phone"
            required
            class="input-reset ba b--moon-gray pa2 br2 w-100"
            placeholder="Nhập số điện thoại..."
            />
        </div>
        <button
            type="submit"
            class="f6 link dim br3 ph3 pv2 mb2 dib white bg-dark-pink shadow-4"
        >
            <i class="fas fa-paper-plane mr2"></i> Lấy mã OTP
        </button>
        </form>
    </div>
    </div>
    <FooterC />
</template>

<style scoped>
.main-getotp {
    margin-top: 140px;
    min-height: 90vh;
    background: linear-gradient(135deg, #a8edea, #fed6e3);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

input:focus {
    outline: none;
    border-color: #ff69b4;
    box-shadow: 0 0 5px 0 rgba(255, 105, 180, 0.5);
}

button:focus {
    outline: none;
    box-shadow: 0 0 8px 2px rgba(255, 20, 147, 0.7);
}
</style>
  

<script setup>
import { ref } from 'vue';
import { getCodeApi } from '@/api/modules/user.api';
import { useRouter } from 'vue-router';
import HeaderC from '@/views/components/HeaderC.vue';
import FooterC from '@/views/components/FooterC.vue';

const phone = ref('');
const router = useRouter();
const submitForm = () => {
    getCode();
};

const getCode = async () => {
    try {
        const response = await getCodeApi({ phone: phone.value });
        if (response?.status === 200) {
            const message = response.data.message;
            alert(message);
            setTimeout(async () => {
                await router.push('/reset-password');
            }, 1000);
        } else {
            throw new Error('Failed to send code');
        }
    } catch (error) {
        console.error('error:', error);
    }
};
</script>

