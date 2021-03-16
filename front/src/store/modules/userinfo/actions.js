import * as api from '@/api/index';

export default {
  async getUserInfo({ commit }) {
    const result = await api.test();
    if (result) {
      commit('setUserInfo', result);
      return;
    }
    commit('setUserInfo', null);
    throw new Error('获取用户信息为空');
  },
};
