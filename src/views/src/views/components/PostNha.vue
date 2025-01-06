<template>
  <div class="pa4 bg-near-white">
    <h1 class="f2 fw7 tc underline">Nhà nguyên căn</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap4">
      <div
        v-for="post in posts.slice(0, 6)"
        :key="post.id"
        class="post-item bg-white br3 shadow-3 grow hover-bg-light-gray overflow-hidden relative"
      >
        <!-- Hiển thị ảnh/video -->
        <div class="media-container relative aspect-ratio">
          <img
            v-if="post.files.length > 0"
            :src="instance.defaults.baseURL + post.files[0].url"
            alt="Image post preview"
            class="media-content"
          />
          <video
            v-else-if="post.files.length > 1"
            :src="post.files[0].url"
            controls
            class="media-content"
          ></video>
        </div>
        <div class="pa3 description">
          <h2 class="f4 fw6 mv2 truncate">{{ post.title }}</h2>
          <p class="mv2">
            <span class="price f5 fw5 dark-red">{{ formatPrice(post.price) }}</span>
            <span class="f6"> triệu/tháng</span>
          </p>
          <p class="mv2 flex justify-between flex-column">
            <span class="acreage f5 fw5">{{ post.acreage }} m²</span>
            <span class="address f6 truncate">{{ post.address }}</span>
          </p>
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
import { ref, onMounted } from "vue";
import { getSametypePostApi } from "@/api/modules/post.api";
import instance from "@/api/axiosConfig";
import router from "@/routes";

const posts = ref([]);

// Lấy dữ liệu các bài đăng mới
const fetchNewPosts = async () => {
  const body = { type: 3 };
  try {
    const response = await getSametypePostApi(body);
    if (response.code === 200 || response.data.data != null) {
      posts.value = response.data.data;
    } else {
      console.error("Không thể lấy tin đăng mới", response.message);
    }
  } catch (error) {
    console.error("Lỗi khi gọi API", error);
  }
};

// Chuyển hướng đến trang chi tiết
const viewDetails = (postId) => {
  router.push({
    name: "DetailPost",
    params: { id: postId },
  });
};

// Định dạng giá tiền
const formatPrice = (price) => {
  return price.toLocaleString("vi-VN");
};

onMounted(() => {
  fetchNewPosts();
});
</script>

<style scoped>
/* Grid layout */
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

/* Media container */
.media-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background-color: #f4f4f4;
  overflow: hidden;
}

.media-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.media-container:hover .media-content {
  transform: scale(1.05);
}

/* Post item */
.post-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

/* Price */
.price {
  color: #e63946;
}

/* Button styling */
button {
  border: 1px solid transparent;
}
</style>
