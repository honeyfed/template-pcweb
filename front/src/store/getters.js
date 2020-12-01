export default {
  homeAddress (state) {
    let home = (state.sideMenus[0] && state.sideMenus[0].children[0]) || { url: 'about:blank' }
    return home.url
  }
}
