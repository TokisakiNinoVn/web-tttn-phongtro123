<template>
  <header class="w-100 bg-near-white pv2 ph5 fixed top-0 z-5 shadow-1 flex flex-column ">
    <div class="flex justify-end">
      <a href="https://github.com/TokisakiNinoVn" class="link dim mh1">
        <ion-icon name="logo-github" class="f5 dark-gray"></ion-icon>
      </a>
      <a href="https://nino.is-a.dev/" class="link dim mh1">
        <ion-icon name="logo-facebook" class="f5 dark-gray"></ion-icon>
      </a>
      <a href="https://nino.is-a.dev/" class="link dim mh1">
        <ion-icon name="logo-linkedin" class="f5 dark-gray"></ion-icon>
      </a>
      <a href="https://nino.is-a.dev/" class="link dim mh1">
        <ion-icon name="logo-reddit" class="f5 dark-gray"></ion-icon>
      </a>
    </div>
    <div class="flex items-center justify-center">
      <div class="main-header bb b--black-10 pb2 w-100">
        <router-link to="/" class="link dark-gray hover-light-blue">
          <img src="../../assets/logo-phongtro.svg" alt="Logo" class="image-logo" />
        </router-link>
        <nav class="flex items-center">
          <div class="mr4">
            <button @click="openAddressModal" class="btn-reset bg-light-blue hover-bg-blue white pv2 ph3 br-pill pointer mr1 items-center">
              <ion-icon name="location-outline" class="mr1"></ion-icon>Tìm kiếm theo khu vực
            </button>
            <button @click="toggleFilterBox" class="btn-reset bg-light-green hover-bg-green white pv2 ph3 br-pill pointer ">
              <ion-icon name="funnel-outline" class="mr1"></ion-icon>Lọc
            </button>
          </div>
          <ul class="list flex items-center pa0 ma0">
            <li v-if="!isLoggedIn" class="mh3">
              <router-link to="/login" class="link dim dark-gray hover-light-blue">Đăng nhập</router-link>
            </li>
            <li v-if="!isLoggedIn" class="mh3">
              <router-link to="/register" class="link dim dark-gray hover-light-blue">Đăng ký</router-link>
            </li>
            <li v-if="isLoggedIn" class="relative flex items-center">
              <router-link to="/create-post" class="link dim dark-gray mh3 flex items-center hover-bg-light-red br-pill ph2 pv1 bg-light-red white">
                <ion-icon name="cloud-upload-outline" class="mr1"></ion-icon>Đăng tin
              </router-link>
              <router-link :to="`/account`" class="flex items-center link dim dark-gray">
                <span class="mr2">{{ userInfor.name }}</span>
                <!-- :src="userAvatar"  -->
                <img 
                :src="instance.defaults.baseURL + userInfor.avatar.imageUrl" 
                  alt="avatar" 
                  class="br-100 h2 w2 b--black-20 ba pa1 bw1" 
                  onerror="this.src='https:\//i.pinimg.com/736x/3c/67/75/3c67757cef723535a7484a6c7bfbfc43.jpg'"
                />
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    
    <div class="key-fast-search flex justify-center mt3">
      <router-link to="/type/1" class="link dim mh3 dark-gray hover-light-blue">Phòng trọ</router-link>
      <router-link to="/type/2" class="link dim mh3 dark-gray hover-light-blue">Căn hộ</router-link>
      <router-link to="/type/3" class="link dim mh3 dark-gray hover-light-blue">Nhà nguyên căn</router-link>
      <router-link to="/type/4" class="link dim mh3 dark-gray hover-light-blue">Phòng chia sẻ</router-link>
      <router-link to="/type/5" class="link dim mh3 dark-gray hover-light-blue">Phòng dịch vụ</router-link>
      <router-link to="/type/6" class="link dim mh3 dark-gray hover-light-blue">Chỗ ở sinh viên</router-link>
      <!-- <router-link to="/blog" class="link dim mh3 dark-gray hover-light-blue">Blog</router-link> -->
      <router-link to="/service" class="link dim mh3 dark-gray hover-light-blue">Dịch vụ</router-link>
    </div>
  </header>

  <AddressSelectSecond v-if="isModalOpen" @close="closeModal" @complete="updateAddress"/>
  <BoxFilter v-if="isFilterBoxOpen" @close="handleClose" @applyFilter="applyFilter"/>
</template>

<style scoped>
.main-header {
  max-width: 1500px;
  display: flex;
  justify-content: space-between;
}
.image-logo {
  width: 200px;
  max-height: 50px;
}
.header {
  max-width: 1500px;
  margin: 0 auto;
}
.key-fast-search {
  gap: 1.5rem;
}
.btn-reset {
  border: none;
  font-size: 1rem;
  font-weight: bold;
}

button {
  cursor: pointer;
  margin-top: 0px;
}
</style>


<script setup>
// import { ref, onMounted, computed } from 'vue';
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

// const userAvatar = computed(() => {
//     return userInfor.value?.avatar 
//       ? `${instance.defaults.baseURL}/${userInfor.value.avatar}`
//       : 'https://i.pinimg.com/736x/dc/bf/44/dcbf443fe182e29d56214dbe7067a5e3.jpg';
// });

onMounted(async () => {
  const loggedInStatus = localStorage.getItem('isLogin') === 'true';
  const userData = localStorage.getItem('userInfo');

  if (loggedInStatus && userData) {
    isLoggedIn.value = true;
    const parsedUser = JSON.parse(userData);
    userInfor.value = {
      name: parsedUser.name,
      avatar: {
        imageUrl: parsedUser.avatar || 'https://i.pinimg.com/736x/a3/8f/55/a38f5557133c0fd445dc14eea71f0484.jpg',
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
  console.log(filter);
};
</script>
