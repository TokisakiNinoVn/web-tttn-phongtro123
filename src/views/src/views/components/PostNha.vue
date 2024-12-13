<template>
    <div>
        <h1>Nhà nguyên căn</h1>
        <div class="main-list-post">
            <div v-for="post in posts" :key="post.id" class="post-item">
                <!-- Hiển thị ảnh/video đầu tiên -->
                <img v-if="post.files.length > 0" :src="instance.defaults.baseURL + post.files[0].url" alt="Image post preview">
                <video v-else-if="post.files.length > 1" :src="post.files[3].url" controls></video>
                <div class="description">
                    <span class="title">{{ post.title }}</span>
                    <p>
                        <span class="price">{{ post.price }}</span>
                        <span>triệu/tháng</span>
                    </p>
                    <p>
                        <span class="acreage">{{ post.acreage }}</span>
                        <span>m2</span>
                    </p>
                    <p>
                        <span class="address">{{ post.address }}</span>
                    </p>
                </div>
                <button @click="viewDetails(post.id)">Xem chi tiết</button>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { getSametypePostApi } from '@/api/modules/post.api';
// import { getNewPostApi, getPostApi } from '@/api/modules/post.api';
import instance from '@/api/axiosConfig';
import router from '@/routes';

// Khai báo biến lưu dữ liệu tin đăng
const posts = ref([]);

// Hàm gọi API để lấy dữ liệu các bài đăng mới
const fetchNewPosts = async () => {
  const body = {
    type: 3
  }
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

// Gọi API khi component được mount
onMounted(() => {
  fetchNewPosts();
});

// Hàm xử lý khi nhấn nút "Xem chi tiết"
const viewDetails = async (postId) => {
    console.log("Xem chi tiết bài đăng", postId);
  try {
    // Gọi API để lấy chi tiết bài đăng
    // const response = await getPostApi(postId);
    // if (response.code === 200 || response.data) {
    router.push({
      name: 'DetailPost',
      params: { id: postId },
    });
        // state: { postDetails: response.data }
      // });
    // } else {
    //   console.error("Không thể lấy chi tiết bài đăng", response.message);
    // }
  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết bài đăng", error);
  }
};
</script>


<style scoped>
.main-list-post {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.post-item {
    display: flex;
    align-items: center;
    gap: 20px;
}

.post-item img {
    max-width: 150px;
    max-height: 150px;
    object-fit: cover;
}

.post-item video {
    max-width: 150px;
    max-height: 150px;
}

.description {
    flex-grow: 1;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
