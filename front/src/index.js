import Vue from 'vue';
import 'babel-polyfill';
import HoneyUI from 'honey-ui';
import 'honey-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import './index.less';

Vue.prototype.$flavor = {
  env: {},
};

Vue.use(HoneyUI);

Vue.config.errorHandler = function(err) {
  console.error('vue error:', err);
};

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  router,
  store,
  render(h) {
    return h(App);
  },
});
