<template>
  <div class="loading_wrapper" :class="[this.$flavor.env.name]">

    <!-- background -->
    <div class="background" :style="{top: this.$flavor.env.topSpace || 0, bottom: this.$flavor.env.bottomSpace || 0 }">
      <img :src="background" class="bg_img">
    </div>

    <!-- logos -->
    <div v-for="(logo, index) in this.$flavor.env.homeLogos"
         :class="index === 0 ? 'logo first-logo ' : 'logo'"
         :key="index">
      <img style="display: block; width:auto; height: 36px; line-height: 0;" :src="logo"/>
    </div>

    <!-- login form -->
    <div class="loading_box">
      <h1 class="title">{{ "政府管理平台"}}</h1>
      <div class="login-box">
        <div class="tap_box">
          <!-- <h2
            class="select-qrcode-btn tab-btn"
            :class="{ 'active': loginType === 'qrcode' }"
            @click="chooseLoginMethod('qrcode')"
          >扫码登录</h2> -->
          <h2
                  class="select-mobile-btn tab-btn"
                  :class="{ 'active': false }"
                  @click="chooseLoginMethod('mobile')"
          >手机号登录</h2>
        </div>
        <div v-show="false" class="tab-panel">
          <div class="qrcode-wrapper">
            <div id="wx-login-qrcode"/>
            <!-- <p class="activate-tips">
              我是新账号？
              <router-link to="/active/license">立即激活</router-link>
            </p> -->
          </div>
        </div>
        <div v-show="true" class="tab-panel">
          <!-- visibility: hidden -->
          <div class="from_tip" :style="{ visibility:this.formTip.show }">
            <i class="from_tip-icon"></i>
            <div class="from_tip-text">{{formTip.text}}</div>
          </div>
          <el-form :model="form" ref="loginForm">
            <el-form-item prop="mobile">
              <el-input
                      v-model="form.mobile"
                      placeholder="输入手机号"
                      maxlength="11"
                      @input.native="changePhone"
              />
            </el-form-item>

            <el-form-item prop="code" :style="{marginBottom:'13px'}">
              <el-input
                      v-model="form.code"
                      placeholder="输入验证码"
                      class="input-code-box"
                      @input.native="changeCode"
                      @keyup.enter.native="clickLogin"
                      maxlength="6"
              />

              <v-code-button
                      class="get-code-btn"
                      @click="sendCode"
                      tag="login-timer"
                      :disabled="!isMobileValid"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn" @click="clickLogin" :loading="logining" >登录</el-button>
            </el-form-item>
          </el-form>
          <!-- <p class="activate-tips">
            我是新账号？
            <router-link to="/active/license">立即激活</router-link>
          </p> -->
        </div>
      </div>
    </div>

    <!-- footer -->
    <div v-if="this.$flavor.env.copyright"
         class="footer-copyright"
         style="position: absolute;bottom: 0;width: 100%;height: 88px; line-height: 88px; text-align: center;font-size: 16px;">
      <span>{{this.$flavor.env.copyright}}</span>
    </div>
  </div>
</template>

<script>
  import VCodeButton from '@/components/vcodebutton.vue'
  import * as api from '@/api'
  import { AccountNotBindError } from '@/api/error'
  import { mapActions, mapGetters } from 'vuex'
  import createWxQrcode from '@/utils/wxqrcode'
  import { validateMobile, validateVCode } from '@/utils/validator.js'
  import formTipIcon from '@/assets/code_error.svg'

  import toast from '@/utils/toast.js'
  import getCodeMessage from '@/utils/getCodeMessage.js'

  export default {
    name: 'Login',
    components: {
      VCodeButton
    },
    data () {
      return {
        logining: false,
        form: {
          mobile: '',
          code: ''
        },
        formTip: {
          show: 'hidden',
          text: '登录失败，请重试',
          formTipIcon: formTipIcon
        },
        rules: {
          mobile: [{ validator: validateMobile, trigger: 'blur' }],
          code: [{ validator: validateVCode, trigger: 'blur' }]
        },
        loginType: 'qrcode',
        background: this.$flavor.env.background || require('@/assets/loading_bg.svg'),
        phoneOk: false,
        captchaArr: {
          dev: '',
          pre: '',
          pro: ''
        }
      }
    },
    computed: {
      isMobileValid () {
        return this.form.mobile && this.form.mobile.length === 11 && this.phoneOk
      },
      ...mapGetters(['homeAddress'])
    },
    mounted () {
      createWxQrcode({
        id: 'wx-login-qrcode',
        state: this.$flavor.env.businessIdLogin,
        appid: this.$flavor.env.appid
      })

      let errcode = this.$route.query.errcode || ''
      if (errcode === '300006') {
        toast.error('账号未激活或者没有权限')
      }
    },
    methods: {
      changePhone () {
        let mobile = this.form.mobile.replace(/[^\d]/g, '')
        this.$set(this.form, 'mobile', mobile)
        if (this.form.mobile.length >= 11) {
          this.phoneOk = this.checkPhone()
        }
      },
      changeCode () {
        let code = this.form.code.replace(/[^\d]/g, '')
        this.$set(this.form, 'code', code)
      },
      chooseLoginMethod (type) {
        this.loginType = type
      },
      sendCode () {
        this.phoneOk = this.checkPhone()
        if (this.form.mobile && this.form.mobile.length === 11) {
          api.sendCode({ mobile: this.form.mobile })
        }
      },
      clickLogin () {
        this.phoneOk = this.checkPhone()
        if (!this.phoneOk) {
          return
        }

        if (!/\d{6}/.test(this.form.code.trim())) {
          this.formTip.text = '请输入正确的验证码'
          this.formTip.show = 'visible'
          return
        }

        this.formTip.show = 'hidden'

        this.$refs.loginForm.validate(valid => {
          if (valid) {
            let appId = ''
            switch (window.location.host) {
              case 'gov-test.haina.com':
                appId = this.captchaArr.dev; break
              case 'gov-pre.haina.com':
                appId = this.captchaArr.pre; break
              case 'gov.haina.com':
                appId = this.captchaArr.pro; break
              default:
                appId = this.captchaArr.dev; break
            }
            const captcha = new window.TencentCaptcha(appId, (ret) => {
              if (ret.ret === 0) {
                console.log(ret)
                this.logining = true
                let { mobile, code } = this.form
                let params = { mobile, verify_code: code, ticket: ret.ticket, randstr: ret.randstr}
                this.login(params).then(res => {
                  this.logining = false
                  if (res.data && res.data.code === 0) {
                    this.goGetUserInfo()
                  } else {
                    if (getCodeMessage(res.data.code)) {
                      toast.error(getCodeMessage(res.data.code))
                    } else {
                      toast.error(res.data.message === 'admin has not exists' ? '很抱歉，您的手机号暂无权限' : res.data.message)
                    }
                    if (res.data.code === 200016) {
                      setTimeout(() => {
                        this.$router.push({
                          path: '/active'
                        })
                      }, 2000)
                    }
                  }
                }).catch(err => {
                  console.log(err)
                  this.logining = false
                })
              }
            })
            captcha.show()
          }
        })
      },
      goGetUserInfo () {
        this.getUserInfo()
          .then((res) => {
            console.log(res)
            let path = res.length > 0 ? res[0] : '/myapp/no-authority'
            this.$router.push({
              path: path
            })
          })
          .catch(err => {
            if (err instanceof AccountNotBindError) {
              this.$router.push({
                path: '/active'
              })
            } else {
              this.$message.error(err.message)
            }
          })
      },
      checkPhone () {
        if (!this.form.mobile) {
          this.formTip.text = '手机号码不能为空'
          this.formTip.show = 'visible'
          return false
        }
        if (
          !/^1\d{10}$/.test(this.form.mobile) ||
          this.form.mobile.length !== 11
        ) {
          this.formTip.text = '请输入正确的手机号码'
          this.formTip.show = 'visible'
          return false
        }
        this.formTip.show = 'hidden'
        return true
      },
      ...mapActions('userInfo', ['login', 'getUserInfo'])
    }
  }
</script>

<style lang="less" scoped>

  .loading_wrapper {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .background {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
  }

  .logo {
    position: relative;
    display: inline-block;
    margin: 20px 0 0 0;
    height: 36px;
  }

  .logo + .logo {
    border-left: 1px solid #ddd;
  }

  .first-logo {
    margin-left: 15.3%;
  }

  // 腾住定制版
  .tenzont .first-logo {
    margin-left: 3%;
  }

  .bg_img {
    display: block;
    height: 100%;
    width: 100%;
    line-height: 0;
  }

  .loading_box {
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
    margin-top: -67px;
  }

  @media screen and (min-width: 1100px) {
    .loading_box {
      margin-top: -9%;
    }
  }

  @media screen and (min-width: 900px) {
    .loading_box {
      margin-top: 0;
    }
  }

  @media screen and (min-width: 1439px) {
    .loading_box {
      margin-top: -7%;
    }
  }

  @media screen and (min-width: 1800px) {
    .loading_box {
      margin-top: -4.5%;
    }
  }

  .title {
    font-size: 24px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    margin-bottom: 25px;
  }

  .login-box {
    background: #f6faff;
    border-radius: 8px;
    width: 400px;
    height: 398px;
    position: relative;
    padding: 40px 80px 0 80px;
    //border: 1px solid black;
    .tap_box {
      width: 100%;
    }

    .tab-btn {
      width: 100%;
      font-size: 14px;
      text-align: center;
      padding-bottom: 10px;
      // color: @def-blue;
      color: black;
      // border-bottom: 1px solid #ddd;
      cursor: pointer;
    }

    h2:after {
      width: 0px;
    }

    .active {
      color: #006eff;
      position: relative;

      &:after {
        display: block;
        content: "";
        position: absolute;
        width: 100%;
        transition: width 0.5s;
        height: 2px;
        background: #006eff;
        left: 0;
        bottom: -1px;
      }
    }

    .select-qrcode-btn {
      float: left;
    }

    .select-mobile-btn {
      float: right;
    }

    .tab-panel {
      width: 100%;
      height: 300px;
      margin-top: 20px;

      .input-code-box {
        width: 140px;
        display: block;
      }

      .get-code-btn {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
      }

      .login-btn {
        width: 100%;
      }

      .qrcode-wrapper {
        width: 100%;
        height: 300px;

        img {
          width: 100%;
        }
      }

      .el-form-item {
        margin-bottom: 10px;
      }
    }

    .activate-tips {
      height: 20px;
      width: 240px;
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
    }

    .qrcode-wrapper {
      .activate-tips {
        position: absolute;
        margin-top: 0;
        bottom: 72px;
      }
    }
  }

  .from_tip {
    line-height: 40px;
    color: #b43537;
    text-align: left;
    margin-left: 20px;

    .from_tip-text {
      display: inline-block;
      font-size: 12px;
    }

    .from_tip-icon {
      width: 16px;
      height: 16px;
      background: url("~@/assets/code_error.svg") no-repeat center;
      background-size: 100% 100%;
      vertical-align: middle;
      display: inline-block;
    }
  }
</style>
