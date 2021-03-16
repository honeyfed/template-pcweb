<template>
  <el-button @click="click" :disabled="disabled || sendCodeTimeLeft > 0">{{
    0 >= sendCodeTimeLeft ? '获取验证码' : sendCodeTimeLeft + 's'
  }}</el-button>
</template>

<script>
import SafeTimer from '@/utils/safetimer';

export default {
  name: 'vcodebutton',
  props: {
    tag: {
      required: true,
      type: String,
    },
    disabled: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      sendCodeTimeLeft: 0,
    };
  },
  created() {
    this.timer = new SafeTimer(this.tag, (timeLeft) => {
      this.sendCodeTimeLeft = timeLeft;
    });
  },
  methods: {
    click() {
      this.$emit('click');
      this.disableSendCode();
    },
    disableSendCode() {
      this.timer.setTimeLeft(60);
    },
  },
  beforeDestroy() {
    this.timer.setTimeLeft(1);
  },
};
</script>

<style scoped lang="less"></style>
