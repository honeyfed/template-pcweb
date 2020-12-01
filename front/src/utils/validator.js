export function validateMobile (rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入手机号'))
  }

  if (!/1\d{10}/.test('' + value)) {
    callback(new Error('手机号格式错误'))
  } else {
    callback()
  }
}

export function validateVCode (rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入验证码'))
  }

  if (!/\d{6}/.test('' + value)) {
    callback(new Error('验证码格式错误'))
  } else {
    callback()
  }
}
