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
        </div>
    </div>

    <!-- Full-screen modal for images/videos -->
    <div v-if="isFullScreen" class="fullscreen-modal">
        <div class="fullscreen-content">
        <button @click="closeFullScreen" class="close-btn">X</button>
        <img v-if="fullScreenFile.type === 1" :src="instance.defaults.baseURL + fullScreenFile.url" alt="Full-screen image" />
        <video v-if="fullScreenFile.type === 2" :src="instance.defaults.baseURL + fullScreenFile.url" controls></video>
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
</script>
<style scoped>
.post-detail-container {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  max-width: 900px;
  margin: auto;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
}

.loading, .error {
  text-align: center;
  font-size: 18px;
  color: #999;
}

.post-detail {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.post-title {
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.save-btn {
  background-color: #ff6f61;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.save-btn:hover {
  background-color: #e65c4d;
}

.post-info p {
  font-size: 16px;
  margin: 10px 0;
}

.amenities-section, .files-section, .posted-by-section {
  margin-bottom: 30px;
}

.amenities-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.amenity {
  font-size: 14px;
  color: #555;
}

.have-amenitie {
  color: #28a745;
}

.none-amenitie {
  color: #dc3545;
}

.file-list {
  list-style: none;
  padding: 0;
}

.file-list li {
  margin: 15px 0;
}

.file-list a {
  text-decoration: none;
}

.pannellum-container {
  position: relative;
  width: 100%;
  height: 80vh;
}

.panorama {
  width: 100%;
  height: 100%;
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

.prev-btn, .next-btn {
  position: absolute;
  top: 50%;
  font-size: 24px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  transform: translateY(-50%);
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}
</style>
