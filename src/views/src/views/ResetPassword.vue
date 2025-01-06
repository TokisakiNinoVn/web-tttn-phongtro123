<template>
    <HeaderC />
    <div class="main-container flex justify-center items-center min-vh-100 bg-light-gray">
    <div class="reset-password pa4 bg-white br3 shadow-4 mw7 center">
        <div class="tc mb4">
        <h1 class="f3 fw6 mb3">Đặt lại mật khẩu</h1>
        <p class="f5 gray">Vui lòng nhập thông tin để đặt lại mật khẩu của bạn</p>
        </div>
        <form @submit.prevent="resetPassword">
        <div class="mb4">
            <label for="code" class="db mb2 f5 b">Mã OTP:</label>
            <input
            type="text"
            id="code"
            v-model="body.code"
            required
            class="pa3 input-reset ba b--light-gray bg-white hover-bg-lightest-blue w-100 br3"
            placeholder="Nhập mã OTP"
            />
        </div>
        <div class="mb4">
            <label for="phone" class="db mb2 f5 b">Số điện thoại:</label>
            <input
            type="text"
            id="phone"
            v-model="body.phone"
            required
            @input="validatePhone"
            class="pa3 input-reset ba b--light-gray bg-white hover-bg-lightest-blue w-100 br3"
            placeholder="Nhập số điện thoại"
            />
            <span v-if="phoneError" class="error f6 red">{{
            phoneError
            }}</span>
        </div>
        <div class="mb4">
            <label for="newPassword" class="db mb2 f5 b">Mật khẩu mới:</label>
            <input
            type="password"
            id="newPassword"
            v-model="body.newPassword"
            required
            @input="validatePassword"
            class="pa3 input-reset ba b--light-gray bg-white hover-bg-lightest-blue w-100 br3"
            placeholder="Nhập mật khẩu mới"
            />
            <span v-if="passwordError" class="error f6 red">{{
            passwordError
            }}</span>
        </div>

        <div class="mb4">
            <label for="confirmPassword" class="db mb2 f5 b">Xác nhận mật khẩu:</label>
            <input
            type="password"
            id="confirmPassword"
            v-model="body.confirmPassword"
            required
            class="pa3 input-reset ba b--light-gray bg-white hover-bg-lightest-blue w-100 br3"
            placeholder="Nhập lại mật khẩu mới"
            />
        </div>
        <div class="tc">
            <button
            type="submit"
            :disabled="phoneError || passwordError"
            class="b ph4 pv3 input-reset ba b--black bg-blue white f5 br3 pointer hover-bg-dark-blue flex items-center justify-center"
            >
            <i class="fas fa-lock mr3"></i> Đặt lại mật khẩu
            </button>
        </div>
        </form>
        <div class="tc mt4">
            <router-link to="/login" class="f5 blue underline">Quay lại đăng nhập</router-link>
        </div>
    </div>
    </div>
    <FooterC />
</template>

<style scoped>
.error {
    color: red;
    font-size: 0.9em;
}

.main-container {
    margin-top: 40px;
    min-height: 90vh;
}

.reset-password {
    padding: 3rem;
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
}

.reset-password h1 {
    text-align: center;
    color: #333;
}

.reset-password form {
    width: 100%;
}

.reset-password button {
    width: 100%;
    padding: 14px;
    font-size: 1.2rem;
    border-radius: 5px;
}

.reset-password button:hover {
    background-color: #005f99;
}

@media screen and (max-width: 767px) {
    .main-container {
    margin-top: 10px;
    }
    .reset-password {
    padding: 2rem;
    }
}
</style>

<script setup>
import { forgetPasswordApi } from '@/api/modules/user.api';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import HeaderC from '@/views/components/HeaderC.vue';
import FooterC from '@/views/components/FooterC.vue';

const router = useRouter();
const body = {
    code: '',
    phone: '',
    newPassword: '',
};

const phoneError = ref('');
const passwordError = ref('');

const validatePhone = () => {
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(body.phone)) {
        phoneError.value = 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 số.';
    } else {
        phoneError.value = '';
    }
};

const validatePassword = () => {
    if (body.newPassword.length < 6) {
        passwordError.value = 'Mật khẩu phải có tối thiểu 6 ký tự.';
    } else {
        passwordError.value = '';
    }
};

const resetPassword = async () => {
    validatePhone();
    validatePassword();
    if (phoneError.value || passwordError.value) {
        return;
    }

    const response = await forgetPasswordApi(body);
    if (response.data?.code == 200) {
        alert(response.data.message);
        router.push('/login');
    } else if (response.data?.code == 400 || response.data?.code == 404) {
        alert(response.data?.message);
    } else {
        alert('Failed to reset password');
    }
};
</script>
