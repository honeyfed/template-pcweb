import VueRouter from 'vue-router'
import Vue from 'vue'
import store from '@/store'

Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login.vue'),
    meta: {
      hideUserInfo: true
    }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  console.log('router from: ', from, ' ;to: ', to)
  // 扫描二维码登录不是管理员也能登陆进来，在query进行判断，errcode=300006，跳转到激活
  // let loginErrcode = to.query.errcode
  // if (loginErrcode && loginErrcode === '300006') {
  //   next({
  //     name: 'license'
  //   })
  // }
  // debugger;
  // // need to login
  store.dispatch('userInfo/getUserInfo').then(() => {
    // has session
    next()
  }).catch(() => {
    if (to.path === '/login') {
      next()
      return
    }
    next({
      name: 'login'
      // query: {
      //   redirect: to.fullPath,
      // },
    })
  })
})

export default router
