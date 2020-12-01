<template>
  <div class="header">
    <div id="brand">
      <a href="/">
        <img :src="logo" alt="腾讯云未来社区">
      </a>
    </div>
  </div>
</template>

<script>
import LogoImg from '@/assets/img/haina_logo_black.svg'
export default {
  name: 'pageHeader',
  props: {
    logo: {
      type: String,
      required: true
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  background-color: #fff;
  // position: fixed;
  width: 100%;

  #brand {
    height: 100%;

    a {
      display: block;
      height: 100%;
      padding: 10px 20px;

      img {
        height: 100%;
        width: auto;
      }
    }
  }

  #user-box {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 200px;
    color: white;
    height: 100%;

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      overflow: hidden;
      position: absolute;
      left: 0;
      top: 18px;

      img {
        width: 100%;
      }
    }

    .user-info {
      margin-left: 60px;
      height: 100%;
      padding: 20px;
      .community-name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .user-name {
        position: relative;
        cursor: pointer;

        .caret {
          display: block;
          width: 10px;
          height: 10px;
          border-right: 1px solid white;
          border-bottom: 1px solid white;
          position: absolute;
          right: 0;
          bottom: 5px;
          transform: rotateZ(45deg);
        }
      }
    }
  }
}

</style>
