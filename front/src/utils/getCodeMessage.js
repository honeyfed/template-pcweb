export default function (code) {
  code = code ? code.toString() : ''
  let codeObj = {
    '200011': '验证码错误',
    '200003': '该账号还未录入',
    '200016': '该账号未激活,正在跳转激活页面',
    '200002': '系统开小差了，请稍后再试'
  }
  let codeMessage = codeObj[code]
  if (codeMessage) {
    return codeMessage
  } else {
    return false
  }
}
