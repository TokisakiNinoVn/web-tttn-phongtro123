<template>
    <div class="reset-password">
        <h1>Reset Password</h1>
        <form @submit.prevent="resetPassword">
            <div>
                <label for="code">Code:</label>
                <input type="text" id="code" v-model="body.code" required />
            </div>
            <div>
                <label for="phone">Phone:</label>
                <input type="text" id="phone" v-model="body.phone" required />
            </div>
            <div>
                <label for="newPassword">New Password:</label>
                <input type="password" id="newPassword" v-model="body.newPassword" required />
            </div>
            <button type="submit">Reset Password</button>
        </form>
    </div>
</template>

<script setup>
import { forgetPasswordApi } from '@/api/modules/user.api';
import { useRouter } from 'vue-router';
const router = useRouter();
const body = {
    code: "",
    phone: "",
    newPassword: "",
};

const resetPassword = async () => {
    const response = await forgetPasswordApi(body);
    if (response.data?.code == 200) {
        alert(response.data.message);
        router.push('/login');
    } else if (response.data?.code == 400 || response.data?.code == 404) {
        alert(response.data?.message);
    } else {
        alert('Failed to reset password');
    }
};
</script>

<style scoped>
.reset-password {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.reset-password h1 {
    text-align: center;
}

.reset-password form div {
    margin-bottom: 15px;
}

.reset-password label {
    display: block;
    margin-bottom: 5px;
}

.reset-password input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.reset-password button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.reset-password button:hover {
    background-color: #0056b3;
}
</style>
