<template>
    <HeaderC />
    <div class="search-results">
        <h2 class="results-title">Kết quả tìm kiếm theo khu vực </h2>
        <h2 class="results-title">"{{ keySearch }}"</h2>
        <div v-if="posts.length === 0" class="empty-results">
            <img 
                src="https://i.pinimg.com/736x/66/01/25/66012514b347e0e9c1dce46fc48cfe64.jpg" 
                alt="Không tìm thấy" 
                class="not-found-image"
            />
            <p>Không tìm thấy bài đăng nào phù hợp.</p>
        </div>
        <div v-else>
            <ul class="post-list">
                <li v-for="post in posts" :key="post.id" class="post-item">
                    <div v-if="post.files && post.files.length > 0" class="post-files">
                        <div class="file-item">
                            <template v-if="post.files[0].type === 1">
                                <img 
                                    :src="baseURL + post.files[0].url" 
                                    alt="Ảnh bài đăng" 
                                    class="post-image"
                                    @error="handleImageError"
                                />
                            </template>
                            <template v-else-if="post.files[0].type === 2">
                                <video 
                                    :src="baseURL + post.files[0].url" 
                                    controls 
                                    class="post-video"
                                ></video>
                            </template>
                        </div>
                    </div>
                    <div class="post-details">
                        <h3 class="post-title">{{ post.title }}</h3>
                        <p class="post-info">
                            <ion-icon name="location-outline"></ion-icon> {{ post.address }}
                        </p>
                        <p class="post-info">
                            <ion-icon name="pricetag-outline"></ion-icon> {{ formatPrice(post.price) }} VNĐ
                        </p>
                        <p class="post-info">
                            <ion-icon name="expand-outline"></ion-icon> {{ post.acreage }} m<sup>2</sup>
                        </p>
                        <button 
                            class="btn-view-details"
                            @click="viewDetails(post.id)"
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <FooterC />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchPostApi } from '@/api/modules/post.api';
import instance from '@/api/axiosConfig';
import HeaderC from '../components/HeaderC.vue';
import FooterC from '../components/FooterC.vue';

const posts = ref([]);
const keySearch = ref('');
const route = useRoute();
const router = useRouter();
const baseURL = instance.defaults.baseURL;

onMounted(async () => {
    const query = route.query || {};
    keySearch.value = query.address || 'Tất cả';
    try {
        const response = await searchPostApi(query);
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

const handleImageError = (event) => {
    event.target.src = '/images/default-image.png'; // Hình ảnh mặc định
};
</script>

<style scoped>
.search-results {
    padding: 20px;
    margin-top: 140px;
    min-height: 90vh;
}

.results-title {
    font-size: 1.8rem;
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
}

.empty-results {
    text-align: center;
    margin-top: 50px;
}

.not-found-image {
    max-width: 200px;
    height: auto;
    margin-bottom: 10px;
    opacity: 0.8;
}

.post-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.post-item {
    width: 100%;
    max-width: 300px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.post-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.post-files {
    width: 100%;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #f9f9f9;
}

.post-image, .post-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.post-details {
    padding: 15px;
}

.post-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.post-info {
    font-size: 0.9rem;
    margin: 5px 0;
    color: #555;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-view-details {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-view-details:hover {
    background: #0056b3;
}
</style>
