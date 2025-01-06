<template>
  <div class="pa2">
      <h1 class="f2 tc mb4">Các tin đăng mới cập nhật</h1>
      <div class="main-list-post flex flex-wrap justify-between">
          <div v-for="post in posts.slice(0, 6)" :key="post.id" class="post-item w-100 w-50-ns mb4 br3 shadow-2 bg-white">
              <div class="flex flex-column pa3" @click="viewDetails(post.id)">
                <span class="time-akjwhd"><ion-icon name="alarm-outline" class="mr2"></ion-icon> {{ formatDate(post.createdAt) }}</span>
                <div class="flex mt3">
                  <div class="w-40 pr3">
                    <template v-if="post.files.length > 0">
                      <img 
                        v-if="post.files[0].type === 1" 
                        :src="instance.defaults.baseURL + post.files[0].url" 
                        alt="Image post preview" 
                        class="br2" 
                      />
                      <video 
                        v-else-if="post.files[0].type === 2" 
                        :src="instance.defaults.baseURL + post.files[0].url" 
                        controls 
                        class="br2"
                      ></video>
                    </template>
                  </div>
                  <div class="description flex flex-column justify-center">
                    <span class="f4 b mb2">{{ post.title }}</span>
                    <p class="mb1">
                      <span class="price f5 b">{{ formatCurrency(post.price) }}</span>
                      <span class="f5"> triệu/tháng</span>
                    </p>
                    <p class="mb1">
                      <span class="acreage f5 b">{{ post.acreage }}</span>
                      <span class="f5"> m²</span>
                    </p>
                  </div>
                </div>
                <div class="address f5 mb2 mt3 flex items-center justify-center">
                  <ion-icon name="navigate-circle-outline" class="f3 mr2"></ion-icon> {{ post.address }}
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <p class="ma0 flex align-center items-center b mr4"><ion-icon name="person-circle-outline" class="f3 mr2"></ion-icon>{{ post.owner }}</p>
                    <span class="f6 flex align-center items-center"><ion-icon name="call-outline" class="mr2"></ion-icon>{{ post.phone_owner }}</span>
                  </div>
                  <span @click="viewDetails(post.id)" class="pa3 flex justify-center items-center view-more"><ion-icon name="scan-outline"></ion-icon></span>
                </div>
              </div>
          </div>
      </div>
  </div>
</template>

<style scoped>
/* .address {
  
} */
.time-akjwhd {
  font-size: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(245, 66, 66);
  padding: 10px;
  margin-bottom: 10px;
}

.view-more {
  background-color: rgb(245, 66, 66);
  border-radius: 50%;
  width: 12px;
  height: 12px;
  color: white;
}

.view-more:hover {
  background-color: rgba(245, 66, 66, 0.603);
}

.main-list-post {
  display: flex;
  justify-content: space-evenly;
  border-top: 1px solid rgb(245, 66, 66);
  padding-top: 30px;
}

.post-item {
  transition: transform 0.2s;
  max-width: 560px;
}

.post-item:hover {
  transform: translateY(-5px);
}

.post-item img,
.post-item video {
  max-width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.description {
  flex-grow: 1;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { getNewPostApi } from '@/api/modules/post.api';
import instance from '@/api/axiosConfig';
import router from '@/routes';

const posts = ref([]);

const fetchNewPosts = async () => {
  try {
    const response = await getNewPostApi();
    if (response.code === 200 || response.data.data != null) {
      posts.value = response.data.data;  
    } else {
      console.error("Không thể lấy tin đăng mới", response.message);
    }
  } catch (error) {
    console.error("Lỗi khi gọi API", error);
  }
};

onMounted(() => {
  fetchNewPosts();
});

const viewDetails = async (postId) => {
  try {
    router.push({
      name: 'DetailPost',
      params: { id: postId },
    });
  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết bài đăng", error);
  }
};

// Định dạng thời gian
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

// Định dạng tiền
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};
</script>