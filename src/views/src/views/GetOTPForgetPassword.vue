<template>
    <div class="forget-password">
        <h1>Forget Password</h1>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="phone">Phone:</label>
                <input type="phone" v-model="phone" id="phone" required />
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getCodeApi } from '@/api/modules/user.api';
import { useRouter } from 'vue-router';
// import { set } from 'core-js/core/dict';

const phone = ref('');
const router = useRouter();
const submitForm = () => {
    getCode();
};

const getCode = async () => {
    try {
        const response = await getCodeApi({ phone: phone.value });
        if (response?.status === 200) {
            const message = response.data.message;
            alert(message);
            setTimeout(async () => {
            await router.push('/reset-password');
            }, 1000);
        } else {
            throw new Error('Failed to send code');
        }
    } catch (error) {
        console.error('error:', error);
    }
};
</script>

<style scoped>
.forget-password {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
