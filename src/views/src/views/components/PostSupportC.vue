<template>
    <div class="pa4 bg-light-gray flex">
    <!-- Phần hình ảnh hỗ trợ -->
    <div class="flex items-center justify-center mb4">
        <div class="w-100">
        <img
            src="https://i.pinimg.com/736x/d0/4b/3f/d04b3fd05477766a61a8267f01c60b11.jpg"
            alt="Support Phone"
            class="br3 shadow-3 w-100"
        />
        </div>
    </div>
    <!-- Phần thông tin hỗ trợ -->
    <div class="tc">
        <h3 class="f3 fw7 dark-blue">Hotline Hỗ Trợ</h3>
        <p class="f5 gray">
        Nếu bạn cần hỗ trợ đăng tin, vui lòng liên hệ qua các kênh bên dưới:
        </p>
        <div class="mt3">
        <button class="f6 link dim br3 ba bw1 ph3 pv2 mb3 bg-blue white">
            <i class="fa fa-phone mr2"></i>Điện thoại: 0123456789
        </button>
        <button class="f6 link dim br3 ba bw1 ph3 pv2 bg-green white">
            <i class="fa fa-comments mr2"></i>Zalo: 0123456789
        </button>
        </div>
        <div class="mt4 tc">
            <p class="f6 gray">Chúng tôi luôn sẵn lòng hỗ trợ bạn</p>
        </div>
    </div>
    <!-- Phần ghi chú cuối -->
    </div>
</template>

<script setup>
// Không cần thêm logic JavaScript trong ví dụ này
</script>

<style>
/* Thêm hiệu ứng cho hình ảnh */
img {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
img:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

/* Thêm khoảng cách giữa các nút */
button + button {
    margin-top: 1rem;
}
</style>
