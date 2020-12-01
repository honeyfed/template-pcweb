/**
 /** 请求工具类
 /**
 /**/
import axios from 'axios'
const HainaServerTimetampKey = 'haina-server-timestamp-key'
const ClientOffsetTimestampKey = 'haina-client-offset-timestamp-key'

const timestampAxiosInstance = axios.create()
const axiosInstance = axios.create({
  timeout: 60000
})

// 根据不同的环境配置不同的baseUrl
let AXIOS_BASE_URL = ''

let baseUrl = {
  production: '/access/integrator',
  test: '/access/integrator',
  development: '/access/integrator'
}

AXIOS_BASE_URL = baseUrl[process.env.NODE_ENV]

console.log('当前axios的baseUrl路径', AXIOS_BASE_URL)
timestampAxiosInstance.defaults.baseURL = '/api'
axiosInstance.defaults.baseURL = AXIOS_BASE_URL

// const Code2message = {
//   '200011': '验证码错误',
//   '200003': '该账号还未录入',
//   '200016': '该账号未激活',
//   '200002': '系统开小差了，请稍后再试',
//   '200004': '参数错误',
//   '200018': '手机号已存在'
//   // "100004":"系统错误，请重新登录"
// }

// 随机字符串生成
function nonce () {
  return Date.now().toString().slice(5) + Math.ceil(Math.random() * 100000000)
}

// 清除缓存的timestamp相关数据
function deleteTimestampData () {
  sessionStorage.removeItem(HainaServerTimetampKey)
  sessionStorage.removeItem(ClientOffsetTimestampKey)
}

// 获取timestap
function getTimestamp () {
  // return localStorage.getItem(HainaServerTimetampKey) || Date.now()
  let offsetTimestamp = parseInt(sessionStorage.getItem(ClientOffsetTimestampKey) || 0)
  let nowTimestamp = Date.now()
  return nowTimestamp + offsetTimestamp
}

// 判断本地是否有已经存在的timestamp数据
function isFreshTimestamp () {
  let fresh = false
  if (sessionStorage.getItem(HainaServerTimetampKey) && sessionStorage.getItem(ClientOffsetTimestampKey)) {
    fresh = true
  }

  return fresh
}

// 请求的中间拦截
axiosInstance.interceptors.request.use(async function (config) {
  // if http method is post, append cmu-timestamp and cmu-nonce headers

  if (!isFreshTimestamp()) {
    // get server timestamp
    try {
      // let serverTimestamp = await fetchServerTimestamp()
      // console.log('serverTimestamp: ', serverTimestamp)
      // refreshTimestampData(serverTimestamp)
    } catch (error) {
      console.error('')
    }
  }

  config.headers['cmu-timestamp'] = getTimestamp()
  config.headers['cmu-nonce'] = nonce()
  config.headers['cmu-requestId'] = nonce()

  return config
}, function (error) {
  Promise.reject(error)
})

// 返回拦截的中间处理函数
let handlers = []

// 未登录，直接跳转到登录页； 需要激活，跳转到激活页面
handlers.push(function (response) {
  if (response.data.code === -100) { // 未登录
    // 这里跳转到首页登录页面
    if (window.location.pathname !== '/login') {
      console.log('用户信息过期，强制刷新')
      window.location.pathname = '/login' // FIXME: 不要注释这一行代码
    }
    return
  }

  // 需要激活，跳转到激活页面
  if (response.data.code === 200016) {
    console.log('200016')
    window.location.pathname = '/active/license'
    return
  }

  if (response.data.code < 0) { // error
    // TODO: 这里处理错误信息
    let error = response.data.message
    console.log('error: ', error)
  }
})

// 请求返回的中间拦截, response: {data: Object, status: 200, statusText: "OK", headers: Object, config: Object, request: XMLHttpRequest }
axiosInstance.interceptors.response.use(function (response) {
  console.log('请求中间拦截', response)
  for (let i = 0; i < handlers.length; i++) {
    handlers[i](response)
  }
  return response
  // return Promise.resolve()
}, function (error) {
  // console.error('Axios Error: ', error)
  // return Promise.resolve()

  return Promise.reject(error)
})

// net 网络请求组件
function Net () {
  // delete old timestamp data and fetch server timestap
  // 每次进来都要删除本地的存储的timestap数据，重新从服务器端拉取
  deleteTimestampData()

  // fields
  this.baseURL = AXIOS_BASE_URL
}

Net.prototype.get = function (url, params) {
  let _params = params || {}
  return axiosInstance.get(url, {params: _params})
}

Net.prototype.post = function (url, params, config) {
  console.log('axiosInstance headers: ', axiosInstance)
  let _params = params || {}
  return axiosInstance.post(url, _params, config)
}

Net.prototype.requestHeaders = function () {
  let headers = {}
  headers['cmu-timestamp'] = getTimestamp()
  headers['cmu-nonce'] = nonce()
  headers['cmu-requestId'] = nonce()
  return headers
}

export default new Net()
