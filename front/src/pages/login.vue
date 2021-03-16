<template>
  <div class="no-authority"  :style="{ height: height }">
      <img src="../assets/cry.svg" >
    <div>
      {{text}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  data() {
    return {
      text: '该用户没有权限',
      height: '600px',
    };
  },
  created(){
    this.text = '我是测试'
    this.height = document.documentElement.clientHeight - 100;
  },
  methods: {
    checkIsWx(){
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/micromessenger/i) == 'micromessenger') {
        const system = {
          win: false,
          mac: false,
        };
        // 检测平台
        const p = navigator.platform;
        system.win = p.indexOf('Win') === 0;
        system.mac = p.indexOf('Mac') === 0;
        if (system.win || system.mac) {
          return 1;
        }
        return 2;
      }
      return 0;
    }
  }
};
</script>

<style lang="less" scoped>
  @import '../components/common';
  .no-authority {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    background: #fff;
    div {
      font-size: @font-size-lg;
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
    }
    img {
      position: absolute;
      width: 10%;
      top: 20%;
      left: 45%;
    }
  }
</style>
