import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import HomePage from '@/views/HomePage.vue';
import PageNotFound from '@/views/PageNotFound.vue';
import CreatePost from '@/views/post/CreatePost.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },

  {
    path: '/create-post',
    name: 'CreatePost',
    component: CreatePost,
    meta: { requiresAuth: true },

  },

  // Trang 404
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: PageNotFound,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Route guard để kiểm tra người dùng đã đăng nhập chưa
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('isLogin'); // Kiểm tra token
//   if (isAuthenticated == 'true') {
//     next(); 
//   } else {
//     next('/login');
//   }
// });

export default router;
