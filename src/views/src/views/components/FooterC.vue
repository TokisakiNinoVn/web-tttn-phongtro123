<template>
    <footer class="app-footer">
      <div class="footer-container">
        <!-- Logo và giới thiệu -->
        <div class="footer-section">
          <h2>Trang Đăng Tin Phòng Trọ</h2>
          <p>
            Nền tảng hàng đầu để tìm kiếm và đăng tin cho thuê phòng trọ, nhà nghỉ, căn hộ.
            Giúp bạn kết nối nhanh chóng và tiện lợi với chủ nhà hoặc khách thuê.
          </p>
        </div>
  
        <!-- Liên hệ -->
        <div class="footer-section">
          <h3>Liên hệ</h3>
          <ul>
            <li>Email: support@phongtro.com</li>
            <li>Hotline: 1900 123 456</li>
            <li>Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</li>
          </ul>
        </div>
  
        <!-- Chính sách -->
        <div class="footer-section">
          <h3>Chính sách</h3>
          <ul>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Điều khoản sử dụng</a></li>
            <li><a href="#">Quy định đăng tin</a></li>
          </ul>
        </div>
  
        <!-- Mạng xã hội -->
        <div class="footer-section">
          <h3>Kết nối với chúng tôi</h3>
          <div class="social-links">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Trang Đăng Tin Phòng Trọ. All Rights Reserved.</p>
      </div>
    </footer>
  </template>
  
  <script setup>
  // Dùng script setup để tối giản cấu trúc
  </script>
  
  <style scoped>
  .app-footer {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 2rem 1rem;
    font-family: Arial, sans-serif;
  }
  
  .footer-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1.5rem;
  }
  
  .footer-section {
    flex: 1 1 20rem;
  }
  
  .footer-section h2, .footer-section h3 {
    color: #f39c12;
    margin-bottom: 1rem;
  }
  
  .footer-section ul {
    list-style: none;
    padding: 0;
  }
  
  .footer-section ul li {
    margin-bottom: 0.5rem;
  }
  
  .footer-section ul li a {
    color: #ecf0f1;
    text-decoration: none;
  }
  
  .footer-section ul li a:hover {
    text-decoration: underline;
  }
  
  .social-links a {
    color: #ecf0f1;
    font-size: 1.5rem;
    margin-right: 0.5rem;
    text-decoration: none;
  }
  
  .social-links a:hover {
    color: #f39c12;
  }
  
  .footer-bottom {
    text-align: center;
    margin-top: 2rem;
    border-top: 1px solid #7f8c8d;
    padding-top: 1rem;
    font-size: 0.9rem;
  }
  </style>
  