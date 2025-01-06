<template>
  <div class="pa4 bg-near-white">
    <h1 class="f2 fw7 tc underline">Các bài đăng căn hộ mới</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap4">
      <div
        v-for="post in posts.slice(0, 6)"
        :key="post.id"
        class="post-item bg-white br3 shadow-3 grow hover-bg-light-gray overflow-hidden relative"
      >
        <div class="media-container relative aspect-ratio--16x9">
          <img
            v-if="post.files.length > 0"
            :src="instance.defaults.baseURL + post.files[0].url"
            alt="Image post preview"
            class="db br3 w-100 h-100 cover"
          />
          <video
            v-else-if="post.files.length > 1"
            :src="post.files[0].url"
            controls
            class="db br3 w-100 h-100"
          ></video>
          <div class="absolute top-0 left-0 pa2 bg-dark-blue white br--right">Mới</div>
        </div>
        <div class="pa3">
          <h2 class="f4 fw6 mv2 truncate">{{ post.title }}</h2>
          <p class="mv2">
            <span class="price f5 fw5 dark-red">{{ formatCurrency(post.price) }}</span> /tháng
          </p>
          <p class="mv2 flex justify-between flex-column">
            <span class="acreage f5 fw5">{{ post.acreage }} m²</span>
            <span class="address f6 truncate">{{ post.address }}</span>
          </p>
          <p class="mv2 f6 truncate">{{ post.description }}</p>
          <button
            class="f6 link dim br-pill ba bw1 ph3 pv2 mt3 w-100 tc bg-light-blue hover-bg-blue white"
            @click="viewDetails(post.id)"
          >
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

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value * 1);
};

const fetchNewPosts = async () => {
  const body = {
    type: 2,
  };
  try {
    const response = await getSametypePostApi(body);
    if (response.code === 200 || response.data.data != null) {
      posts.value = response.data.data;
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

const viewDetails = (postId) => {
  router.push({
    name: 'DetailPost',
    params: { id: postId },
  });
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.media-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background-color: #f4f4f4;
}

.media-container img,
.media-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.media-container:hover img,
.media-container:hover video {
  transform: scale(1.05);
}

.post-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.price {
  color: #e63946;
}

button {
  border: 1px solid transparent;
}
</style>
