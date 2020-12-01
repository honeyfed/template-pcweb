<template>
<div id="haina-header">
  <el-row class="haina-header__wrapper">
    <el-col :span="3">
      <a class="header_logo">
        <img :src="logo" style="width: 100%;">
      </a>
    </el-col>
    <el-col :span="18">
      <div class="blank-line"></div>
      <div class="header_modules">政府管理平台</div>
    </el-col>
    <el-col :span="3">
      <div class="header_info">
        <div id="user-box" v-if="showUserInfo">
          <!-- <div class="avatar">
            <img :src="userInfo.adminUrl || userInfo.avatarImg" alt>
          </div> -->
          <div class="user-info">
            <div class="company-name">{{ userInfo.GovName }}</div>
            <div class="user-box-l">
              <el-dropdown trigger="click" style="display: block;" @command="handleMenu" placement="bottom-start">
                <div class="user-box-ll">
                  <div class="user-identity">{{ userInfo.roleName }}</div>
                  <div class="el-dropdown-link user-name">
                    <div class="user-name-box">{{ userInfo.adminName }}</div>
                    <i class="tea-icon tea-icon-arrowdown"></i>
                  </div>
                </div>
                <el-dropdown-menu slot="dropdown" style="width: 252px;">
                  <!-- <el-dropdown-item command="list-community">切换小区</el-dropdown-item> -->
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</div>

</template>

<script>

export default {
  name: 'HainaPageHeader',
  props: {
    userInfo: {
      type: Object,
      required: false
    },
    showUserInfo: {
      type: Boolean,
      required: false,
      default: false
    },
    logo: {
      type: String,
      required: true
    }
  },
  data () {
    return {

    }
  },
  beforeCreate () {
    console.log('hainapageheader beforeCreate userInfo:  ', this)
  },
  created () {
    console.log('hainapageheader created userInfo:  ', this.userInfo)
  },
  methods: {
    handleMenu (command) {
      console.log('handleMenu: ', command)
      this.$emit('onMenuClicked', command)
    }
  }
}
</script>

<style lang="less" scoped>
@import url("~@/components/global.less");

@headerHeight: 50px;
.haina-header__wrapper {
  width: 100%;
  background: #262626;
  height: @headerHeight;
}
.user-identity{
  font-size: 12px;
}
#haina-header {
    position: relative;
    display: block;
    width: 100%;
    min-width:1220px;
    height: @headerHeight;

    // box-sizing: border-box;
    padding: 0 20px;

    background-color: #262626;

    .header_logo {
        position: absolute;
        display: block;
        width: 160px;
        height: 32px;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        // background: url("./assets/logo.svg") no-repeat;
        background-size: contain;
    }

    .header_info {
        position: absolute;

        display: block;
        width: auto;
        height: 100%;

        top: 0;
        right: 20px;

        #user-box {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 300px;
            color: white;
            height: 100%;

            .avatar {
                width: 30px;
                height: 30px;
                border-radius: 15px;
                overflow: hidden;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);

                img {
                    width: 100%;
                    line-height: 0;
                    margin: 0;
                    padding: 0;
                }
            }

            .user-info {
                margin-left: 48px;
                margin-top: 5px;
                height: 100%;
                font-size: 12px;
                .company-name{
                  height: 21px;
                  line-height: 21px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .user-box-l {
                    position: relative;
                    color: #fff;
                    cursor: pointer;

                    .el-dropdown-link {
                      // color: #ccc;
                    }

                    .user-box-ll{
                      // position: relative;
                      height: 21px;
                      color: #fff;
                      display: flex;
                      justify-content: space-between;
                      .user-identity{
                        // position: absolute;
                        // left: 0;
                      }
                      .user-name{
                        text-align: right;
                        display: flex;
                        align-items: center;
                        // position: absolute;
                        // right: 0;
                        .user-name-box{
                          width: 152px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                          font-size: 12px;
                        }
                      }
                    }

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
  .header_modules{
    position: absolute;
    left: 200px;
    color: #fff;
    font-size: 14px;
    top: 16px;
  }
  .blank-line{
    position: absolute;
    left: 185px;
    color: #fff;
    top: 18px;
    height: 16px;
    width: 2px;
    opacity: 0.2;
    background: #fff;
  }
}
</style>
