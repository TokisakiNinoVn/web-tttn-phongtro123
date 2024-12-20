<template>
    <div class="create-post">
        <h1>Edit post</h1>
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
                    <label><input type="checkbox" v-model="form.amenities[0]" value="1" /> Đầy đủ nội thất</label>
                    <label><input type="checkbox" v-model="form.amenities[1]" value="1" /> Có gác</label>
                    <label><input type="checkbox" v-model="form.amenities[2]" value="1" /> Có máy giặt</label>
                    <label><input type="checkbox" v-model="form.amenities[3]" value="1" /> Giờ giấc tự do</label>
                    <label><input type="checkbox" v-model="form.amenities[4]" value="1" /> Có tủ lạnh</label>
                    <label><input type="checkbox" v-model="form.amenities[5]" value="1" /> Có bảo vệ 24/24</label>
                    <label><input type="checkbox" v-model="form.amenities[6]" value="1" /> Có thang máy</label>
                    <label><input type="checkbox" v-model="form.amenities[7]" value="1" /> Có hầm/chỗ để xe</label>
                    <label><input type="checkbox" v-model="form.amenities[8]" value="1" /> Không chung chủ</label>
                    <label><input type="checkbox" v-model="form.amenities[9]" value="1" /> Có máy lạnh</label>
                    <label><input type="checkbox" v-model="form.amenities[10]" value="1" /> Có gác</label>
                </div>
            </div>
            <div class="form-group">
                <label for="files">Các ảnh/Video:</label>
                <input @change="handleFileChange" id="files" type="file" multiple />
            </div>
            <div class="form-group">
                <label for="files">Các ảnh 3D: </label>
                <input @change="handleFileChange3d" id="files3d" type="file" multiple />
            </div>
            <button type="submit">Cập nhật bài viết</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>

    <!-- Preview Modal for Full-Screen View -->
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

    <AddressModal v-if="isModalOpen" @close="closeModal" @complete="updateAddress" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllTypesApi } from '@/api/modules/type.api';
import { updatePostApi, getPostApi } from '@/api/modules/post.api';
import { uploadApi, upload3dApi } from '@/api/modules/upload.api';
import AddressModal from '../components/AddressSelectC.vue';

const types = ref([]);
const router = useRouter();
const postId = router.currentRoute.value.params.id;

const dataUser = localStorage.getItem('userInfo');
const parsedUser = JSON.parse(dataUser);

const form = ref({
    userId: parsedUser.id,
    title: '',
    type: '',
    address: '',
    price: '',
    acreage: '',
    realaddress: '',
    owner: '',
    phoneOwner: '',
    description: '',
    amenities: Array(11).fill(false),
    files: [],
    files3d: []
});

const message = ref('');

const handleFileChange = (event) => {
    const files = event.target.files;
    const newFiles = Array.from(files).map(file => ({
        file,
        type: file.type.startsWith('image') ? 1 : file.type.startsWith('video') ? 2 : null,
        previewUrl: URL.createObjectURL(file)
    })).filter(Boolean);
    
    form.value.files = [...form.value.files, ...newFiles];
};

const handleFileChange3d = (event) => {
    const files = event.target.files;
    const newFiles = Array.from(files).map(file => ({
        file,
        type: file.type.startsWith('image') ? 3 : file.type.startsWith('video') ? 2 : null,
        previewUrl: URL.createObjectURL(file)
    }));

    form.value.files3d = [...form.value.files3d, ...newFiles];
};

const isModalOpen = ref(false);
const openAddressModal = () => {
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
};

const updateAddress = (address) => {
    form.value.address = `${address.province} - ${address.district} - ${address.commune}`;
    closeModal();
};

// Handle form submission
const handleSubmit = async () => {
    try {
        const { title, type, address, price, acreage, realaddress, owner, phoneOwner, description, amenities } = form.value;
        const [uploadedFiles, uploadedFiles3d] = await Promise.all([
            uploadFiles(postId),
            upload3dFiles(postId)
        ]);

        const response = await updatePostApi({
            postId,
            title,
            type,
            address,
            price,
            acreage,
            realaddress,
            owner,
            phoneOwner,
            description,
            amenities,
            files: {
                files: uploadedFiles,
                files3d: uploadedFiles3d
            }
        });

        // Handle API response
        if (response.data.code !== 200) {
            alert('Error updating post: ' + response.data.message);
            return;
        }

        alert('Cập nhật bài viết thành công');
        setTimeout(() => {
            router.push('/');
        }, 1000);
    } catch (error) {
        console.error('>> Error:', error);
        message.value = error.response?.data?.message || 'An error occurred.';
    }
};


const uploadFiles = async () => {
    const uploadedFiles = [];
    if (form.value.files.length) {
        const formData = new FormData();
        formData.append('postId', postId);
        form.value.files.forEach(fileObj => {
            formData.append('files', fileObj.file);
        });

        const uploadResponse = await uploadApi(formData);
        uploadedFiles.push(
            ...(uploadResponse.data?.data || []).map((uploadedFile, index) => ({
                url: uploadedFile.url,
                type: form.value.files[index].type
            }))
        );
    }
    return uploadedFiles;
};

const upload3dFiles = async () => {
    const uploadedFiles3d = [];
    if (form.value.files3d.length) {
        const formData3d = new FormData();
        formData3d.append('postId', postId);
        form.value.files3d.forEach(fileObj => {
            formData3d.append('files', fileObj.file);
        });

        const upload3dResponse = await upload3dApi(formData3d);
        uploadedFiles3d.push(
            ...(upload3dResponse.data?.data || []).map(uploadedFile => ({
                url: uploadedFile.url
            }))
        );
    }
    return uploadedFiles3d;
};

// On mounted, fetch the post types
onMounted(async () => {
    const loggedInStatus = localStorage.getItem('isLogin') === 'true';
    if (!loggedInStatus) {
        router.push('/login');
    }
    try {
        const response = await getAllTypesApi();
        types.value = response.data.data;

        // Fetch the existing post data
        const postResponse = await getPostApi(postId);
        const postData = postResponse.data.data;

        // Populate the form with the existing post data
        form.value.title = postData.title;
        form.value.type = postData.type;
        form.value.address = postData.address;
        form.value.price = postData.price;
        form.value.acreage = postData.acreage;
        form.value.realaddress = postData.realaddress;
        form.value.owner = postData.owner;
        form.value.phoneOwner = postData.phone_owner;
        form.value.description = postData.description;

        // Populate amenities
        form.value.amenities = [
            postData.amenities[0].fully_furnished,
            postData.amenities[0].garret,
            postData.amenities[0].washing_machine,
            postData.amenities[0].free_time,
            postData.amenities[0].fridge,
            postData.amenities[0].protect,
            postData.amenities[0].kitchen_shelf,
            postData.amenities[0].elevator,
            postData.amenities[0].common_owner,
            postData.amenities[0].air_conditioner,
            postData.amenities[0].parking
        ];

        // Populate existing files (images/videos)
        form.value.files = postData.filesNormal.map(file => ({
            previewUrl: file.url,
            type: file.type
        }));

        // Populate existing 3D files
        form.value.files3d = postData.files360.map(file => ({
            previewUrl: file.url,
            type: file.type
        }));

    } catch (error) {
        message.value = 'Error fetching post types or post data.';
    }
});

const checkAllAmenities = () => {
    form.value.amenities = form.value.amenities.map(() => true);
};

const clearAllAmenities = () => {
    form.value.amenities = form.value.amenities.map(() => false);
};

const isPreviewModalOpen = ref(false);
const previewIndex = ref(0);
const previewType = ref('image');

// const openPreview = (index, type) => {
//     previewIndex.value = index;
//     previewType.value = type;
//     isPreviewModalOpen.value = true;
// };

const closePreview = () => {
    isPreviewModalOpen.value = false;
};

const previousFile = () => {
    previewIndex.value = (previewIndex.value > 0) ? previewIndex.value - 1 : form.value.files.length - 1;
};

const nextFile = () => {
    previewIndex.value = (previewIndex.value < form.value.files.length - 1) ? previewIndex.value + 1 : 0;
};

// const removeFile = (index) => {
//     form.value.files.splice(index, 1);
// };

// const removeFile3d = (index) => {
//     form.value.files3d.splice(index, 1);
// };
</script>

<style scoped>
.create-post {
    max-width: 600px;
    margin: 0 auto;
}
.form-group {
    margin-bottom: 1rem;
}
label {
    display: block;
    margin-bottom: 0.5rem;
}
input, select, textarea {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}
button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
button:hover {
    background-color: #0056b3;
}

.preview-section {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ccc;
}

.preview-section h2 {
    font-size: 18px;
    font-weight: bold;
}

.preview-item {
    margin-top: 10px;
}

.preview-image, .preview-video, .preview-3d-image {
    max-width: 200px;
    margin-right: 10px;
}

.preview-video {
    max-width: 300px;
    max-height: 200px;
}

.preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    position: relative;
    background: white;
    padding: 20px;
    max-width: 90%;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.full-preview {
    width: 100%;
    height: auto;
    max-height: 80vh;
    object-fit: contain;
}

.nav-button, .close-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 18px;
}

.nav-button {
    left: 10px;
}

.close-button {
    right: 10px;
}

.nav-button:hover, .close-button:hover {
    background-color: #f1f1f1;
}

</style>
