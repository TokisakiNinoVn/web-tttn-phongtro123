import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/index';
import 'tachyons/css/tachyons.min.css';

// Kiểm tra và khởi tạo giá trị mặc định trong localStorage
if (!localStorage.getItem('isLogin')) {
  localStorage.setItem('isLogin', 'false');
}

if (!localStorage.getItem('userInfo')) {
  localStorage.setItem('userInfo', JSON.stringify({}));
}

// Tạo và gắn ứng dụng Vue
createApp(App)
  .use(router)
  .mount('#app');


