import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),

    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/register', component: () => import('pages/Register.vue') },
      {
        path: '/payments',
        component: () => import('pages/Payments.vue'),
        meta: { requiresAuth: true },
        beforeEnter: (to, from, next) => {
          const user = localStorage.getItem('user');
          if (!user) {
            return next({ path: '/login' });
          }

          next();
        },
      },
      { path: '/about', component: () => import('pages/About.vue') },
    ],
  },

  {
    path: '/login',
    component: () => import('pages/Login.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/NotFound.vue'),
  },
];

export default routes;
