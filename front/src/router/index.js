import VueRouter from 'vue-router';
import Vue from 'vue';
import store from '@/store';

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    component: () => import('@/pages/layout.vue'),
    redirect: 'myapp/no_authority',
    children: [
      {
        path: 'myapp/no_authority',
        name: 'no_authority',
        component: () => import('@/components/no_authority.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login.vue'),
    meta: {
      hideUserInfo: true,
    },
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/pc',
});
router.beforeEach((to, from, next) => {
  console.log('router from: ', from, ' ;to: ', to);
  next();
  // 扫描二维码登录不是管理员也能登陆进来，在query进行判断，errcode=300006，跳转到激活
  // let loginErrcode = to.query.errcode
  // if (loginErrcode && loginErrcode === '300006') {
  //   next({
  //     name: 'license'
  //   })
  // }
  // debugger;
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    // // need to login
    store
      .dispatch('userInfo/getUserInfo')
      .then(() => {
        // 已登录， 判断权限
        if (store.state.sideMenus.length === 0 || !to.meta.requirePermission) {
          next();
        } else {
          store
            .dispatch('grantedPermission', to.meta.belongTo)
            .then((result) => {
              if (result) {
                // 有权限
                next();
              } else {
                // 没有权限
                next(false);
              }
            })
            .catch((err) => {
              console.error('grantedPermission error: ', err);
              next(false);
            });
        }
      })
      .catch(() => {
        next({
          name: 'login',
        });
      });
  } else {
    next();
  }
});

export default router;
