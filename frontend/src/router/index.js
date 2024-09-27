import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/views/Index.vue';
import HomeView from '@/views/Home.vue';
import Login from '@/views/LoginRegist/Login.vue';
import Regist from '@/views/LoginRegist/Regist.vue';
import DetailProduct from '@/components/DetailProduct.vue';
import Search from '@/components/Search.vue';
import ShoppingCart from '@/components/ShoppingCart.vue';
import Profile from '@/views/Profile.vue';
import HistoryOrder from '@/components/HistoryOrder.vue';
import TransactionDetails from '@/components/TransactionDetails.vue';
import AdminLogin from '@/views/Admin/AdminLogin.vue';
import HomeAdmin from '@/views/Admin/Home.vue';
import DataUser from '@/views/Admin/DataUser.vue';
import DataAdmin from '@/views/Admin/DataAdmin.vue';
import EditAdmin from '@/views/Admin/EditAdmin.vue';
import DataProduct from '@/views/Admin/DataProduct.vue';
import EditProduct from '@/views/Admin/EditProduct.vue';
import DataTransaction from '@/views/Admin/DataTransaction.vue';
import EditTransaction from '@/views/Admin/EditTransaction.vue';
import ValidateToken from '@/views/Admin/ValidateToken.vue';
import TransactionSuccess from '@/views/NotifPayment/TransactionSuccess.vue';
import TransactionPending from '@/views/NotifPayment/TransactionPending.vue';
import TransactionFailed from '@/views/NotifPayment/TransactionFailed.vue';
import AdminRegist from '@/views/Admin/AdminRegist.vue';
import DataTransactionDetail from '@/views/Admin/DataTransactionDetail.vue';


const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
  {
    path: '/home',
    name: 'HomeView',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/regist',
    name: 'Regist',
    component: Regist
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/product/:id',
    name: 'DetailProduct',
    component: DetailProduct,
    meta: { requiresAuth: true },
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: ShoppingCart,
    meta: { requiresAuth: true },
  },
  {
    path: '/history',
    name: 'HistoryOrder',
    component: HistoryOrder,
    meta: { requiresAuth: true },
  },
  {
    path: '/transaction/:transactionCode',
    name: 'TransactionDetails',
    component: TransactionDetails,
    meta: { requiresAuth: true },
  },
  // Admin routes
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/regist',
    name: 'AdminRegist',
    component: AdminRegist
  },
  {
    path: '/admin/home',
    name: 'HomeAdmin',
    component: HomeAdmin,
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/datauser',
    name: 'DataUser',
    component: DataUser,
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/dataadmin',
    name: 'DataAdmin',
    component: DataAdmin,
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/editadmin/:id',
    name: 'EditAdmin',
    component: EditAdmin,
    meta: { requiresAdminAuth: true },
    props: true
  },
  {
    path: '/admin/dataproduct',
    name: 'DataProduct',
    component: DataProduct,
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/editproduct/:id',
    name: 'EditProduct',
    component: EditProduct,
    meta: { requiresAdminAuth: true },
    props: true
  },
  {
    path: '/admin/datatransaction',
    name: 'DataTransaction',
    component: DataTransaction,
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/datatransaction/:id',
    name: 'EditTransaction',
    component: EditTransaction,
    meta: { requiresAdminAuth: true },
    props: true
  },
  {
    path: '/admin/datatransaction/detail/:transaction_code',
    name: 'DataTransactionDetail',
    component: DataTransactionDetail,
  },
  {
    path: '/admin/validatetoken',
    name: 'ValidateToken',
    component: ValidateToken,
    meta: { requiresAdminAuth: true },
  },
  // payment 
  {
    path: '/statuspayment/Transaction-Success',
    name: 'TransactionSuccess',
    component: TransactionSuccess,
    meta: { requiresAuth: true },
  },
  {
    path: '/statuspayment/Transaction-Pending',
    name: 'TransactionPending',
    component: TransactionPending,
    meta: { requiresAuth: true },
  },
  {
    path: '/statuspayment/Transaction-Failed',
    name: 'TransactionFailed',
    component: TransactionFailed,
    meta: { requiresAuth: true },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const userToken = localStorage.getItem('authToken');
  const adminToken = sessionStorage.getItem('authTokenAdmin');
  if (to.name === 'index' && (userToken || adminToken)) {
    next({ name: 'HomeView' });
  } 
  else if (to.matched.some(record => record.meta.requiresAuth) && !userToken) {
    next({ name: 'Login' });
  } 
  else if (to.matched.some(record => record.meta.requiresAdminAuth) && !adminToken) {
    next({ name: 'AdminLogin' });
  } 
  else {
    next();
  }
});

export default router;
