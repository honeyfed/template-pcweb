<template>
  <div class="no-authority" :style="{ height: height }">
    <img src="../assets/cry.svg" />
    <div>很遗憾，您没有当前链接的权限/(ToT)/~~</div>
  </div>
</template>

<script>
export default {
  name: 'no_authority',
  data() {
    return {
      height: '600px',
    };
  },
  created() {
    this.height = document.documentElement.clientHeight - 100;
  },
};
</script>

<style lang="less" scoped>
@import './common';
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
