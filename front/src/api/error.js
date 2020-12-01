export class AccountNotBindError extends Error {
  constructor () {
    super('账号未绑定')
  }
}

export class ApiError extends Error {
  constructor (apiName) {
    super(`${apiName}接口错误`)
  }
}
