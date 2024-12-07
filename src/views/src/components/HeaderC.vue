<template>
  <header class="flex items-center justify-between pa3 bg-near-black white fixed top-0 left-0 w-100 z-5">
    <div class="link-contact">
      <a href="https://nino.is-a.dev/" class="link-contact-item"><ion-icon name="logo-github"></ion-icon></a>
      <a href="https://nino.is-a.dev/" class="link-contact-item"><ion-icon name="logo-facebook"></ion-icon></a>
      <a href="https://nino.is-a.dev/" class="link-contact-item"><ion-icon name="logo-linkedin"></ion-icon></a>
      <a href="https://nino.is-a.dev/" class="link-contact-item"><ion-icon name="logo-reddit"></ion-icon></a>
    </div>
    <!-- App Name --> 
    <div class="f4 b">
      <router-link to="/" class="link white">Phongtro123.com</router-link>
    </div>
    <nav class="flex items-center">
      <!-- Search Bar -->
      <input 
        type="text" 
        placeholder="Tìm kiếm..." 
        class="input-reset ba b--moon-gray bg-dark-gray white pa2 br2"
        v-model="searchQuery"
        @keyup.enter="performSearch"
      />

      <!-- Navigation Links -->
      <ul class="list flex items-center ml3">
        <!-- <li class="mh2"><router-link to="/admin-post" class="link white dim">Admin Post</router-link></li> -->
        <li v-if="!isLoggedIn" class="mh2">
          <router-link to="/login" class="link white dim">Đăng nhập</router-link>
        </li>
        <li v-if="!isLoggedIn" class="mh2">
          <router-link to="/signup" class="link white dim">Đăng ký</router-link>
        </li>
        <li v-if="isLoggedIn" class="relative">
          <router-link to="/create-post" class="link white dim">Đăng tin</router-link>
          <router-link :to="`/user/${userInfor.id}`" class="link white flex items-center">
            <span class="mr2">{{ userInfor.name }}</span>
            <img :src="userInfor.avatar.imageUrl" alt="avatar" class="br-100 h2 w2">
          </router-link>
          <!-- <ul class="absolute left-0 mt2 bg-dark-gray white pa2 br2 dn shadow-4">
            <li class="pv1"><a href="#" @click.prevent="showLogoutConfirm" class="link white dim">Đăng xuất</a></li>
            <li class="pv1"><router-link :to="`/user/${userInfor.name}`" class="link white dim">Hồ sơ</router-link></li>
          </ul> -->
        </li>

      </ul>
    </nav>

    <!-- Logout Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed top-0 left-0 w-100 h-100 bg-black-50 flex items-center justify-center">
      <div class="bg-white pa3 br3 w-100 mw6">
        <p class="mb3">Bạn có muốn đăng xuất?</p>
        <div class="flex justify-end">
          <button @click="confirmLogout" class="bg-red white pa2 br2 mr2 pointer dim">Có</button>
          <button @click="cancelLogout" class="bg-light-gray dark-gray pa2 br2 pointer dim">Không</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { loginApi } from '@/api/modules/auth.api'

const router = useRouter();
const searchQuery = ref('');
const isLoggedIn = ref(false);
const userInfor = ref({});
const showConfirmModal = ref(false);


onMounted(() => {
  const loggedInStatus = localStorage.getItem('isLogin') === 'true';
  const userData = localStorage.getItem('userInfo');
  // console.log('userData', userData);

  if (loggedInStatus && userData) {
    isLoggedIn.value = true;
    const parsedUser = JSON.parse(userData);
    // console.log('parsedUser', parsedUser);
    userInfor.value = {
      name: parsedUser.name,
      id: parsedUser.id,
      avatar: {
        imageUrl: parsedUser.avatar || 'https://i.pinimg.com/736x/03/73/62/037362f54125111ea08efb8e42afb532.jpg',
      },
    };
  }
});


const logout = () => {
  localStorage.removeItem('isLogin');
  localStorage.removeItem('userInfo');
  isLoggedIn.value = false;
  userInfor.value = {};
  router.push('/');
};


// const showLogoutConfirm = () => {
//   showConfirmModal.value = true;
// };

const confirmLogout = () => {
  logout();
  showConfirmModal.value = false;
};

const cancelLogout = () => {
  showConfirmModal.value = false;
};

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'SearchResults', query: { query: searchQuery.value.trim() } });
  }
};
</script>



<style scoped>
/* .header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100vw;
  padding: 5px 10px;
} */

.link-contact {
  display: flex;
  align-items: center;
  gap: 10px;
}

.link-contact-item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
</style>