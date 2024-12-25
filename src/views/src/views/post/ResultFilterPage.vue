<template>
    <div class="search-results">
        <h2 class="mb4">Kết quả tìm kiếm các bài đăng có địa chỉ "{{ keySearch }}"</h2>
        <div v-if="posts.length === 0" class="tc">
            <p>Không tìm thấy bài đăng nào.</p>
        </div>
        <div v-else>
            <ul>
                <li v-for="post in posts" :key="post.id" class="post-item mb3">
                    <div v-if="post.files && post.files.length > 0" class="post-files">
                        <div class="file-item">
                            <template v-if="post.files[0].type === 1">
                                <img :src="baseURL + post.files[0].url" alt="Ảnh bài đăng" class="post-image" />
                            </template>
                            <template v-else-if="post.files[0].type === 2">
                                <video :src="baseURL + post.files[0].url" controls class="post-video"></video>
                            </template>
                        </div>
                    </div>
                    <h3>{{ post.title }}</h3>
                    <p>Địa chỉ: {{ post.address }}</p>
                    <p>Giá: {{ formatPrice(post.price) }} VNĐ</p>
                    <p>Diện tích: {{ post.acreage }} m<sup>2</sup></p>
                    <button @click="viewDetails(post.id)">Xem chi tiết</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { filterPostApi } from '@/api/modules/post.api';
import instance from '@/api/axiosConfig';

const posts = ref([]);
const keySearch = ref('');
const route = useRoute();
const router = useRouter();
const baseURL = instance.defaults.baseURL;

onMounted(async () => {
    const body = route.query || {};
    console.log('body', body);
    try {
        const response = await filterPostApi(body);
        posts.value = response.data.data || [];
    } catch (error) {
        console.error('Lỗi khi tìm kiếm bài đăng:', error);
    }
});

const formatPrice = (price) => {
    const validPrice = isNaN(price) ? 0 : price;
    return validPrice.toLocaleString();
};

const viewDetails = async (postId) => {
  router.push({
    name: 'DetailPost',
    params: { id: postId },
  });
};
</script>

<style scoped>
ul, li {
    list-style: none;
    padding: 0;
    margin: 0;
}

.search-results {
    padding: 20px;
}

.post-item {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
}

.post-image {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
}

.post-video {
    width: 100%;
    height: auto;
    margin-top: 10px;
}

.post-files {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}
</style>
