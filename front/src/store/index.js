import Vue from 'vue'
import Vuex from 'vuex'
import userInfo from './modules/userinfo/index'

import globalState from './state'
import globalGetters from './getters'
import globalMutations from './mutations'
import globalActions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userInfo
  },
  state: globalState,
  getters: globalGetters,
  mutations: globalMutations,
  actions: globalActions,
  strict: false,
  plugins: []
})
