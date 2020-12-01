export default {
  // 设置我的应用下的应用列表
  setMyAppSideMenus (state, list) {
    let index = state.sideMenus.findIndex(i => i.title === '我的应用')
    for (let item of list) {
      if (item.pc_access_url && item.pc_access_url.length > 1) {
        item.children = item.pc_access_url
        for (let child of item.children) {
          child.link = `${item.link}`
        }
        delete item.pc_access_url
        delete item.link
      }
    }
    state.sideMenus[index].children = list
  },
  changeMenus (state, menus) {
    state.sideMenus = menus
  }
}
