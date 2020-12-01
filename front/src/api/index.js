
import { ApiError } from './error'
import net from '@/utils/net'
import toast from '@/utils/toast.js'
import ErrorCodeDescription from '@/errcode_description.js'

let axios = net

export function sendCode (data) {
  axios.post('/Auth/GetVerifyCode', data).then(result => {
    if (result.data && result.data.code === 0) {
    } else {
      if (ErrorCodeDescription[result.data.code]) {
        toast.error(ErrorCodeDescription[result.data.code])
      } else {
        toast.error(result.data.message)
      }
    }
  }).catch(err => {
    toast.error('网络开小差了')
  })
}

export function getMenus () {
  return axios.post('/Config/Menus')
    .then(res => res.data)
}

export function checkCode (mobile, code) {
  return new Promise((resolve, reject) => {
    axios.post('/hc/sms/checkCode', {
      'phoneNumber': mobile,
      'vcode': code
    }).then(result => {
      resolve(result)
    }).catch(err => {
      console.error(err)
      reject(new ApiError('验证码'))
    })
  })
}

export function loginWithMobile (data) {
  return new Promise((resolve, reject) => {
    axios.post('/Auth/Login', data).then(result => {
      resolve(result)
    }).catch(err => {
      reject(new ApiError('登录'))
    })
  })
}

export function bindMobileAndAdminId (mobile, adminId) {
  return new Promise((resolve, reject) => {
    axios.post('/hc/admin/bindMobileAndAdminId', {
      'mobilePhone': mobile,
      'adminId': adminId
    }).then(result => {
      if (result.data && result.data.code === 0) {
        resolve()
      }
    }).catch(err => {
      console.error(err)
      reject(new ApiError('绑定微信号'))
    })
  })
}

export function getLoginAdminInfo () {
  return new Promise((resolve, reject) => {
    axios.post('/User/Info').then(result => {
      if (result.data && result.data.code === 0) {
        resolve(result.data.data)
      } else {
        reject(new Error('获取用户信息失败'))
      }
    }).catch(err => {
      console.error(err)
      reject(new ApiError('获取用户信息'))
    })
  })
}

export function getAdminCommunityList () {
  return new Promise((resolve, reject) => {
    axios.post('/hc/admin/getAdminCommunityList').then(result => {
      if (result.data && result.data.code === 0) {
        resolve(result.data.data)
      } else {
        reject(new Error('获取小区列表失败'))
      }
    }).catch(err => {
      console.error(err)
      reject(new ApiError('获取小区列表'))
    })
  })
}

/**
 * 登出
 */
export function logout () {
  return new Promise((resolve, reject) => {
    axios.post('/hc/admin/logout').then(response => {
      resolve(response.data)
    }).catch(err => {
      console.log('logout error: ', err)
      reject(new ApiError('登出失败'))
    })
  })
}
