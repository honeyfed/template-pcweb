// this is the global actions
import * as api from '@/api'

export default {
  async getMenus ({commit}) {
    await api.getMenus()
      .then(res => {
        if (res.data) {
          commit('changeMenus', JSON.parse(res.data))
        }
      })
  }
}
