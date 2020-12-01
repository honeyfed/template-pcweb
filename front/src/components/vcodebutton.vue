<template>
  <el-button
    @click="click"
    :disabled="disabled || sendCodeTimeLeft > 0"
  >{{ sendCodeTimeLeft <= 0 ? '获取验证码' : sendCodeTimeLeft + 's' }}</el-button>
</template>

<script>
import SafeTimer from '@/utils/safetimer'

export default {
  name: 'vcodebutton',
  props: {
    tag: {
      required: true,
      type: String
    },
    disabled: {
      required: true,
      type: Boolean
    }
  },
  data () {
    return {
      sendCodeTimeLeft: 0
    }
  },
  created () {
    this.timer = new SafeTimer(this.tag, timeLeft => {
      console.log('sendCodeTimeLeft: ', timeLeft)
      this.sendCodeTimeLeft = timeLeft
    })
    console.log('this.timer: ', this.timer)
  },
  methods: {
    click () {
      this.$emit('click')
      this.disableSendCode()
    },
    disableSendCode () {
      console.log('disableSendCode: 60')
      this.timer.setTimeLeft(60)
    }
  },
  beforeDestroy () {
    this.timer.setTimeLeft(1)
  }
}
</script>

<style scoped lang='less'>
// @import "~@/components/global.less";
// .el-button--default {
//   box-sizing: border-box !important;
//   line-height: 40px;
//   height: 40px;
//   padding: 0 !important;
//   background: #fff;
//   border: 1px solid @def-blue;
//   color: @def-blue;
//   font-size: @font-size-h3-text;
//   &.is-disabled {
//     background: #ddd;
//     border: 1px solid #bbb;
//     color: #888888;
//   }
// }
</style>
