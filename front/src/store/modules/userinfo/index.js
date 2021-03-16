import getters from './getters.js';
import actions from './actions.js';
import mutations from './mutations.js';

let userInfo = {};
try {
  const data = localStorage.getItem('user-info');
  if (data) {
    userInfo = JSON.parse(data);
  }
} catch (err) {}

const state = {
  userInfo,
  communityInfo: {},
  nodeId: '',
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
