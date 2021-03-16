export default {
  setUserInfo(state, userInfo) {
    // eslint-disable-next-line
    state.userInfo = userInfo;
    if (userInfo) {
      localStorage.setItem('user-info', JSON.stringify(userInfo));
    } else {
      localStorage.setItem('user-info', '');
    }
  },
};
