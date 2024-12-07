<template>
    <!-- <AppOwnerHeader /> -->
    <HeaderC />
    <div class="home-container">
    <h2>Trang chủ</h2>
    <!-- <template v-if="isLoggedIn">
        <button @click="handleLogout">Đăng xuất</button>
    </template>
    <template v-else>
        <router-link to="/login">Đăng nhập</router-link>
    </template> -->
    </div>
</template>

<script setup>
// import { ref } from 'vue';
// import { useRouter } from 'vue-router';
// import AppOwnerHeader from '@/components/OwnerHeaderC.vue';
import HeaderC from '@/components/HeaderC.vue';

// const isLoggedIn = ref(localStorage.getItem('userToken') !== null);
// const router = useRouter();

// Hàm xử lý đăng xuất
// const handleLogout = () => {
//     localStorage.removeItem('userToken');
//     isLoggedIn.value = false;
//     router.push('/login');
// };
</script>

<style scoped>
.home-container {
    text-align: center;
    height: 200vh;
    margin-top: 100px;
}
</style>
