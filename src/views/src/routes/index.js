import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import HomePage from '@/views/HomePage.vue';
import PageNotFound from '@/views/PageNotFound.vue';
import CreatePost from '@/views/post/CreatePost.vue';
import DetailPost from '@/views/post/DetailPost.vue';
import AccountPage from '@/views/account/AccountPage.vue';
import UpdatePost from '@/views/post/UpdatePost.vue';
import ResultFilterPage from '@/views/post/ResultFilterPage.vue';
import ResultSearch from '@/views/post/ResultSearch.vue';
import ForgetPassword from '@/views/GetOTPForgetPassword.vue';
import ResetPassword from '@/views/ResetPassword.vue';

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

  {
    path: '/update-post/:id',
    name: 'UpdatePost',
    component: UpdatePost,
  },

  {
    path: '/filter-result',
    name: 'ResultFilterPage',
    component: ResultFilterPage,
  },

  {
    path: '/post/:id',
    name: 'DetailPost',
    component: DetailPost,
    props: (route) => ({ id: route.params.id, postDetails: route.state?.postDetails })
  },
  
  {
    path: '/account',
    name: 'AccountPage',
    component: AccountPage,
  },

  {
    path: '/search-result',
    name: 'SearchResult',
    component: ResultSearch,
  },

  {
    path: '/get-otp-forget-password',
    name: 'ForgetPassword',
    component: ForgetPassword,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
  },

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
