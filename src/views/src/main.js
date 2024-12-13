import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/index';
import 'tachyons/css/tachyons.min.css';

// if (!localStorage.getItem('isLogin')) {
//   localStorage.setItem('isLogin', 'false');
// }

// if (!localStorage.getItem('userInfo')) {
//   localStorage.setItem('userInfo', JSON.stringify({}));
// }

createApp(App)
  .use(router)
  .mount('#app');


