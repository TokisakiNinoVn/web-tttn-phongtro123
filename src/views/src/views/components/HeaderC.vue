<template>
  <header class="w-100 bg-light-gray pv3 ph4 fixed fixed-header">
    <!-- Contact Links -->
    <div class="link-contact flex justify-end mb3">
      <a href="https://nino.is-a.dev/" class="link-contact-item mh2 dim">
        <ion-icon name="logo-github" class="f4"></ion-icon>
      </a>
      <a href="https://nino.is-a.dev/" class="link-contact-item mh2 dim">
        <ion-icon name="logo-facebook" class="f4"></ion-icon>
      </a>
      <a href="https://nino.is-a.dev/" class="link-contact-item mh2 dim">
        <ion-icon name="logo-linkedin" class="f4"></ion-icon>
      </a>
      <a href="https://nino.is-a.dev/" class="link-contact-item mh2 dim">
        <ion-icon name="logo-reddit" class="f4"></ion-icon>
      </a>
    </div>

    <!-- Header Main Section -->
    <div class="header-main flex justify-between items-center">
      <div class="f3 fw7">
        <router-link to="/" class="link dark-gray hover-light-blue">
          Phongtro123.com
        </router-link>
      </div>

      <nav class="flex items-center">
        <!-- Search Bar -->
        <input 
          type="text" 
          placeholder="Tìm kiếm..." 
          class="input-reset ba b--black-20 pa2 br2 mr3 w5"
          v-model="searchQuery"
          @keyup.enter="performSearch"
        />

        <!-- Navigation Links -->
        <ul class="list flex items-center pa0 ma0">
          <li v-if="!isLoggedIn" class="mh2">
            <router-link to="/login" class="link dim dark-gray hover-light-blue">
              Đăng nhập
            </router-link>
          </li>
          <li v-if="!isLoggedIn" class="mh2">
            <router-link to="/register" class="link dim dark-gray hover-light-blue">
              Đăng ký
            </router-link>
          </li>
          <li v-if="isLoggedIn" class="relative flex items-center">
            <router-link to="/create-post" class="link dim dark-gray hover-light-blue mh2">
              Đăng tin
            </router-link>
            <router-link :to="`/account`" class="link dim dark-gray flex items-center">
              <span class="mr2">{{ userInfor.name }}</span>
              <img :src="userInfor.avatar.imageUrl" alt="avatar" class="br-100 h2 w2 ba b--black-20">
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import instance from '@/api/axiosConfig';

const router = useRouter();
const searchQuery = ref('');
const isLoggedIn = ref(false);
const userInfor = ref({});
// const showConfirmModal = ref(false);


onMounted(() => {
  const loggedInStatus = localStorage.getItem('isLogin') === 'true';
  const userData = localStorage.getItem('userInfo');
  
  if (loggedInStatus && userData) {
    isLoggedIn.value = true;
    const parsedUser = JSON.parse(userData);

    const avatarUrl = parsedUser.avatar 
      ? `${instance.defaults.baseURL}${parsedUser.avatar}`
      : 'https://i.pinimg.com/736x/03/73/62/037362f54125111ea08efb8e42afb532.jpg';

    userInfor.value = {
      name: parsedUser.name,
      id: parsedUser.id,
      avatar: {
        imageUrl: avatarUrl,
      },
    };
  }
});
const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'SearchResults', query: { query: searchQuery.value.trim() } });
  }
};
</script>

<style scoped>
.fixed-header {
  z-index: 1000;
  top: 0;
}
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