<template>
  <header class="w-100 bg-light-gray pv3 ph4 fixed fixed-header">
    <!-- Contact Links -->
    <div class="link-contact flex justify-end mb3">
      <a href="https://github.com/TokisakiNinoVn" class="link-contact-item mh2 dim">
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
    <div class="header-main flex justify-between items-center">
      <div class="f3 fw7">
        <router-link to="/" class="link dark-gray hover-light-blue">
          Phongtro123.com
        </router-link>
      </div>
      <nav class="flex items-center">
        <div>
          <button @click="openAddressModal"><ion-icon name="location-outline"></ion-icon>Tìm kiếm</button>
          <button @click="toggleFilterBox"><ion-icon name="funnel-outline"></ion-icon>Lọc</button>
        </div>
        <ul class="list flex items-center pa0 ma0">
          <li v-if="!isLoggedIn" class="mh2">
            <router-link to="/login" class="link dim dark-gray hover-light-blue">Đăng nhập</router-link>
          </li>
          <li v-if="!isLoggedIn" class="mh2">
            <router-link to="/register" class="link dim dark-gray hover-light-blue">Đăng ký</router-link>
          </li>
          <li v-if="isLoggedIn" class="relative flex items-center">
            <router-link to="/create-post" class="link dim dark-gray hover-light-blue mh2">Đăng tin</router-link>
            <router-link :to="`/account`" class="link dim dark-gray flex items-center">
              <span class="mr2">{{ userInfor.name }}</span>
              <img :src="instance.defaults.baseURL + userInfor.avatar.imageUrl" alt="avatar" class="br-100 h2 w2 ba b--black-20" />
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
    <div class="key-fast-search">
      <div class="flex justify-center">
        <router-link to="/category/phong-tro">Phòng trọ</router-link>
        <router-link to="/category/can-ho">Căn hộ</router-link>
        <router-link to="/category/can-ho-mini">Căn hộ mini</router-link>
        <router-link to="/blog">Blog</router-link>
        <router-link to="/admin-posts">Bài đăng admin</router-link>
        <router-link to="/pricing">Bảng giá dịch vụ</router-link>
      </div>
    </div>
  </header>

  <AddressSelectSecond v-if="isModalOpen" @close="closeModal" @complete="updateAddress"/>
  <BoxFilter v-if="isFilterBoxOpen" @close="handleClose" @applyFilter="applyFilter"/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import instance from '@/api/axiosConfig';
import { getAllTypesApi } from '@/api/modules/type.api';
// import { searchPostApi } from '@/api/modules/post.api';
import AddressSelectSecond from './AddressSelectSecond.vue';
import BoxFilter from './BoxFilter.vue';
import { useRouter } from 'vue-router';

const isLoggedIn = ref(false);
const userInfor = ref({});
const types = ref([]);
const isModalOpen = ref(false);
const keySearch = ref('');
const isFilterBoxOpen = ref(false);
const showBoxFilter = ref(true);
const router = useRouter();

onMounted(async () => {
  const loggedInStatus = localStorage.getItem('isLogin') === 'true';
  const userData = localStorage.getItem('userInfo');

  if (loggedInStatus && userData) {
    isLoggedIn.value = true;
    const parsedUser = JSON.parse(userData);
    userInfor.value = {
      name: parsedUser.name,
      avatar: {
        imageUrl: parsedUser.avatar || 'default-avatar-url.jpg',
      },
    };
  }

  try {
    const response = await getAllTypesApi();
    types.value = response.data.data;
  } catch (error) {
    console.error('Error fetching types:', error.message);
  }
});

const openAddressModal = () => (isModalOpen.value = true);
const closeModal = () => (isModalOpen.value = false);
const updateAddress = (address) => {
  keySearch.value = `${address.province} - ${address.district}`;
  closeModal();
  if (keySearch.value.trim()) {
    router.push({ name: 'SearchResult', query: { address: keySearch.value.trim() } });
  }
};

const toggleFilterBox = () => {
  isFilterBoxOpen.value = !isFilterBoxOpen.value;
};

const handleClose = () => {
  showBoxFilter.value = false;
  isFilterBoxOpen.value = false;
};

const applyFilter = (filter) => {
  isFilterBoxOpen.value = false;
  console.log('Filter:', filter);
};
</script>



<style scoped>
.box-filter {
  position: fixed;
  bottom: 100px;
  right: 0;
}
.search-box {
  position: fixed;
  bottom: 100px;
  left: 0;
}
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