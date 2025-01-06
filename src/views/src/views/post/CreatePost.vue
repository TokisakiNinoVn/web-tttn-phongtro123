<template>
    <HeaderC />
    <div class="main-content pa7 pt5 pb5">
        <div class="create-post bg-light-gray br3 pa3 shadow-5">
            <h1 class="f2">Tạo bài đăng</h1>

            <span class="db mb3">Các trường thông tin có <span> (<span class="red">*</span>)</span> thì phải bắt buộc nhập thông tin</span>
            <form @submit.prevent="handleSubmit" class="flex flex-column">
                <div class="form-group mb3">
                    <label for="title" class="db">Tiêu đề bài đăng<span> (<span class="red">*</span>)</span>:</label>
                    <input v-model="form.title" id="title" type="text" required placeholder="Nhập tiêu đề bài đăng" class="input-reset ba b--black-20 pa2 mb2 db w-100" />
                </div>
                <div class="form-group mb3">
                    <label for="type" class="db">Loại bài đăng<span> (<span class="red">*</span>)</span>:</label>
                    <select v-model="form.type" id="type" required class="input-reset ba b--black-20 pa2 mb2 db w-100">
                        <option v-for="type in types" :key="type.id" :value="type.id">
                            {{ type.name }}
                        </option>
                    </select>
                </div>

                <div class="flex mb3">
                    <div class="form-group mr2 flex-grow-1">
                        <label for="price" class="db">Giá tiền 1 tháng<span> (<span class="red">*</span>)</span>:</label>
                        <!-- <input v-model="form.price" id="price" type="number" required placeholder="Vui lòng ghi đúng số tiền đúng với thực tế (đơn vị tính đ/tháng)" class="input-reset ba b--black-20 pa2 mb2 db w-100" /> -->
                        <input
                            v-model="formattedPrice"
                            id="price"
                            type="text"
                            required
                            placeholder="Vui lòng ghi đúng số tiền đúng với thực tế (đơn vị tính đ/tháng)"
                            class="input-reset ba b--black-20 pa2 mb2 db w-100"
                            @input="formatPrice"
                        />
                    </div>
                    <div class="form-group flex-grow-1">
                        <label for="acreage" class="db">Diện tích<span> (<span class="red">*</span>)</span>:</label>
                        <input v-model="form.acreage" id="acreage" type="number" required placeholder="m2" class="input-reset ba b--black-20 pa2 mb2 db w-100" />
                    </div>
                </div>
                <div class="form-group mb3">
                    <label for="address" class="db mb2">Địa chỉ <span>(<span class="red">*</span>)</span></label>
                    <div class="flex">
                        <button type="button" @click="openAddressModal" class="f6 link dim br3 ba dib dark-gray mr3">Chọn địa chỉ</button>
                        <input v-model="form.address" id="address" type="text" required placeholder="Nhập địa chỉ..." class="input-reset ba b--black-20 pa2 mb2 db w-100" />
                    </div>
                </div>
                <div class="form-group mb3">
                    <label for="realaddress" class="db">Địa chỉ cụ thể <span> (<span class="red">*</span>)</span>:</label>
                    <input v-model="form.realaddress" id="realaddress" type="text" required class="input-reset ba b--black-20 pa2 mb2 db w-100" />
                </div>
                <div class="flex mb3">
                    <div class="form-group mr2 flex-grow-1">
                        <label for="owner" class="db">Chủ<span> (<span class="red">*</span>)</span>:</label>
                        <input v-model="form.owner" id="owner" type="text" required class="input-reset ba b--black-20 pa2 mb2 db w-100" />
                    </div>
                    <div class="form-group flex-grow-1">
                        <label for="phoneOwner" class="db">Số điện thoại<span> (<span class="red">*</span>)</span>:</label>
                        <input v-model="form.phoneOwner" id="phoneOwner" type="text" required class="input-reset ba b--black-20 pa2 mb2 db w-100" />
                    </div>
                </div>
                <div class="form-group mb3">
                    <label for="description" class="db">Mô tả<span> (<span class="red">*</span>)</span>:</label>
                    <textarea v-model="form.description" id="description" required placeholder="Nhập thêm các thông tin mô tả về phòng trọ, căn hộ,..." class="input-reset ba b--black-20 pa2 mb2 db w-100"></textarea>
                </div>
                <div class="form-group mb3">
                    <label for="amenities" class="db flex">Hãy tích chọn các tiện nghi mà phòng trọ, căn hộ,... đang có<span> (<span class="red">*</span>)</span>:</label>
                    <div class="mb3 flex mt3">
                        <button type="button" @click="checkAllAmenities" class="f6 link dim br3 ba ph3 pv2 mb2 dib dark-gray">Chọn hết</button>
                        <button type="button" @click="clearAllAmenities" class="f6 link dim br3 ba ph3 pv2 mb2 dib dark-gray ml3">Bỏ chọn hết</button>
                    </div>
                    <div class="mb3 flex flex-wrap">
                        <label v-for="(amenity, index) in amenitiesList" :key="index" class="db ">
                            <input type="checkbox" v-model="form.amenities[index]" class="" /><span class=" ml3 mr5"> {{ amenity }}</span>
                        </label>
                    </div>
                </div>
                <div class="form-group mb3">
                    <label for="files" class="db">Đăng tải các ảnh/Video<span> (<span class="red">*</span>)</span> - Bạn nên đăng tải lên 1 vài ảnh hoặc video nhằm mô tả rõ hơn về tình hình thực tế của phòng trọ, căn hộ...</label>
                    <input @change="handleFileChange" id="files" type="file" multiple class="input-reset ba b--black-20 pa2 mb2 db w-100" />
                </div>
                <div class="form-group mb3">
                    <label for="files3d" class="db">Các ảnh 360 (Mục này không bắt buộc)</label>
                    <input 
                        ref="files3dInput" 
                        @change="handleFileChange3d" 
                        id="files3d" 
                        type="file" 
                        multiple 
                        class="input-reset ba b--black-20 pa2 mb2 db w-100"
                    />
                    <span class="db">Nếu bạn có nhu cầu chụp các ảnh 360 nhằm mô tả rõ hơn về căn phòng hoặc địa điểm hãy liên hệ với chúng tôi 
                        <router-link to="/contact" class="blue underline">tại đây</router-link>
                    </span>
                </div>
                <button type="submit" class="f6 link dim br3 ba ph3 pv2 mb2 dib white bg-blue">Đăng/Phát hành bài viết</button>
            </form>
            <p v-if="message" class="red">{ message }</p>
        </div>
    </div>

    <div v-if="form.files.length" class="preview-images pa5">
        <h3 class="">Các ảnh/Video đã chọn:</h3>
        <div class="flex  overflow-auto flex-wrap items-center justify-center">
            <div v-for="(fileObj, index) in form.files" :key="index" class=" mb3 pa2 flex flex-column align-center items-center">
                <div class="mb2">
                    <div v-if="fileObj.type === 1">
                        <img :src="fileObj.previewUrl" alt="Preview" class="file-preview preview-image w-25" @click="openPreview(index, 'image')" />
                    </div>
                    <div v-else-if="fileObj.type === 2">
                        <video :src="fileObj.previewUrl" controls class="file-preview preview-video w-25" @click="openPreview(index, 'video')">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                <div class="mb2">
                    <button @click="removeFile(index)" class="delete-button">Xóa</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="isPreviewModalOpen" class="preview-modal fixed top-0 left-0 w-100 h-100 bg-black-80 flex items-center justify-center z-9999">
        <div class="modal-content bg-white pa4 br3">
            <div v-if="previewType === 'image'">
                <img :src="form.files[previewIndex].previewUrl" alt="Full Preview" class="full-preview" />
            </div>
            <div v-else-if="previewType === 'video'">
                <video :src="form.files[previewIndex].previewUrl" controls class="full-preview">
                    Your browser does not support the video tag.
                </video>
            </div>
            <div class="flex justify-around mt3">
                <button @click="previousFile" class="nav-button f6 link dim br3 ba ph3 pv2 mb2 dib dark-gray flex align-center justify-center"><ion-icon name="caret-back-outline"></ion-icon> Trước</button>
                <button @click="closePreview" class="close-button f6 link dim br3 ba ph3 pv2 mb2 dib red flex align-center justify-center"><ion-icon name="contract-outline"></ion-icon>Đóng</button>
                <button @click="nextFile" class="nav-button f6 link dim br3 ba ph3 pv2 mb2 dib dark-gray flex align-center justify-center">Sau <ion-icon name="caret-forward-outline"></ion-icon></button>
            </div>
        </div>
    </div>

    <div v-if="form.files3d.length" class="mb3 pl7">
        <button class="f6 link dim br3 ba ph3 pv2 mb2 dib blue" @click="open3dPreview(0)">Xem trước ảnh 360</button>
    </div>

    <div v-if="is3dImageVisible" class="pannellum-container fixed top-0 left-0 w-100 h-100 bg-black">
        <button class="close-btn fixed z-9999 top-0 right-0 close-btn f6 link dim br3 ba ph3 pv2 mb2 dib red flex align-center justify-center" @click="close3dImage"><ion-icon class="mr3" name="contract-outline"></ion-icon>Đóng</button>
        <div id="panorama" class="panorama"></div>

        <div class="nav-tool-preview fixed">
            <button class="prev-btn f6 link dim br3 ba ph3 pv2 dib dark-gray flex align-center justify-center" @click="prev3dImage"><ion-icon name="chevron-back-outline"></ion-icon> Trước đó</button>
            <button class="delete-btn f6 link dim br3 ba ph3 pv2 dib red flex align-center justify-center" @click="removeFile3d(current3dIndex)"><ion-icon name="close-outline"></ion-icon> Xóa</button>
            <button class="next-btn f6 link dim br3 ba ph3 pv2 dib dark-gray flex align-center justify-center" @click="next3dImage"><ion-icon name="chevron-forward-outline"></ion-icon> Tiếp theo</button>
        </div>
    </div>

    <AddressModal v-if="isModalOpen" @close="closeModal" @complete="updateAddress" />
    <FooterC />
</template>

<style scoped>
.nav-tool-preview {
    position: fixed;
    z-index: 10000;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);

    background-color: rgb(240, 223, 201);
    width: 400px;
    height: 60px;
    border-radius: 8px;
    padding: 10px 20px;

    display: flex;
    justify-content: space-around;
    align-items: center;
}

.main-content {
    margin-top: 140px;
    min-height: 90vh;
}
.pannellum-container {
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background-color: #000;
}
.preview-images {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.file-preview {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    flex-direction: column;
    flex-wrap: wrap;

    max-height: 270px;
    max-width: 480px;
}

.preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 150px;
    margin-right: 1rem;
}

.preview-image, .preview-video {
    width: 100%;
    height: auto;
    margin-bottom: 0.5rem;
    max-height: 270px;
}

.delete-button {
    font-size: 0.9rem;
    color: white;
    background-color: red;
    border: none;
    border-radius: 5px;
    padding: 0.5rem;
    cursor: pointer;
}

.delete-button:hover {
    background-color: darkred;
}

</style>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllTypesApi } from '@/api/modules/type.api';
import { createPostApi } from '@/api/modules/post.api';
import { uploadApi, upload3dApi } from '@/api/modules/upload.api';
import AddressModal from '../components/AddressSelectC.vue';
import HeaderC from '../components/HeaderC.vue';
import FooterC from '../components/FooterC.vue';

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
const formattedPrice = ref('');
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
  if (!form.value.acreage || isNaN(form.value.acreage)) return 'Diện tích phải là số hợp lệ';
  return null;
};

const updateAddress = (address) => {
    form.value.address = `${address.province} - ${address.district} - ${address.commune}`;
    closeModal();
};

const formatPrice = () => {
  let cleanValue = formattedPrice.value.replace(/\D/g, "");
  formattedPrice.value = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
  form.value.price = cleanValue; 
};
const checkAllAmenities = () => {
    form.value.amenities = form.value.amenities.map(() => true);
};

const clearAllAmenities = () => {
    form.value.amenities = form.value.amenities.map(() => false);
};

const openAddressModal = () => (isModalOpen.value = true);
const closeModal = () => (isModalOpen.value = false);
const openPreview = (index, type) => {
  previewIndex.value = index;
  previewType.value = type;
  isPreviewModalOpen.value = true;
};
const closePreview = () => (isPreviewModalOpen.value = false);

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
            current3dIndex.value = form.value.files3d.length - 1;
        }
        open3dPreview(current3dIndex.value);
    }
};
const close3dImage = () => (is3dImageVisible.value = false);
const next3dImage = () => {
    if (current3dIndex.value < form.value.files3d.length - 1) {
        current3dIndex.value++;
        open3dPreview(current3dIndex.value);
    } else {
        alert("Không còn ảnh để hiển thị!");
    }
};

const prev3dImage = () => {
    if (current3dIndex.value > 0) {
        current3dIndex.value--;
        open3dPreview(current3dIndex.value);
    } else {
        alert("Không còn ảnh để hiển thị!")
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

