<template>
    <div class="">
        <!-- <HeaderC /> -->
        <div class="service-intro">
            <div class="container">
                <div class="content">
                    <h1 class="title">Chụp Ảnh 360 độ cho phòng trọ, căn hộ,... hoặc các dịch vụ khác</h1>
                    <p class="description">Mang đến cho bạn những hình ảnh sống động, chân thực về không gian phòng trọ với dịch vụ chụp ảnh 360 độ của chúng tôi. Giúp người thuê dễ dàng hình dung không gian sống của mình một cách rõ nét nhất.</p>
                    
                    <div class="cta">
                        <button class="btn btn-primary">Đặt lịch ngay</button>
                        <p class="cta-text">Chỉ với vài bước đơn giản, bạn sẽ có được những bức ảnh chất lượng cao.</p>
                    </div>
                </div>
                <div class="image-container">
                    <img :src="imageUrl" alt="360 Photo" />
                </div>
            </div>
        </div>
        <div class="w-100 flex justify-center align-center items-center" style="height: 100px;">
            <router-link class="ct" to="/">Quay lại Trang chủ</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const imageUrl = ref('https://i.pinimg.com/736x/d8/d2/5b/d8d25bcb3c1155cbedc3715bd5bdfcba.jpg')
</script>

<style scoped>
#app {
    margin-top: 0px;
}
.service-intro {
    background: linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://i.pinimg.com/736x/d8/d2/5b/d8d25bcb3c1155cbedc3715bd5bdfcba.jpg');
    background-size: cover;
    color: white;
    padding: 100px 20px;
    padding-top: 0px;
    text-align: center;
    /* margin-top: 140px; */
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
}

.content {
    margin-bottom: 30px;
}

.title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 15px;
    color: #FFD700;
}

.description {
    font-size: 1.2rem;
    line-height: 1.5;
    max-width: 800px;
    margin: 0 auto;
    margin-bottom: 30px;
}

.cta {
    margin-top: 20px;
}

.cta-text {
    font-size: 1rem;
    margin-top: 10px;
    color: #FFCC00;
}

.btn {
    background-color: #FFCC00;
    color: black;
    padding: 15px 30px;
    font-size: 1.2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn:hover {
    background-color: #FFD700;
}

.image-container img {
    width: 100%;
    max-width: 600px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
