<template>
    <HeaderC />
    <div class="filter-results pa4">
    <h2 class="tc f2 fw6 mb4">Kết quả sau khi lọc</h2>
    <div v-if="posts.length === 0" class="tc flex w-100 items-center flex-column">
        <img 
        src="https://i.pinimg.com/736x/66/01/25/66012514b347e0e9c1dce46fc48cfe64.jpg" 
        alt="Không tìm thấy" 
        class="not-found-image br4 mb3"
        />
        <p class="f3 black">Oops!... Không tìm thấy bài đăng nào phù hợp với điều kiện lọc của bạn.</p>
        <router-link to="/" class="f5 link dim underline blue mt3">
        <ion-icon name="arrow-back-outline" class="mr2"></ion-icon>Trở về trang chủ
        </router-link>
    </div>
    <div v-else>
        <ul class="flex flex-wrap justify-center list pa0">
        <li 
            v-for="post in posts" 
            :key="post.id" 
            class="post-item bg-light-gray br3 pa3 ma3 shadow-1 w-100 w-40-m w-30-l"
        >
            <div v-if="post.files && post.files.length > 0" class="post-files">
            <div class="file-item">
                <template v-if="post.files[0].type === 1">
                <img 
                    :src="baseURL + post.files[0].url" 
                    alt="Ảnh bài đăng" 
                    class="post-image br3 mb3"
                    @error="handleImageError"
                />
                </template>
                <template v-else-if="post.files[0].type === 2">
                <video 
                    :src="baseURL + post.files[0].url" 
                    controls 
                    class="post-video br3 mb3"
                ></video>
                </template>
            </div>
            </div>
            <h3 class="f4 fw6 mb2 truncate">{{ post.title }}</h3>
            <p class="f5 mb1">
            <ion-icon name="location-outline" class="mr2"></ion-icon>
            <span class="fw6">Địa chỉ:</span> {{ post.address }}
            </p>
            <p class="f5 mb1">
            <ion-icon name="pricetag-outline" class="mr2"></ion-icon>
            <span class="fw6">Giá:</span> {{ formatPrice(post.price) }} VNĐ
            </p>
            <p class="f5 mb3">
            <ion-icon name="expand-outline" class="mr2"></ion-icon>
            <span class="fw6">Diện tích:</span> {{ post.acreage }} m<sup>2</sup>
            </p>
            <button 
            class="f6 link dim br-pill ph3 pv2 mb2 dib white bg-dark-blue hover-bg-blue"
            @click="viewDetails(post.id)"
            >
            Xem chi tiết
            </button>
        </li>
        </ul>
    </div>
    </div>
    <FooterC />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { filterPostApi } from '@/api/modules/post.api';
import instance from '@/api/axiosConfig';
import HeaderC from '../components/HeaderC.vue';
import FooterC from '../components/FooterC.vue';

const posts = ref([]);
const route = useRoute();
const router = useRouter();
const baseURL = instance.defaults.baseURL;

onMounted(async () => {
    const body = route.query || {};
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
    router.push({ name: 'DetailPost', params: { id: postId } });
};

const handleImageError = (event) => {
    event.target.src = '/images/default-image.png'; // Đường dẫn tới hình ảnh mặc định
};
</script>

<style scoped>
.filter-results {
    margin-top: 140px;
    min-height: 90vh;
}

.not-found-image {
    max-width: 200px;
    height: auto;
    animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
    from {
    opacity: 0;
    }
    to {
    opacity: 1;
    }
}

.post-files {
    width: 100%;
    position: relative;
}

.file-item {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.post-image, .post-video {
    width: 100%;
    height: auto;
    object-fit: cover;
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    background-color: #f0f0f0; /* Màu nền mặc định */
}

.post-item {
    transition: transform 0.3s, box-shadow 0.3s;
}
.post-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
    .post-item {
    width: 90%;
    }
}

@media (max-width: 576px) {
    .post-item {
    width: 100%;
    }
}
</style>
