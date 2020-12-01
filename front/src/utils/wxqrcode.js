let url = ''
let appId = ''
let hostname = window.location.hostname
if (process.env.NODE_ENV === 'production') {
  // 如果正式环境
  url = `https://${hostname}/api/login/handleWxLogin/20000012`
  appId = 'wx8c00a60013afe560'
} else {
  // 如果是测试环境和本地环境
  url = `https://${hostname}/api/login/handleWxLogin/10000001`
  appId = 'wx16cdafdbd1160d2c'
}

// import wx from 'weixin-js-sdk';
export default function createWxQrcode (option) {
  let defaultOpt = {
    self_redirect: true,
    id: 'wx-login-qrcode',
    appid: appId,
    scope: 'snsapi_login',
    redirect_uri: encodeURIComponent(url),
    state: '6fa9f1b0-4f92-11e9-99c3-525400e221a5',
    style: '',
    href: encodeURIComponent(location.origin + '/wx.css')
  }
  // wx.css
  if (option && typeof option === 'object') {
    defaultOpt = { ...defaultOpt, ...option }
  }
  /* eslint-disable-next-line no-undef,no-new */
  new WxLogin(defaultOpt)
}
