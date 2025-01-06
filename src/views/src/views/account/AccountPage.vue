<template>
  <HeaderC />
  <div class="main-container pa4 mt6 flex items-center align-center justify-center">
    <div class="main-content flex">
      <div class="nav-bar-left nav-bar w-25 pa3 br3 shadow-2">
        <router-link to="/create-post" class="create-post db f3 link dim black b mb3 flex items-center">
          <ion-icon name="add-circle-outline" class="mr2"></ion-icon>
          Tạo mới bài viết
        </router-link>
        <ul class="list pl0">
          <li 
            :class="{ 'b': activeSection === 'account' }" 
            class="f4 link dim pointer mb2 flex items-center"
            @click="viewAccountInfo">
            <ion-icon name="person-outline" class="mr2"></ion-icon>
            Quản lý tài khoản
          </li>
          <li 
            :class="{ 'b': activeSection === 'posts' }" 
            class="f4 link dim pointer mb2 flex items-center"
            @click="viewPosts">
            <ion-icon name="folder-outline" class="mr2"></ion-icon>
            Quản lý bài đăng
          </li>
          <li 
            :class="{ 'b': activeSection === 'saved' }" 
            class="f4 link dim pointer mb2 flex items-center"
            @click="viewSavedPosts">
            <ion-icon name="bookmark-outline" class="mr2"></ion-icon>
            Các bài viết đã lưu
          </li>
          <li 
            :class="{ 'b': activeSection === 'changepassword' }" 
            class="f4 link dim pointer mb2 flex items-center"
            @click="viewChangePassWord">
            <ion-icon name="shield-outline" class="mr2"></ion-icon>
            Đổi mật khẩu
          </li>
        </ul>
      </div>

      <!-- Content Area -->
      <div class="content w-75 pa3">
        <div v-if="activeSection === 'account'" class="account pa4 bg-light-gray">
          <h2 class="f2 mb4 tc">Thông tin tài khoản</h2>
          
          <div class="bg-white br3 pa4 shadow-5 flex flex-wrap">
            <div class="w-50 pr3">
              <form @submit.prevent="handleUpdate" class="flex flex-column">
                <div class="mb3">
                  <label class="db f5">Họ và tên:</label>
                  <input v-model="updatedUserInfo.name" type="text" class="input-reset ba b--black-20 pa2 mb2 w-100 br2" placeholder="Nhập họ và tên" />
                </div>
                <div class="mb3">
                  <label class="db f5">Số điện thoại:</label>
                  <input v-model="updatedUserInfo.phone" type="text" class="input-reset ba b--black-20 pa2 mb2 w-100 br2" placeholder="Nhập số điện thoại" />
                </div>

                <div class="mb3">
                  <label class="db f5">Zalo:</label>
                  <input v-model="updatedUserInfo.zalo" type="text" class="input-reset ba b--black-20 pa2 mb2 w-100 br2" placeholder="Nhập Zalo" />
                </div>
                <div class="mb3">
                  <label class="db f5">Giới tính:</label>
                  <select v-model="updatedUserInfo.gender" class="input-reset ba b--black-20 pa2 mb2 w-100 br2">
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div class="mb3">
                  <label class="db f5">Avatar:</label>
                  <input type="file" @change="handleFileChange" class="input-reset ba b--black-20 pa2 mb2 br2" />
                  <img :src="userAvatar" alt="Avatar" class="br-100 h4 w4 mt2" />
                </div>
              </form>
            </div>

            <div class="w-50 pl3">
              <div class="mb3">
                <label class="db f5">Địa chỉ:</label>
                <input v-model="updatedUserInfo.address" type="text" class="input-reset ba b--black-20 pa2 mb2 w-100 br2" placeholder="Nhập địa chỉ" />
              </div>
              <div class="mb3">
                <label class="db f5">Facebook:</label>
                <input v-model="updatedUserInfo.fbUrl" type="text" class="input-reset ba b--black-20 pa2 mb2 w-100 br2" placeholder="Nhập link Facebook" />
              </div>
              <div class="mb3">
                <label class="db f5">Bio:</label>
                <textarea v-model="updatedUserInfo.bio" rows="4" class="input-reset ba b--black-20 pa2 mb2 w-100 br2" placeholder="Viết một chút về bản thân"></textarea>
              </div>
              <button type="submit" class="b ph3 pv2 input-reset ba b--black-20 bg-light-green grow pointer f6 br2">Cập nhật thông tin tài khoản</button>
              
            </div>
          </div>

          <div class="mt4 flex justify-between">
            <button @click="deleteUser(userInfo.id)" class="b ph3 pv2 input-reset ba b--red bg-light-red grow pointer f6 br2">Xóa tài khoản</button>
            <button @click="logoutUser" class="b ph3 pv2 input-reset ba b--black-20 bg-light-blue grow pointer f6 br2 flex items-center"><ion-icon name="exit-outline" class="mr2"></ion-icon>Đăng xuất</button>
          </div>
        </div>


        <!-- Post Management Section -->
        <div v-if="activeSection === 'posts'" class="post-management pa4 bg-light-gray">
          <h2 class="f3 mb4 tc">Quản lý bài viết</h2>
          <div class="list-post">
            <div v-for="post in userPosts" :key="post.id" class="post-item w-40 mb4 bg-white br3 pa3 shadow-3">
              <div class="image-container mb3" style="overflow: hidden; height: 200px;">
                <img v-if="post.files.length > 0" :src="instance.defaults.baseURL + post.files[0].url" alt="Post image" class="w-100 h-100 object-fit-cover" />
              </div>
              <div class="description">
                <span class="title f4 b">{{ post.title }}</span>
                <p class="f5">
                  <span class="price f4 b">{{ post.price }}</span> triệu/tháng
                </p>
                <p class="f5">
                  <span class="acreage f4 b">{{ post.acreage }}</span> m²
                </p>
                <p class="f5">
                  <span class="address">{{ post.address }}</span>
                </p>
              </div>
              <div class="flex justify-between mt3">
                <button @click="updatePost(post.id)" class="b ph3 pv2 input-reset ba b--black-20 bg-light-yellow grow pointer f6">Chỉnh sửa bài viết</button>
                <button @click="deletePost(post.id)" class="b ph3 pv2 input-reset ba b--red bg-light-red grow pointer f6">Xóa bài viết</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Saved Posts Section -->
        <div v-if="activeSection === 'saved'" class="save-post w-100 pa4 bg-light-gray">
          <h2 class="f3 tc mb4">Các bài viết đã lưu</h2>
          <div class="flex flex-column">
            <div v-for="post in savedPosts" :key="post.id" class="post-item br3 pa3 mb4 shadow-4 bg-white flex">
              <img v-if="post.files.length > 0" :src="instance.defaults.baseURL + post.files[0].url" alt="Saved post image" class="br2 w-20 h-25 " />
              <div class="description mt3 ml4">
                <span class="title f4 b">{{ post.title }}</span>
                <p class="f5">
                  <span class="price f4 b">{{ post.price }}</span> triệu/tháng
                </p>
                <p class="f5">
                  <span class="acreage f4 b">{{ post.acreage }}</span> m²
                </p>
                <p class="f5">
                  <span class="address">{{ post.address }}</span>
                </p>
              </div>
              <div class="flex justify-between mt3 flex-column w-20">
                <button @click="unSavePost(post.id)" class="b ph3 pv2 input-reset ba b--black-20 bg-light-yellow grow pointer f6 br2">Bỏ lưu</button>
                <button @click="viewDetails(post.id)" class="b ph3 pv2 input-reset ba b--green bg-light-green grow pointer f6 br2 mt2">Xem chi tiết</button>
              </div>
            </div>
          </div>
        </div>


        <!-- Change Password Section -->
        <div v-if="activeSection === 'changepassword'" class="changepassword">
          <h2 class="f3">Đổi mật khẩu</h2>
          <div class="bg-light-gray br3 pa4 shadow-3">
            <div class="mb3">
              <label for="oldPassword" class="db f5">Mật khẩu cũ:</label>
              <input type="password" v-model="body.oldPassword" class="input-reset ba b--black-20 pa2 mb2 w-100" />
            </div>
            <div class="mb3">
              <label for="newPassword" class="db f5">Mật khẩu mới:</label>
              <input type="password" v-model="body.newPassword" class="input-reset ba b--black-20 pa2 mb2 w-100" />
            </div>
            <div class="mb3">
              <label for="confirmPassword" class="db f5">Xác nhận mật khẩu mới:</label>
              <input type="password" v-model="body.confirmPassword" class="input-reset ba b--black-20 pa2 mb2 w-100" />
            </div>
            <button @click="changePassword" class="b ph3 pv2 input-reset ba b--black-20 bg-light-green grow pointer f6">Đổi mật khẩu</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <FooterC />
</template>


<style scoped>
.main-container {
  min-height: 90vh;
}

.create-post {
  background-color: rgb(248, 207, 207);
  padding: 16px;
  border-radius: 8px;
}

.list-post {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.nav-bar-left {
  min-width: 280px;
}

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

.main-content  {
  max-width: 1200px;
}

.save-post {
  min-width: 800px;
}

.post-item {
  transition: transform 0.3s;
}

.post-item:hover {
  transform: translateY(-5px);
}

h2 {
  color: #333;
}

.changepassword {
  min-width: 500px;
}
</style>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { uploadApi } from '@/api/modules/upload.api';
import { unSavePostApi } from '@/api/modules/user.api';
import { deletePostApi } from '@/api/modules/post.api';
import { deleteUserApi, getPostSaveUserApi, getAllPostOfUserApi, updateUserApi, changePasswordApi } from "@/api/modules/user.api";
import instance from '@/api/axiosConfig';
import HeaderC from '../components/HeaderC.vue';
import FooterC from '../components/FooterC.vue';

const router = useRouter();
const userInfo = ref(null);
const userId = ref(null);
const updatedUserInfo = ref({});
const userPosts = ref([]);
const savedPosts = ref([]);
const activeSection = ref('account');
const selectedFile = ref(null);

const userAvatar = computed(() => {
    return updatedUserInfo.value?.avatar 
      ? `${instance.defaults.baseURL}/${updatedUserInfo.value.avatar}`
      : 'https://i.pinimg.com/736x/dc/bf/44/dcbf443fe182e29d56214dbe7067a5e3.jpg';
});
const body = {
  phone: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
}
onMounted(() => {
  const userData = localStorage.getItem('userInfo');
  if (userData) {
    userInfo.value = JSON.parse(userData);
    updatedUserInfo.value = { ...userInfo.value };
    userId.value = userInfo.value.phone;
  }
});

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

    await updateUserApi(userInfo.value.id, updatedData);
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
const viewChangePassWord = async () => {
  activeSection.value = 'changepassword';
}

const changePassword = async () => {
  try {
    if (body.newPassword !== body.confirmPassword) {
      console.log(body.newPassword, body.confirmPassword)
      alert('Mật khẩu nhập lại không khớp!');
      return;
    }
    body.phone = userInfo.value.phone;
    await changePasswordApi(body);
    alert('Đổi mật khẩu thành công!');
  } catch (error) {
    console.error('Error changing password:', error);
    alert('Không thể đổi mật khẩu.');
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

const updatePost = async (postId) => {
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


