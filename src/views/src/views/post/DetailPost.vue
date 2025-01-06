<template>
    <HeaderC />
    <div class="post-detail-container mt4">
        <div class="main-container flex justify-center align-center">

            <div class="flex">
                <div v-if="isLoading" class="loading">Loading...</div>
                <div v-else-if="error" class="error">{{ error }}</div>
                <div v-else class="post-detail flex pa4">
                    <div class="main-post-detail w-70">
                        <div class="infor-post">

                            <div class="files-section flex flex-column items-center justify-center overflow-hidden">
                                <div class="image-to-bu w100 flex mb3">
                                    <button @click="prevImageMini" class="btn-control-view btn-control-a f6 link dim ph3 pv2 mb2 dib white bg-blue">
                                        <ion-icon name="chevron-back-outline"></ion-icon>
                                    </button>

                                    <div class="overflow-hidden flex justify-center items-center w-100">
                                        <template v-if="files.length > 0" >
                                            <img
                                                v-if="currentFile.type === 1"
                                                :src="instance.defaults.baseURL + currentFile.url"
                                                alt="Image"
                                                class="image-video-view w-100"
                                            />
                                            <video
                                                v-if="currentFile.type === 2"
                                                :src="instance.defaults.baseURL + currentFile.url"
                                                controls
                                                class="image-video-view w-100"
                                            ></video>
                                        </template>
                                        <span v-else class="f6 gray">No files available</span>
                                    </div>

                                    <button @click="nextImageMini" class="btn-control-view btn-control-b f6 link dim ph3 pv2 mb2 dib white bg-blue">
                                        <ion-icon name="chevron-forward-outline"></ion-icon>
                                    </button>
                                </div>

                                <div class="mini-image-preview flex justify-center items-center flex-wrap mt-4">
                                    <li v-for="file in files" :key="file.id" class="">
                                        <a v-if="file.type === 1 || file.type === 2" @click.prevent="openFullScreen(file)" class="w-25">
                                            <img v-if="file.type === 1" :src="instance.defaults.baseURL + file.url" alt="Image" class="image-video-mini" />
                                            <video v-if="file.type === 2" :src="instance.defaults.baseURL + file.url" controls class="image-video-mini"></video>
                                        </a>
                                        <span v-else class="f6 gray">{{ file.type === 1 ? "Image" : file.type === 2 ? "Video" : "Other" }}</span>
                                    </li>
                                </div>
                            </div>
    
                            <div class="post-header flex justify-between">
                              <h2 class="post-title f3 b">{{ post?.title }}</h2>
                              <button class="save-btn bg-light-blue white pa2 br3" @click="savePost">
                                <ion-icon name="heart-outline"></ion-icon> Lưu bài đăng
                              </button>
                            </div>
        
                            <div class="post-info mt3">
                                <p><strong>Giá:</strong> {{ post?.price }} triệu/tháng</p>
                              <p><strong>Các thông tin mô tả:</strong> {{ post?.description || "No description available" }}</p>
                              <p><strong>Địa chỉ:</strong> {{ post?.address }}</p>
                              <p><strong>Địa chỉ thực:</strong> {{ post?.realaddress || "N/A" }}</p>
                              <p><strong>Chủ sở hữu:</strong> {{ post?.owner }} - {{ post?.phone_owner }}</p>
                              <p><strong>Diện tích:</strong> {{ post?.acreage }} m²</p>
                              <p><strong>Thời gian đăng bài:</strong> {{ post?.createdAt ? new Date(post.createdAt).toLocaleString() : "N/A" }}</p>
                              <p><strong>Cập nhật lần cuối:</strong> {{ post?.updatedAt ? new Date(post.updatedAt).toLocaleString() : "N/A" }}</p>
                              <p><strong>Trạng thái bài đăng:</strong> {{ post?.active === 1 ? "Đang hoạt động" : "Không hoạt động" }}</p>
                            </div>
                      
                            <div class="amenities-section mt3">
                              <h3 class="f4 b">Các tiện ích</h3>
                              <div class="amenities-container flex flex-wrap">
                                <div v-for="(value, key) in post?.amenities[0]" :key="key" class="amenity">
                                  <span v-if="value === 1" class="have-amenitie flex items-center">
                                    <ion-icon name="checkmark-circle-outline"></ion-icon> {{ translateAmenity(key) }}
                                  </span>
                                  <span v-else class="none-amenitie flex items-center">
                                    <ion-icon name="close-outline"></ion-icon> {{ translateAmenity(key) }}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                        </div>
                        <div v-if="files360.length != 0" class="image-section mt3">
                            <div class="files-section mt3">
                              <h3 class="f4 b tc">Các ảnh 360 về phòng trọ</h3>
                              <ul class="file-list list pl0">
                                <li v-for="(file, index) in files360" :key="file.id" class="mb2">
                                  <a v-if="file.type === 3" @click.prevent="view3dImage(file, index)">
                                    <img :src="instance.defaults.baseURL + file.url" alt="360 Image" class="w-100 h-auto" />
                                  </a>
                                  <span v-else>{{ file.type === 1 ? "Image" : file.type === 2 ? "Video" : "Other" }}</span>
                                </li>
                              </ul>
                            </div>
                        </div>
                    </div>
            
                    <div class="posted-by-section w-30 pl3 flex flex-column justify-between align-center items-center">
                        <h3 class="f4 b">Thông tin người đăng</h3>
                        <img :src="instance.defaults.baseURL + user.avatar" alt="Avatar" class="w5 h5 br-100 pa3" />
                        <p class="f3 fw8">{{ user?.name || "Chưa cập nhật" }}</p>
                        <div class="flex justify-around w-100 flex-column">
                            <p class="flex justify-center items-center">Zalo: {{ user?.zalo || "Chưa cập nhật" }}</p>
                            <!-- <span> | </span> -->
                            <p class="flex align-center justify-center">
                                <a :href="user?.fbUrl" target="_blank" v-if="user?.fbUrl" class="flex flex-row items-center"><ion-icon class="f2 mr2" name="logo-facebook"></ion-icon>Facebook</a>
                                <span v-else></span>
                            </p>
                        </div>
                        <p>{{ user?.bio || "No bio available" }}</p>
                        <p>{{ user?.verify === 1 ? "Đã xác minh" : "Chưa xác minh" }}</p>
                    </div>
                </div>
            </div>
        
            <div v-if="isFullScreen" class="fullscreen-modal fixed top-0 left-0 right-0 bottom-0 bg-black-70 flex justify-center items-center z-1000">
              <div class="fullscreen-content relative mw90 mh90">
                <button @click="closeFullScreen" class="close-btn absolute top-0 right-0 bg-transparent white f4" aria-label="Close">X</button>
                <img v-if="fullScreenFile.type === 1" :src="instance.defaults.baseURL + fullScreenFile.url" alt="Full-screen image" class="w-100 h-auto" />
                <video v-if="fullScreenFile.type === 2" :src="instance.defaults.baseURL + fullScreenFile.url" controls class="w-100 h-auto"></video>
                <button class="prev-btn absolute left-0 top-50 transform -translate-y-50 bg-black-60 white pa2" @click="prevImage">Previous</button>
                <button class="next-btn absolute right-0 top-50 transform -translate-y-50 bg-black-60 white pa2" @click="nextImage">Next</button>
              </div>
            </div>
        
            <div v-if="is3dImageVisible" class="pannellum-container fixed top-0 left-0 w-100 h-100 bg-black-90 flex justify-center items-center z-1000 overflow-hidden">
              <button class="close-btn absolute top-0 right-0 bg-black-60 white pa2" @click="close3dImage">X</button>
              <button class="prev-btn absolute left-0 top-50 transform -translate-y-50 bg-black-60 white pa2" @click="prev3dImage">Previous</button>
              <div id="panorama" class="panorama"></div>
              <button class="next-btn absolute right-0 top-50 transform -translate-y-50 bg-black-60 white pa2" @click="next3dImage">Next</button>
            </div>
        </div>
    </div>

    <FooterC />
</template>

<style scoped>
button {
    border: none;
    margin-bottom: 0;
}

ion-icon {
    z-index: 0;
    position: relative;
}

.image-to-bu {
    /* position: relative; */
}

/* .files-section {
    position: relative;
} */

.mini-image-post {
    /* width: 100%; */
    width: max-content;
    height: 300px;
    background-color: black;
    overflow: auto;
}

.image-video-view {
    height: 410px;
}
.image-video-mini {
    max-width: 100px;
    height: auto;
}

/* .btn-control-a {
    left: 0;
}
.btn-control-b {
    right: 0;
} */


.post-detail {
    max-width: 1200px;
}

.main-post-detail {
    margin-right: 18px;
    border-radius: 5px;
}

.infor-post {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    padding: 10px 20px;
    background-color: rgb(242, 244, 247);
}

.image-section {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    margin-top: 30px;
    padding: 10px;
    border-radius: 5px;
}

.posted-by-section {
    background-color: rgb(242, 244, 247);
    padding: 10px;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    height: max-content;

    position: sticky;
    top: 180px;
}

.post-detail-container {
    margin-top: 164px;
}

h1 {
    color: #333;
}

ul {
    list-style: none;
    padding: 0;
}

/* ul li {
    margin: 5px 0;
} */

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

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPostApi } from '@/api/modules/post.api';
import { savePostApi } from '@/api/modules/user.api';
import instance from '@/api/axiosConfig';
import HeaderC from '@/views/components/HeaderC.vue';
import FooterC from '@/views/components/FooterC.vue';

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
            
            if (files360.value.length > 0) {
                current3dImageIndex.value = 0;
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
        alert("Không còn ảnh nào khác.");
    }
};

const prev3dImage = () => {
    if (current3dImageIndex.value > 0) {
        current3dImageIndex.value--;
        view3dImage(files360.value[current3dImageIndex.value], current3dImageIndex.value);
    } else {
        alert("Không còn ảnh nào khác.");
    }
};

const prevImage = () => {
    // Check if there is a previous image
    const currentIndex = files.value.findIndex(file => file.url === fullScreenFile.value?.url);
    if (currentIndex > 0) {
        fullScreenFile.value = files.value[currentIndex - 1];
    } else {
        alert("Không còn ảnh nào khác.");
    }
};

const nextImage = () => {
    // Check if there is a next image
    const currentIndex = files.value.findIndex(file => file.url === fullScreenFile.value?.url);
    if (currentIndex < files.value.length - 1) {
        fullScreenFile.value = files.value[currentIndex + 1];
    } else {
        alert("Không còn ảnh nào khác.");
    }
};

const currentIndex = ref(0);

// File hiện tại
const currentFile = computed(() => files.value[currentIndex.value]);

// Điều hướng tới file trước đó
const prevImageMini = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    alert("Đây là ảnh/video đầu tiên!");
  }
};

// Điều hướng tới file tiếp theo
const nextImageMini = () => {
  if (currentIndex.value < files.value.length - 1) {
    currentIndex.value++;
  } else {
    alert("Đây là ảnh/video cuối cùng!");
  }
};

</script>
  