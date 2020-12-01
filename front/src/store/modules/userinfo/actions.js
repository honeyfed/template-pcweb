import * as api from '@/api'

export default {
  login ({ commit }, formData) {
    return new Promise((resolve, reject) => {
      api.loginWithMobile(formData).then((res) => {
        resolve(res)
      }).catch(err => {
        commit('setUserInfo', null)
      })
    })
  },
  getUserInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      api.getLoginAdminInfo().then(result => {
        if (result) {
          commit('setUserInfo', result)
          resolve()
        } else {
          commit('setUserInfo', null)
          reject(new Error('获取用户信息为空'))
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      api.logout().then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }

}
