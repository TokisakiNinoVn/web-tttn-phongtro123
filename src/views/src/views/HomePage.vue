<template>
    <HeaderC />
    <div class="home-container">
        <NewPostC />
        <PostPhongtroC />
        <PostCanhoC />
        <PostNha />
        <PostSupportC />
        <FooterC />
    </div>
    <!-- Thông báo hết hạn -->
    <div v-if="sessionExpired" class="session-expired">
        <p>Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.</p>
        <button @click="redirectToLogin">Đăng nhập lại</button>
    </div>
    <!-- Thông báo dụ tạo tài khoản -->
    <div v-if="promptRegister" class="prompt-register">
        <button @click="closeNotification"></button>
        <p>Bạn chưa có tài khoản? <br> Đăng ký ngay để tận hưởng các tính năng tuyệt vời!</p>
        <button @click="redirectToRegister">Đăng ký ngay</button>
        <button @click="redirectToLogin">Đăng nhập</button>
    </div>
    <!-- Nút Scroll to Top -->
    <button v-if="showScrollTop" class="scroll-to-top" @click="scrollToTop">
        <ion-icon name="arrow-up-outline"></ion-icon>
    </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import HeaderC from '@/views/components/HeaderC.vue';
import NewPostC from '@/views/components/NewPostC.vue';
import PostPhongtroC from '@/views/components/PostPhongtroC.vue';
import PostCanhoC from '@/views/components/PostCanhoC.vue';
import PostNha from '@/views/components/PostNha.vue';
import PostSupportC from '@/views/components/PostSupportC.vue';
import FooterC from '@/views/components/FooterC.vue';

const router = useRouter();
const sessionExpired = ref(false);
const promptRegister = ref(false);
const showScrollTop = ref(false);

onMounted(() => {
    const isLogin = localStorage.getItem('isLogin');
    const storedLoginTime = localStorage.getItem('loginTime');

    if (isLogin === 'true') {
        if (storedLoginTime) {
            const loginTime = new Date(storedLoginTime);
            const currentTime = new Date();
            const timeDifference = currentTime - loginTime;

            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            if (timeDifference > oneDayInMilliseconds) {
                sessionExpired.value = true;
                localStorage.removeItem('userInfor');
                localStorage.removeItem('token');
                localStorage.setItem('isLogin', 'false');
            }
        } else {
            sessionExpired.value = true;
        }
    } else {
        promptRegister.value = true;
    }

    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

function redirectToLogin() {
    localStorage.removeItem('loginTime');
    router.push('/login');
}

function redirectToRegister() {
    router.push('/register');
}

function closeNotification() {
    promptRegister.value = false;
}

function handleScroll() {
    showScrollTop.value = window.scrollY > 300;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
.home-container {
    text-align: center;
    height: 200vh;
    margin-top: 140px;
}

.session-expired,
.prompt-register {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #f44336;
    color: #fff;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: fadeIn 0.5s ease-in-out;
}

.prompt-register {
    background-color: #2196f3;
}

.prompt-register button {
    background-color: #fff;
    color: #2196f3;
}

.session-expired button {
    background-color: #fff;
    color: #f44336;
}

button {
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}

button:hover {
    background-color: #ffc1c1;
}

.scroll-to-top {
    position: fixed;
    bottom: 80px;
    right: 20px;
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.5s ease-in-out;
}

.scroll-to-top:hover {
    background-color: #1769aa;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
