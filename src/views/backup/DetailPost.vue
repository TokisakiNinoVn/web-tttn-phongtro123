<template>
    <div>
        <h1>Detail Post</h1>
        
        <!-- Show loading indicator -->
        <div v-if="isLoading">Loading...</div>
        
        <!-- Show error message if there's an error -->
        <div v-else-if="error">{{ error }}</div>
        
        <!-- Show post details if successfully loaded -->
        <div v-else>
            <h2>{{ post?.title }}</h2>
            <p><strong>Description:</strong> {{ post?.description || "No description available" }}</p>
            <p><strong>Price:</strong> {{ post?.price }} triệu/tháng</p>
            <p><strong>Address:</strong> {{ post?.address }}</p>
            <p><strong>Real Address:</strong> {{ post?.realaddress || "N/A" }}</p>
            <p><strong>Owner:</strong> {{ post?.owner }} - {{ post?.phone_owner }}</p>
            <p><strong>Acreage:</strong> {{ post?.acreage }} m²</p>
            <p><strong>Created At:</strong> {{ post?.createdAt ? new Date(post.createdAt).toLocaleString() : "N/A" }}</p>
            <p><strong>Updated At:</strong> {{ post?.updatedAt ? new Date(post.updatedAt).toLocaleString() : "N/A" }}</p>
            <p><strong>Active:</strong> {{ post?.active === 1 ? "Yes" : "No" }}</p>

            <!-- Amenities list -->
            <h3>Amenities</h3>
            <ul>
                <li v-for="(value, key) in formattedAmenities" :key="key">
                    {{ key }}: {{ value === 1 ? "Yes" : "No" }}
                </li>
            </ul>

            <!-- Files list (Image, Video, etc.) -->
            <h3>Files</h3>
            <ul>
                <li v-for="file in files" :key="file.id">
                    <a v-if="file.type === 1 || file.type === 2" @click.prevent="openFullScreen(file)">
                        <img v-if="file.type === 1" :src="instance.defaults.baseURL+file.url" alt="Image" width="500" height="400" />
                        <video v-if="file.type === 2" :src="instance.defaults.baseURL+file.url" controls width="500" height="400"></video>
                    </a>
                    <span v-else>
                        {{ file.type === 1 ? "Image" : file.type === 2 ? "Video" : "Other" }}
                    </span>
                </li>
            </ul>

            <!-- Posted By user info -->
            <h3>Posted By</h3>
            <p><strong>Name:</strong> {{ user?.name || "N/A" }}</p>
            <p><strong>Phone:</strong> {{ user?.phone || "N/A" }}</p>
            <p><strong>Zalo:</strong> {{ user?.zalo || "N/A" }}</p>
            <p>
                <strong>Facebook:</strong>
                <a :href="user?.fbUrl" target="_blank" v-if="user?.fbUrl">Link fb</a>
                <span v-else>N/A</span>
            </p>
            <p><strong>Bio:</strong> {{ user?.bio || "No bio available" }}</p>
            <p><strong>Verified:</strong> {{ user?.verify === 1 ? "Yes" : "No" }}</p>
        </div>

        <!-- Full-screen modal for images/videos -->
        <div v-if="isFullScreen" class="fullscreen-modal">
            <div class="fullscreen-content">
                <button @click="closeFullScreen" class="close-btn">X</button>
                <img v-if="fullScreenFile.type === 1" :src="instance.defaults.baseURL + fullScreenFile.url" alt="Full-screen image" />
                <video v-if="fullScreenFile.type === 2" :src="instance.defaults.baseURL + fullScreenFile.url" controls></video>
            </div>
        </div>

        <!-- Xem ảnh 3d -->
         <div class="image-3d">
            <button @click="view3dImage">Xem ảnh 360</button>
         </div>
    </div>
    <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.5/build/pannellum.css">
    <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.5/build/pannellum.js"></script> -->
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPostApi } from '@/api/modules/post.api';
import instance from '@/api/axiosConfig';

const route = useRoute();
const postId = route.params.id;

const post = ref(null);
const amenities = ref({});
const files = ref([]);
const user = ref(null);
const isLoading = ref(true);
const error = ref("");
const isFullScreen = ref(false); // Track whether full-screen mode is active
const fullScreenFile = ref(null); // Store the file that should be shown in full-screen mode

// Fetch post details
onMounted(async () => {
    try {
        const response = await getPostApi(postId);
        if (response.data && response.data.data) {
            post.value = response.data.data;
            amenities.value = post.value.amenities || {};
            files.value = post.value.files || [];
            user.value = post.value.user || {};
        } else {
            error.value = "Post not found.";
        }
    } catch (err) {
        error.value = "Failed to load post details. Please try again.";
        console.error(err);
    } finally {
        isLoading.value = false;
    }
});

// Create a computed property for formatted amenities with proper key formatting
const formattedAmenities = computed(() => {
    const formatted = {};
    for (const key in amenities.value) {
        if (Object.prototype.hasOwnProperty.call(amenities.value, key)) {
            // Replace underscores with spaces for better readability
            const formattedKey = key.replace(/_/g, ' ');
            formatted[formattedKey] = amenities.value[key];
        }
    }
    return formatted;
});

// Open the file in full-screen mode
const openFullScreen = (file) => {
    fullScreenFile.value = file;
    isFullScreen.value = true;
};

// Close the full-screen view
const closeFullScreen = () => {
    isFullScreen.value = false;
};
</script>

<style scoped>
h1 {
    color: #333;
}

ul {
    list-style: none;
    padding: 0;
}

ul li {
    margin: 5px 0;
}

a {
    color: blue;
    text-decoration: underline;
}

a:hover {
    color: darkblue;
}

.fullscreen-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.fullscreen-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
}

.fullscreen-content img,
.fullscreen-content video {
    width: 100%;
    height: auto;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.close-btn:hover {
    color: red;
}
</style>
