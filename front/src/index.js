import '@babel/polyfill'

import Vue from 'vue'

// import ElementUI from 'element-ui'
import HoneyUI from 'honey-ui'
import 'honey-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import './index.less'

// raven-js
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

// Flavors support
import Flavor from '../../flavors'

Vue.prototype.$flavor = Flavor

Vue.use(HoneyUI)

// 收集线上报错

console.log(router)
/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
