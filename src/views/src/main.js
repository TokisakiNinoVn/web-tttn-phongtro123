import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/index'
import 'tachyons/css/tachyons.min.css';


createApp(App)
  .use(router)
  .mount('#app')

localStorage.setItem('isLogin', 'false')
