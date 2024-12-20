<template>
    <div class="post-detail-container">
      <h1 class="title">Detail Post</h1>
  
      <!-- Loading and Error States -->
      <div v-if="isLoading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
  
      <div v-else class="post-detail">
        <div class="post-header">
          <h2 class="post-title">{{ post?.title }}</h2>
          <button class="save-btn" @click="savePost">
            <ion-icon name="heart-outline"></ion-icon> Lưu bài đăng
          </button>
        </div>
  
        <div class="post-info">
          <p><strong>Description:</strong> {{ post?.description || "No description available" }}</p>
          <p><strong>Giá:</strong> {{ post?.price }} triệu/tháng</p>
          <p><strong>Địa chỉ:</strong> {{ post?.address }}</p>
          <p><strong>Real Address:</strong> {{ post?.realaddress || "N/A" }}</p>
          <p><strong>Owner:</strong> {{ post?.owner }} - {{ post?.phone_owner }}</p>
          <p><strong>Acreage:</strong> {{ post?.acreage }} m²</p>
          <p><strong>Created At:</strong> {{ post?.createdAt ? new Date(post.createdAt).toLocaleString() : "N/A" }}</p>
          <p><strong>Updated At:</strong> {{ post?.updatedAt ? new Date(post.updatedAt).toLocaleString() : "N/A" }}</p>
          <p><strong>Active:</strong> {{ post?.active === 1 ? "Yes" : "No" }}</p>
        </div>
  
        <!-- Amenities Section -->
        <div class="amenities-section">
          <h3>Tiện ích</h3>
          <div class="amenities-container">
            <div v-for="(value, key) in post?.amenities[0]" :key="key" class="amenity">
              <span v-if="value === 1" class="have-amenitie">
                <ion-icon name="checkmark-circle-outline"></ion-icon> {{ translateAmenity(key) }}
              </span>
              <span v-else class="none-amenitie">
                <ion-icon name="close-outline"></ion-icon> {{ translateAmenity(key) }}
              </span>
            </div>
          </div>
        </div>
  
        <!-- Files Section -->
        <div class="files-section">
          <h3>Files</h3>
          <ul class="file-list">
            <li v-for="file in files" :key="file.id">
              <a v-if="file.type === 1 || file.type === 2" @click.prevent="openFullScreen(file)">
                <img v-if="file.type === 1" :src="instance.defaults.baseURL + file.url" alt="Image" width="500" height="400" />
                <video v-if="file.type === 2" :src="instance.defaults.baseURL + file.url" controls width="500" height="400"></video>
              </a>
              <span v-else>{{ file.type === 1 ? "Image" : file.type === 2 ? "Video" : "Other" }}</span>
            </li>
          </ul>
        </div>
  
        <!-- 360 Images Section -->
        <div class="files-section">
          <h3>360 Files</h3>
          <ul class="file-list">
            <li v-for="(file, index) in files360" :key="file.id">
              <a v-if="file.type === 3" @click.prevent="view3dImage(file, index)">
                <img :src="instance.defaults.baseURL + file.url" alt="360 Image" width="500" height="400" />
              </a>
              <span v-else>{{ file.type === 1 ? "Image" : file.type === 2 ? "Video" : "Other" }}</span>
            </li>
          </ul>
        </div>
  
        <!-- Posted By Section -->
        <div class="posted-by-section">
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
          <!-- <router-link :to="{ name: 'user-profile', params: { id: user?.id } }">View Profile</router-link> -->
        </div>
      </div>
  
      <!-- Full-screen modal for images/videos -->
      <div v-if="isFullScreen" class="fullscreen-modal">
        <div class="fullscreen-content">
          <button @click="closeFullScreen" class="close-btn">X</button>
          <img v-if="fullScreenFile.type === 1" :src="instance.defaults.baseURL + fullScreenFile.url" alt="Full-screen image" />
          <video v-if="fullScreenFile.type === 2" :src="instance.defaults.baseURL + fullScreenFile.url" controls></video>
          <button class="prev-btn" @click="prevImage">Previous</button>
            <button class="next-btn" @click="nextImage">Next</button>

        </div>
      </div>
  
      <!-- Full-screen modal for 360 Image Viewer -->
      <div v-if="is3dImageVisible" class="pannellum-container">
        <button class="close-btn" @click="close3dImage">X</button>
        <button class="prev-btn" @click="prev3dImage">Previous</button>
        <div id="panorama" class="panorama"></div>
        <button class="next-btn" @click="next3dImage">Next</button>
      </div>
    </div>
  </template>
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { getPostApi } from '@/api/modules/post.api';
import { savePostApi } from '@/api/modules/user.api';
import instance from '@/api/axiosConfig';

const route = useRoute();
const postId = route.params.id;

const post = ref(null);
const amenities = ref({});
const files = ref([]);
const files360 = ref([]);
const user = ref(null);
const isLoading = ref(true);
const error = ref("");
const isFullScreen = ref(false); 
const fullScreenFile = ref(null);
const userInfo = ref(null);

const current3dImageIndex = ref(0);
const current3dImage = ref(null);
const is3dImageVisible = ref(false);

onMounted(() => {
    const existingLink = document.querySelector('link[href="https://cdn.jsdelivr.net/npm/pannellum@2.5.5/build/pannellum.css"]');
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.5/build/pannellum.css';
        document.head.appendChild(link);
    }

    // Add Pannellum JS script if not already added
    const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/pannellum@2.5.5/build/pannellum.js"]');
    if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.5/build/pannellum.js';
        document.head.appendChild(script);
    }
});

onMounted(async () => {
    const userData = localStorage.getItem('userInfo');
    if (userData) {
        userInfo.value = JSON.parse(userData);
    }
    try {
        const response = await getPostApi(postId);
        if (response.data && response.data.data) {
            post.value = response.data.data;
            amenities.value = post.value.amenities || {};
            files.value = post.value.filesNormal || [];
            files360.value = post.value.files360 || [];
            console.log('files360:', files360.value);
            
            if (files360.value.length > 0) {
                current3dImageIndex.value = 0;
                console.log('files360:', files360.value);
                console.log('files360:', files360.value.length);
                console.log("current3dImageIndex value:", current3dImageIndex.value);
            } else {
                console.log("Không có hình ảnh 3D.");
            }

            user.value = post.value.user || {};
        } else {
            error.value = "Post not found.";
        }
    } catch (err) {
        error.value = "Đang có lỗi xảy ra. Vui lòng thử lại sau.";
        console.error(err);
    } finally {
        isLoading.value = false;
    }
});

const translateAmenity = (key) => {
    const translations = {
        fully_furnished: "Đầy đủ nội thất",
        garret: "Có gác lửng",
        washing_machine: "Máy giặt",
        free_time: "Giờ giấc tự do",
        fridge: "Tủ lạnh",
        protect: "Có bảo vệ",
        kitchen_shelf: "Kệ bếp",
        elevator: "Thang máy",
        common_owner: "Chung chủ",
        air_conditioner: "Điều hòa",
        parking: "Chỗ để xe",
    };
    return translations[key] || key;
};

const savePost = async () => {
    const userId = userInfo.value.id;
    const body = {
        postId: postId,
        userId: userId,
    };
    const response = await savePostApi(body);
    try {
        if (response.data.code == 200) {
            alert("Bạn đã lưu bài viết.");
        } else if (response.data && response.data.data) {
            alert("Post saved successfully.");
        } else {
            alert("Failed to save post. Please try again.");
        }
    } catch (err) {
        console.error(err);
    }
};

const openFullScreen = (file) => {
    fullScreenFile.value = file;
    isFullScreen.value = true;
};

const closeFullScreen = () => {
    isFullScreen.value = false;
};

const view3dImage = (file, index) => {
    if (!file || index === undefined || index === null) {
        console.error("Invalid file or index.", { file, index });
        return;
    }
    current3dImageIndex.value = index;
    current3dImage.value = file;
    is3dImageVisible.value = true;
    nextTick(() => {
        const panorama = document.getElementById('panorama');
        if (panorama && window.pannellum) {
            // eslint-disable-next-line no-undef
            pannellum.viewer(panorama, {
                type: 'equirectangular',
                panorama: instance.defaults.baseURL + file.url,
                autoLoad: true,
            });
        } else {
            console.error('Panorama element or Pannellum library is not loaded.');
        }
    });
};

const close3dImage = () => {
    is3dImageVisible.value = false;
    current3dImage.value = null;
    current3dImageIndex.value = 0;
};

const next3dImage = () => {
    if (current3dImageIndex.value < files360.value.length - 1) {
        current3dImageIndex.value++;
        view3dImage(files360.value[current3dImageIndex.value], current3dImageIndex.value);
    } else {
        console.log("No more images.");
    }
};

const prev3dImage = () => {
    if (current3dImageIndex.value > 0) {
        current3dImageIndex.value--;
        view3dImage(files360.value[current3dImageIndex.value], current3dImageIndex.value);
    } else {
        console.log("No previous images.");
    }
};

const prevImage = () => {
    // Check if there is a previous image
    const currentIndex = files.value.findIndex(file => file.url === fullScreenFile.value?.url);
    if (currentIndex > 0) {
        fullScreenFile.value = files.value[currentIndex - 1];
    } else {
        console.log("No previous image.");
    }
};

const nextImage = () => {
    // Check if there is a next image
    const currentIndex = files.value.findIndex(file => file.url === fullScreenFile.value?.url);
    if (currentIndex < files.value.length - 1) {
        fullScreenFile.value = files.value[currentIndex + 1];
    } else {
        console.log("No more images.");
    }
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
    
    /* Styles for 3D Image Viewer */
    .pannellum-container {
        position: relative;
        width: 100%;
        height: 100vh;
        background-color: #000;
    }
    
    .pannellum-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        overflow: hidden;
    }
    
    .close-btn, .prev-btn, .next-btn {
        position: absolute;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        border: none;
        padding: 10px 15px;
        font-size: 16px;
        cursor: pointer;
        z-index: 1100;
    }
    
    .close-btn {
        top: 10px;
        right: 10px;
    }
    
    .prev-btn {
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
    }
    
    .next-btn {
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
    }
    
    .close-btn:hover, .prev-btn:hover, .next-btn:hover {
        background: rgba(255, 0, 0, 0.6);
    }
    
    
    .amenities-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .amenity {
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f9f9f9;
    }
    .have-amenitie {
        color: green;
    }
    .none-amenitie {
        color: red;
    }
    
</style>
    