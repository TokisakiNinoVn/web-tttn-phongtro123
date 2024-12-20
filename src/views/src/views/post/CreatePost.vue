<template>
    <div class="create-post">
        <h1>Create Post</h1>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="title">Title:</label>
                <input v-model="form.title" id="title" type="text" required />
            </div>
            <div class="form-group">
                <label for="type">Type:</label>
                <select v-model="form.type" id="type" required>
                    <option v-for="type in types" :key="type.id" :value="type.id">
                        {{ type.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="address">Address:</label>
                <input v-model="form.address" id="address" type="text" required />
                <button type="button" @click="openAddressModal">Chọn địa chỉ</button>
            </div>

            <div class="form-group">
                <label for="price">Price:</label>
                <input v-model="form.price" id="price" type="number" required />
            </div>
            <div class="form-group">
                <label for="acreage">Acreage:</label>
                <input v-model="form.acreage" id="acreage" type="number" required />
            </div>
            <div class="form-group">
                <label for="realaddress">Real Address:</label>
                <input v-model="form.realaddress" id="realaddress" type="text" required />
            </div>
            <div class="form-group">
                <label for="owner">Owner:</label>
                <input v-model="form.owner" id="owner" type="text" required />
            </div>
            <div class="form-group">
                <label for="phoneOwner">Owner's Phone:</label>
                <input v-model="form.phoneOwner" id="phoneOwner" type="text" required />
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea v-model="form.description" id="description" required></textarea>
            </div>
            <div class="form-group">
                <label for="amenities">Amenities:</label>
                <div>
                    <button type="button" @click="checkAllAmenities">Check All</button>
                    <button type="button" @click="clearAllAmenities">Clear All</button>
                </div>
                <div>
                    <label v-for="(amenity, index) in amenitiesList" :key="index">
                        <input type="checkbox" v-model="form.amenities[index]" /> {{ amenity }}
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label for="files">Các ảnh/Video:</label>
                <input @change="handleFileChange" id="files" type="file" multiple />
            </div>
            <div class="form-group">
                <label for="files3d">Các ảnh 3D:</label>
                <input 
                    ref="files3dInput" 
                    @change="handleFileChange3d" 
                    id="files3d" 
                    type="file" 
                    multiple 
                />
            </div>
            <button type="submit">Đăng/Phát hành bài viết</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>

    <div v-if="form.files.length" class="preview-images">
        <h3>Preview Images/Videos:</h3>
        <div v-for="(fileObj, index) in form.files" :key="index" class="file-preview">
            <div v-if="fileObj.type === 1">
                <img :src="fileObj.previewUrl" alt="Preview" style="width: 400px; height: 400px;" @click="openPreview(index, 'image')" />
                <button @click="removeFile(index)">Xóa</button>
            </div>
            <div v-else-if="fileObj.type === 2">
                <video :src="fileObj.previewUrl" controls style="width: 400px; height: 400px;" @click="openPreview(index, 'video')">
                    Your browser does not support the video tag.
                </video>
                <button @click="removeFile(index)">Xóa</button>
            </div>
        </div>
    </div>

    <div v-if="isPreviewModalOpen" class="preview-modal">
        <div class="modal-content">
            <button @click="previousFile" class="nav-button">Prev</button>
            <button @click="nextFile" class="nav-button">Next</button>
            <button @click="closePreview" class="close-button">Close</button>
            <div v-if="previewType === 'image'">
                <img :src="form.files[previewIndex].previewUrl" alt="Full Preview" class="full-preview" />
            </div>
            <div v-else-if="previewType === 'video'">
                <video :src="form.files[previewIndex].previewUrl" controls class="full-preview">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    </div>

    <div v-if="form.files3d.length">
        <h3>View 3D Images:</h3>
        <button class="next-btn" @click="open3dPreview(0)">View 3D Image Upload</button>
    </div>

    <div v-if="is3dImageVisible" class="pannellum-container">
        <button class="delete-btn" @click="removeFile3d(current3dIndex)">Delete</button>
        <button class="prev-btn" @click="prev3dImage">Previous</button>
        <div id="panorama" class="panorama"></div>
        <button class="next-btn" @click="next3dImage">Next</button>
        <button class="close-btn" @click="close3dImage">Close</button>
    </div>
    <AddressModal v-if="isModalOpen" @close="closeModal" @complete="updateAddress" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllTypesApi } from '@/api/modules/type.api';
import { createPostApi } from '@/api/modules/post.api';
import { uploadApi, upload3dApi } from '@/api/modules/upload.api';
import AddressModal from '../components/AddressSelectC.vue';

// State variables
const types = ref([]);
const router = useRouter();
const dataUser = localStorage.getItem('userInfo');
const parsedUser = JSON.parse(dataUser);
const isModalOpen = ref(false);
const isPreviewModalOpen = ref(false);
const is3dImageVisible = ref(false);
const previewIndex = ref(0);
const previewType = ref('image');
const current3dIndex = ref(0);
const message = ref('');
const files3dInput = ref(null); 
const form = ref({
  userId: parsedUser?.id || '',
  title: '',
  type: '',
  address: '',
  price: '',
  acreage: '',
  realaddress: '',
  owner: parsedUser?.name || '',
  phoneOwner: parsedUser?.phone || '',
  description: '',
  amenities: Array(11).fill(false),
  files: [],
  files3d: []
});
const amenitiesList = [
  "Đầy đủ nội thất", "Có gác", "Có máy giặt", "Giờ giấc tự do", 
  "Có tủ lạnh", "Có bảo vệ 24/24", "Có thang máy", 
  "Có hầm/chỗ để xe", "Không chung chủ", "Có máy lạnh", "Khác"
];

const validateForm = () => {
  if (!form.value.title.trim()) return 'Tiêu đề không được để trống';
  if (!form.value.type) return 'Loại bài đăng chưa được chọn';
  if (!form.value.address.trim()) return 'Địa chỉ chưa được chọn';
  if (!form.value.price || isNaN(form.value.price)) return 'Giá phải là số hợp lệ';
  if (!form.value.acreage || isNaN(form.value.acreage)) return 'Diện tích phải là số hợp lệ';
  return null;
};

const updateAddress = (address) => {
    form.value.address = `${address.province} - ${address.district} - ${address.commune}`;
    closeModal();
};


const checkAllAmenities = () => {
    form.value.amenities = form.value.amenities.map(() => true);
};

const clearAllAmenities = () => {
    form.value.amenities = form.value.amenities.map(() => false);
};

// Functions to manage modal states
const openAddressModal = () => (isModalOpen.value = true);
const closeModal = () => (isModalOpen.value = false);
const openPreview = (index, type) => {
  previewIndex.value = index;
  previewType.value = type;
  isPreviewModalOpen.value = true;
};
const closePreview = () => (isPreviewModalOpen.value = false);

// Functions to manage files
const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  form.value.files = files.map((file) => ({
    file,
    type: file.type.startsWith('image') ? 1 : file.type.startsWith('video') ? 2 : null,
    previewUrl: URL.createObjectURL(file)
  }));
};

onMounted(async () => {
    const loggedInStatus = localStorage.getItem('isLogin') === 'true';
    if (!loggedInStatus) {
        router.push('/login');
    }
    const pannellumCss = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.5/build/pannellum.css';
    const pannellumJs = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.5/build/pannellum.js';

    if (!document.querySelector(`link[href="${pannellumCss}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = pannellumCss;
        document.head.appendChild(link);
    }

    if (!document.querySelector(`script[src="${pannellumJs}"]`)) {
        const script = document.createElement('script');
        script.src = pannellumJs;
        document.head.appendChild(script);
    }
    try {
        const response = await getAllTypesApi();
        types.value = response.data.data;
    } catch (error) {
        message.value = 'Error fetching post types.';
    }
});

const handleFileChange3d = (event) => {
    const files = Array.from(event.target.files);
    form.value.files3d = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file)
    }));
};
const removeFile = (index) => form.value.files.splice(index, 1);
const nextFile = () => (previewIndex.value = (previewIndex.value + 1) % form.value.files.length);
const previousFile = () => (previewIndex.value = (previewIndex.value - 1 + form.value.files.length) % form.value.files.length);

// Submit form
const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
        alert(errorMessage);
        return;
    }
    try {
        const postResponse = await createPostApi({ ...form.value });
        const postId = postResponse.data?.data?.postId;
        if (!postId) throw new Error('Post ID missing');

        // Upload files
        await uploadFiles(postId);
        alert('Đăng bài viết thành công');
        setTimeout(() => router.push('/'), 1000);
    } catch (error) {
        console.error('Error submitting form:', error);
        message.value = error.response?.data?.message || 'An error occurred.';
    }
};

const uploadFiles = async (postId) => {
  const uploadedFiles = [];
  const uploadedFiles3d = [];

  if (form.value.files.length) {
    const formData = new FormData();
    formData.append('postId', postId);
    form.value.files.forEach((fileObj) => formData.append('files', fileObj.file));

    const uploadResponse = await uploadApi(formData);
    uploadedFiles.push(
      ...(uploadResponse.data?.data || []).map((uploadedFile, index) => ({
        url: uploadedFile.url,
        type: form.value.files[index].type
      }))
    );
  }

  if (form.value.files3d.length) {
    const formData3d = new FormData();
    formData3d.append('postId', postId);
    form.value.files3d.forEach((fileObj) => formData3d.append('files', fileObj.file));

    const upload3dResponse = await upload3dApi(formData3d);
    uploadedFiles3d.push(
      ...(upload3dResponse.data?.data || []).map((uploadedFile) => ({
        url: uploadedFile.url
      }))
    );
  }
};

const removeFile3d = (index) => {
    form.value.files3d.splice(index, 1);
    if (form.value.files3d.length === 0) {
        is3dImageVisible.value = false;
        files3dInput.value.value = null;
    } else {
        if (index >= form.value.files3d.length) {
            current3dIndex.value = form.value.files3d.length - 1; // Move to the last available index
        }
        open3dPreview(current3dIndex.value); // Load the panorama for the new current index
    }
};
const close3dImage = () => (is3dImageVisible.value = false);
const next3dImage = () => {
    if (current3dIndex.value < form.value.files3d.length - 1) {
        current3dIndex.value++;
        open3dPreview(current3dIndex.value);
    } else {
        console.log("No more images.");
    }
};

const prev3dImage = () => {
    if (current3dIndex.value > 0) {
        current3dIndex.value--;
        open3dPreview(current3dIndex.value);
    }
};

const open3dPreview = (index) => {
    current3dIndex.value = index;
    is3dImageVisible.value = true;
    setTimeout(() => {
        // eslint-disable-next-line no-undef
        pannellum.viewer('panorama', {
            type: 'equirectangular',
            panorama: form.value.files3d[index].previewUrl
        });
    }, 100);
};
</script>


<style scoped>
.pannellum-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #000;
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

.delete-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    z-index: 1100;
}
</style>
