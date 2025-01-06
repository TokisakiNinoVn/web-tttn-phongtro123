<template>
  <div class="main-content pa4">
    <h1 class="title-content f2 fw6 mb4 pb3">Các phòng trọ mới đăng</h1>
    <div class="flex flex-wrap justify-center">
      <div v-for="post in displayedPosts" :key="post.id" class="post-item w-100 w-50-m w-25-l pa2">
        <!-- Hiển thị ảnh/video đầu tiên -->
        <div class="aspect-ratio aspect-ratio--4x3 mb3">
          <template v-if="post.files.length > 0">
            <img
              v-if="post.files[0].type === 1"
              :src="instance.defaults.baseURL + post.files[0].url"
              alt="Image post preview"
              class="aspect-ratio--object br3 shadow-1"
            />
            <video
              v-else-if="post.files[0].type === 2"
              :src="instance.defaults.baseURL + post.files[0].url"
              controls
              class="aspect-ratio--object br3 shadow-1"
            ></video>
          </template>
          <video v-else-if="post.files.length > 1" :src="post.files[3].url" controls class="aspect-ratio--object br3 shadow-1"></video>
        </div>

        <div class="description pa3 bg-light-gray br3 shadow-1">
          <h2 class="f5 fw6 mb2">{{ post.title }}</h2>
          <p class="f6 lh-copy mb1">
            <span class="b">{{ formatCurrency(post.price) }}</span> triệu/tháng
          </p>
          <p class="f6 lh-copy mb1">
            <span class="b">{{ post.acreage }}</span> m²
          </p>
          <p class="f6 lh-copy">
            <span class="">{{ post.address }}</span>
          </p>
          <button @click="viewDetails(post.id)" class="mt3 w-100 tc br2 bg-blue white pa2 pointer grow">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getSametypePostApi } from '@/api/modules/post.api';
import instance from '@/api/axiosConfig';
import router from '@/routes';

const posts = ref([]);
const displayedPosts = ref([]);

const fetchNewPosts = async () => {
  const body = {
    type: 1,
  };
  try {
    const response = await getSametypePostApi(body);
    if (response.code === 200 || response.data.data != null) {
      posts.value = response.data.data;
      displayedPosts.value = posts.value.slice(0, 8); // Lấy tối đa 8 bài đăng
    } else {
      console.error('Không thể lấy tin đăng mới', response.message);
    }
  } catch (error) {
    console.error('Lỗi khi gọi API', error);
  }
};

onMounted(() => {
  fetchNewPosts();
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(value);
};

const viewDetails = async (postId) => {
  console.log('Xem chi tiết bài đăng', postId);
  try {
    router.push({
      name: 'DetailPost',
      params: { id: postId },
    });
  } catch (error) {
    console.error('Lỗi khi gọi API chi tiết bài đăng', error);
  }
};
</script>

<style scoped>
.main-content, .post-item {
  z-index: 1;
}

.title-content {
  border-bottom: 1px solid #f32828;
}

</style>
