export default {
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
    if (userInfo) {
      localStorage.setItem('user-info', JSON.stringify(userInfo))
    } else {
      localStorage.setItem('user-info', '')
    }
  },
  // 保存小区信息
  setCommunityInfo (state, communityInfo) {
    state.communityInfo = communityInfo
  },

  // 保存当前点击的node节点id
  setNodeId (state, nodeId) {
    state.nodeId = nodeId
  }
}
