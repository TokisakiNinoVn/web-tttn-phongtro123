<template>
    <div>
      <h1>Management Account</h1>
      <div class="main">
        <div class="nav-bar">
          <router-link to="/create-post">Tạo mới bài viết</router-link>
          <ul>
            <li :class="{ active: activeSection === 'account' }" @click="viewAccountInfo">Quản lý tài khoản</li>
            <li :class="{ active: activeSection === 'posts' }" @click="viewPosts">Quản lý bài đăng</li>
            <li :class="{ active: activeSection === 'saved' }" @click="viewSavedPosts">Các bài viết đã lưu</li>
          </ul>
        </div>
        <div class="content">
            <div class="content">
                <!-- Account Management -->
                <div class="account" v-if="activeSection === 'account'">
                    <h2>Thông tin tài khoản</h2>
                    <div v-if="userInfo">
                        <form @submit.prevent="handleUpdate">
                            <div>
                                <label>Họ và tên:</label>
                                <input v-model="updatedUserInfo.name" type="text" />
                            </div>
                            <div>
                                <label>Zalo:</label>
                                <input v-model="updatedUserInfo.zalo" type="text" />
                            </div>
                            <div>
                                <label>Số điện thoại:</label>
                                <input v-model="updatedUserInfo.phone" type="text" />
                            </div>
                            <div>
                                <label>Địa chỉ:</label>
                                <input v-model="updatedUserInfo.address" type="text" />
                            </div>
                            <div>
                                <label>Facebook:</label>
                                <input v-model="updatedUserInfo.fbUrl" type="text" />
                            </div>
                            <div>
                                <label>Giới tính:</label>
                                <select v-model="updatedUserInfo.gender">
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                            <div>
                                <label>Bio:</label>
                                <textarea v-model="updatedUserInfo.bio" rows="4"></textarea>
                            </div>
                            <div>
                                <label>Avatar:</label>
                                <input type="file" @change="handleFileChange" />
                                <img :src="userAvatar" alt="Avatar" class="avatar" />
                            </div>
                            <button type="submit">Cập nhật thông tin tài khoản</button>
                        </form>
                        <button @click="deleteUser(userInfo.id)" class="delete-btn">Xóa tài khoản</button>
                        <div>
                            <button @click="logoutUser" class="logout-btn">Đăng xuất</button>
                        </div>

                    </div>
                    <div v-else>
                        <p>Không có thông tin tài khoản.</p>
                    </div>
                </div>
  
          <!-- Post Management -->
          <div class="post-management" v-if="activeSection === 'posts'">
            <h2>Quản lý bài viết</h2>
            <div v-for="post in userPosts" :key="post.id" class="post-item">
              <img v-if="post.files.length > 0" :src="instance.defaults.baseURL + post.files[0].url" alt="Post image" />
              <div class="description">
                <span class="title">{{ post.title }}</span>
                <p>
                  <span class="price">{{ post.price }}</span> triệu/tháng
                </p>
                <p>
                  <span class="acreage">{{ post.acreage }}</span> m²
                </p>
                <p>
                  <span class="address">{{ post.address }}</span>
                </p>
              </div>
              <button @click="updatePost(post.id)">Chỉnh sửa bài viết</button>
              <button @click="deletePost(post.id)">Xóa bài viết</button>
            </div>
          </div>
  
          <!-- Saved Posts -->
          <div class="save-post" v-if="activeSection === 'saved'">
            <h2>Các bài viết đã lưu</h2>
            <div v-for="post in savedPosts" :key="post.id" class="post-item">
              <img v-if="post.files.length > 0" :src="instance.defaults.baseURL + post.files[0].url" alt="Saved post image" />
              <div class="description">
                <span class="title">{{ post.title }}</span>
                <p>
                  <span class="price">{{ post.price }}</span> triệu/tháng
                </p>
                <p>
                  <span class="acreage">{{ post.acreage }}</span> m²
                </p>
                <p>
                  <span class="address">{{ post.address }}</span>
                </p>
              </div>
              <button @click="unSavePost(post.id)">Bỏ lưu bài viết</button>
              <button @click="viewDetails(post.id)">Xem chi tiết bài viết</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
  </template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { uploadApi } from '@/api/modules/upload.api';
import { unSavePostApi } from '@/api/modules/user.api';
import { deletePostApi } from '@/api/modules/post.api';
import { deleteUserApi, getPostSaveUserApi, getAllPostOfUserApi, updateUserApi,  } from "@/api/modules/user.api";
import instance from '@/api/axiosConfig';

// States
const router = useRouter();
const userInfo = ref(null);
const updatedUserInfo = ref({});
const userPosts = ref([]);
const savedPosts = ref([]);
const activeSection = ref('account');
const selectedFile = ref(null);
// const posts = ref([]);

// Computed property for avatar
const userAvatar = computed(() => {
    return updatedUserInfo.value?.avatar 
        ? `${instance.defaults.baseURL}/${updatedUserInfo.value.avatar}`
        : 'https://i.pinimg.com/736x/dc/bf/44/dcbf443fe182e29d56214dbe7067a5e3.jpg';
});
// Fetch user information on mount
onMounted(() => {
    const userData = localStorage.getItem('userInfo');
    if (userData) {
        userInfo.value = JSON.parse(userData);
        updatedUserInfo.value = { ...userInfo.value };
    }
});

//// Methods
const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
};

const handleUpdate = async () => {
    try {
      let avatarUrl = userAvatar.value.replace(`${instance.defaults.baseURL}/`, '');
        if (selectedFile.value) {
            const formData = new FormData();
            formData.append('postId', 0);
            formData.append('files', selectedFile.value);
            const uploadResponse = await uploadApi(formData);
            avatarUrl = uploadResponse.data.data[0].url;
        }

        // Dữ liệu gửi lên API backend
        const updatedData = {
            name: updatedUserInfo.value.name || '',
            phone: updatedUserInfo.value.phone || '',
            address: updatedUserInfo.value.address || '',
            gender: updatedUserInfo.value.gender || '',
            bio: updatedUserInfo.value.bio || '',
            avatar: avatarUrl,
            fbUrl: updatedUserInfo.value.fbUrl || '',
            zalo: updatedUserInfo.value.zalo || '',
        };

        // Gửi request tới API backend
        const response = await updateUserApi(userInfo.value.id, updatedData);
        console.log('Update user information response:', response);

        // Xử lý kết quả trả về
        alert('Cập nhật thông tin thành công!');
        userInfo.value = { ...userInfo.value, ...updatedData };
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
    } catch (error) {
        console.error('Error updating user information:', error);
    }
};

const logoutUser = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.clear(); 
        router.push('/'); 
        alert('Đăng xuất thành công!');
    }
};

const viewAccountInfo = () => {
    activeSection.value = 'account';
};

const viewPosts = async () => {
    activeSection.value = 'posts';
    if (userInfo.value?.id) {
        try {
            const response = await getAllPostOfUserApi(userInfo.value.id);
            userPosts.value = response.data.data || [];
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    }
};

const viewSavedPosts = async () => {
    activeSection.value = 'saved';
    if (userInfo.value?.id) {
        try {
            const response = await getPostSaveUserApi(userInfo.value.id);
            savedPosts.value = response.data.data || [];
        } catch (error) {
            console.error('Error fetching saved posts:', error);
        }
    }
};

const deleteUser = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
        try {
            await deleteUserApi(id);
            alert('Xóa tài khoản thành công!');
            localStorage.removeItem('userInfo');
            location.reload();
            router.push('/');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
};

// Hàm xử lý khi nhấn nút "Xem chi tiết"
const updatePost = async (postId) => {
    console.log("Chỉnh sửa bài đăng", postId);
    try {
        router.push({
            name: 'UpdatePost',
            params: { id: postId },
        });
    } catch (error) {
        console.error("Lỗi khi gọi API chi tiết bài đăng", error);
    }
};

const unSavePost = async (postId) => {
    const body = {
        postId: postId,
        userId: userInfo.value.id,
    };
  try {
    await unSavePostApi(body);
    savedPosts.value = savedPosts.value.filter((post) => post.id !== postId);
    alert('Đã bỏ lưu bài viết thành công!');
  } catch (error) {
    console.error('Error unsaving post:', error);
    alert('Không thể bỏ lưu bài viết.');
  }
};

const deletePost = async (postId) => {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
    try {
        await deletePostApi(postId);
        alert('Xóa bài viết thành công!');
        userPosts.value = userPosts.value.filter((post) => post.id !== postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
};

const viewDetails = async (postId) => {
    console.log("Xem chi tiết bài đăng", postId);
  try {
    router.push({
      name: 'DetailPost',
      params: { id: postId },
    });
  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết bài đăng", error);
  }
};
</script>

<style scoped>
textarea {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
}

select {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>

