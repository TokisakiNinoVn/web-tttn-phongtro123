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
                <label for="files">Các ảnh 3d: </label>
                <input @change="handleFileChange3d" id="files" type="file" multiple />
            </div>
            <button type="submit">Đăng/Phát hành bài viết</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createPostApi } from '@/api/modules/post.api';
import { getAllTypesApi } from '@/api/modules/type.api';
import { uploadApi, upload3dApi } from '@/api/modules/upload.api';
import { useRouter } from 'vue-router';
// import { set } from 'core-js/core/dict';

const types = ref([]);
const router = useRouter();

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
// Handle file change for regular images/videos
const handleFileChange = (event) => {
    const files = event.target.files;
    form.value.files = Array.from(files).map(file => ({
        file,
        type: file.type.startsWith('image') ? 1 : file.type.startsWith('video') ? 2 : null
    }));
};

// Handle file change for 3D images
const handleFileChange3d = (event) => {
    const files = event.target.files;
    form.value.files3d = Array.from(files).map(file => ({
        file,
        type: file.type.startsWith('image') ? 3 : file.type.startsWith('video') ? 2 : null
    }));
};

// Handle form submission
const handleSubmit = async () => {
    try {
        const response = await createPostApi({
            userId: form.value.userId,
            title: form.value.title,
            type: form.value.type,
            address: form.value.address,
            price: form.value.price,
            acreage: form.value.acreage,
            realaddress: form.value.realaddress,
            owner: form.value.owner,
            phoneOwner: form.value.phoneOwner,
            description: form.value.description,
            amenities: form.value.amenities,
        });
        const postId = response.data.data.postId;

        const uploadedFiles = [];
        const uploadedFiles3d = [];

        // Upload regular images/videos
        if (form.value.files.length) {
            const formData = new FormData();
            formData.append('postId', postId);
            form.value.files.forEach(fileObj => {
                formData.append('files', fileObj.file);
            });
            // const uploadResponse = await uploadApi(formData);
            // uploadResponse.data.data.forEach((uploadedFile, index) => {
            //     uploadedFiles.push({
            //         url: uploadedFile.url,
            //         type: form.value.files[index].type,
            //     });
            // });
            const uploadResponse = await uploadApi(formData);

            if (Array.isArray(uploadResponse.data.data)) {
                uploadedFiles.push(
                    ...uploadResponse.data.data.map((uploadedFile, index) => ({
                        url: uploadedFile.url,
                        type: form.value.files[index].type,
                    }))
                );

            } else {
                console.error("Data is not an array:", uploadResponse.data.data);
            }

        }

        // Upload 3D images
        if (form.value.files3d.length) {
            const formData3d = new FormData();
            formData3d.append('postId', postId);
            form.value.files3d.forEach(fileObj => {
                formData3d.append('files', fileObj.file);
            });
            const upload3dResponse = await upload3dApi(formData3d);
            console.log('>> Upload 3D Response:', upload3dResponse);
            console.log('>> Upload 3D Response:', upload3dResponse.data.data);

            uploadedFiles3d.push(
                ...upload3dResponse.data.data.map((uploadedFile, index) => ({
                    url: uploadedFile.url,
                    type: form.value.files3d[index].type,
                }))
            );
        }


        // const allFiles = [...uploadedFiles, ...uploadedFiles3d];
        // console.log('>> All Uploaded Files:', allFiles);

        // await createPostApi({
        //     postId,
        //     files: allFiles,
        // });

        // message.value = response.message || 'Post created successfully!';
        // console.log('>> Created Post:', response.data);

        alert('Đăng bài viết thành công');
        setTimeout(() => {
            router.push('/');
        }, 1000);
    } catch (error) {
        console.error('>> Error:', error);
        message.value = error.response?.data?.message || 'An error occurred.';
    }
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
    } catch (error) {
        message.value = 'Error fetching post types.';
    }
});
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
</style>
