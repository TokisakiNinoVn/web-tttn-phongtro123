<template>
    <HeaderC />
    <div class="main-content mw8 center mt5 pa4 bg-light-gray br3 shadow-1 mb5 flex items-center flex-column">
        <h1 class="f2">Chỉnh sửa thông tin bài đăng</h1>
        <form @submit.prevent="handleSubmit" class="flex flex-wrap">
            <div class="w-100 pr2">
                <div class="mb3">
                    <label class="db mb1" for="title">Tiêu đề:</label>
                    <input class="input-reset ba b--black-20 pa2 mb2 w-100" v-model="form.title" id="title" type="text" required />
                </div>
                <div class="mb3">
                    <label class="db mb1" for="type">Loại bài đăng:</label>
                    <select class="input-reset ba b--black-20 pa2 mb2 w-100" v-model="form.type" id="type" required>
                        <option v-for="type in types" :key="type.id" :value="type.id">
                            {{ type.name }}
                        </option>
                    </select>
                </div>

                <div class="flex">
                    <div class="mb3 w-50 mr3">
                        <label class="db mb1" for="price">Giá:</label>
                        <input class="input-reset ba b--black-20 pa2 mb2 w-100" v-model="form.price" id="price" type="number" required />
                    </div>
                    <div class="mb3 w-50">
                        <label class="db mb1" for="acreage">Diện tích:</label>
                        <input class="input-reset ba b--black-20 pa2 mb2 w-100" v-model="form.acreage" id="acreage" type="number" required />
                    </div>
                </div>
                <div class="mb3">
                    <label class="db mb1" for="address">Địa chỉ:</label>
                    <div class="flex justify-lg-space-evenly">
                        <button type="button" @click="openAddressModal" class="f6 w-30 link dim br2 ba ph3 pv2 mb2 dib dark-green mr3">Chọn địa chỉ</button>
                        <input class="input-reset ba b--black-20 pa2 mb2 w-100" v-model="form.address" id="address" type="text" required />
                    </div>
                </div>
                <div class="mb3">
                    <label class="db mb1" for="realaddress">Địa chỉ thực tế:</label>
                    <input class="input-reset ba b--black-20 pa2 mb2 w-100" v-model="form.realaddress" id="realaddress" type="text" required />
                </div>
                <div class="mb3">
                    <label class="db mb1" for="description">Các mô tả khác:</label>
                    <textarea class="input-reset ba b--black-20 pa2 mb2 w-100" v-model="form.description" id="description" required></textarea>
                </div>
                <div class="flex pl2">
                    <div class="w-50 mb3 mr3">
                        <label class="db mb1" for="owner">Chủ:</label>
                        <input class="input-reset ba b--black-20 pa2 mb2 w-100" v-model="form.owner" id="owner" type="text" required />
                    </div>
                    <div class="w-50 mb3">
                        <label class="db mb1" for="phoneOwner">Số điện thoại:</label>
                        <input class="input-reset ba b--black-20 pa2 mb2 w-100" v-model="form.phoneOwner" id="phoneOwner" type="text" required />
                    </div>
                </div>
                <div class="mb3">
                    <label class="db mb1" for="amenities">Tiện ích:</label>
                    <div class="mb2 flex">
                        <button type="button" @click="checkAllAmenities" class="f6 link dim br2 ba ph3 pv2 mb2 dib dark-green mr3 flex items-center"><ion-icon name="checkmark-circle-outline" class="mr2"></ion-icon>Chọn tất cả</button>
                        <button type="button" @click="clearAllAmenities" class="f6 link dim br2 ba ph3 pv2 mb2 dib dark-red flex items-center"><ion-icon name="close-circle-outline" class="mr2"></ion-icon>Bỏ chọn tất cả</button>
                    </div>
                    <div class="flex flex-wrap">
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[0]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Đầy đủ nội thất</span>
                        </label>
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[1]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Có gác</span>
                        </label>
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[2]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Có máy giặt</span>
                        </label>
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[3]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Giờ giấc tự do</span>
                        </label>
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[4]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Có tủ lạnh</span>
                        </label>
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[5]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Có bảo vệ 24/24</span>
                        </label>
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[6]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Có thang máy</span>
                        </label>
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[7]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Có hầm/chỗ để xe</span>
                        </label>
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[8]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Không chung chủ</span>
                        </label>
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[9]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Có máy lạnh</span>
                        </label>
                        <label class="db flex items-center mb2 mr3">
                            <input type="checkbox" v-model="form.amenities[10]" value="1" class="mr2" />
                            <span class="ph2 br3 ba b--light-gray bg-white dib">Có gác</span>
                        </label>
                    </div>
                </div>

                <div class="flex">
                    <div class="mb3 w-50 mr4">
                        <label class="db mb1" for="files">Các ảnh/Video:</label>
                        <input @change="handleFileChange" class="input-reset ba b--black-20 pa2 mb2 w-100" id="files" type="file" multiple />
                    </div>
                    <div class="mb3 w-50">
                        <label class="db mb1" for="files3d">Các ảnh 3D:</label>
                        <input @change="handleFileChange3d" class="input-reset ba b--black-20 pa2 mb2 w-100" id="files3d" type="file" multiple />
                    </div>
                </div>
            </div>
            <div class="w-100 mt3 flex justify-center">
                <button type="submit" class="f6 link dim br2 ba ph3 pv2 mb2 dib white bg-blue flex items-center"><ion-icon name="file-tray-full-outline" class="mr2"></ion-icon>Cập nhật bài viết</button>
            </div>
        </form>
        <p v-if="message" class="mt3 green">{{ message }}</p>
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

    <FooterC />
    <AddressModal v-if="isModalOpen" @close="closeModal" @complete="updateAddress" />
</template>

<style scoped>
.main-content {
    margin-top: 160px;
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
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
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
}
.nav-button {
    left: 10px;
}
.close-button {
    right: 10px;
}
</style>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllTypesApi } from '@/api/modules/type.api';
import { updatePostApi, getPostApi } from '@/api/modules/post.api';
import { uploadApi, upload3dApi } from '@/api/modules/upload.api';
import AddressModal from '../components/AddressSelectC.vue';
import HeaderC from '../components/HeaderC.vue';
import FooterC from '../components/FooterC.vue';

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