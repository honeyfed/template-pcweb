<template>
  <div class="wrapper">
    <HainaPageHeader
      :userInfo="userInfo"
      :showUserInfo="!$route.meta.hideUserInfo"
      :logo="whiteLogo"
      @onMenuClicked="handleHeaderMenu"
    ></HainaPageHeader>
    <div class="content">
      <HainaPageSide
        ref="pageSide"
        :navList="sideMenus"
        @menu-click="onMenuClicked"
      ></HainaPageSide>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// import LogoImg from '@/assets/img/haina_logo.png'
import { mapState } from 'vuex';
import HainaPageSide from '@/components/haina_page_side';
import HainaPageHeader from '@/components/haina_page_header';

export default {
  name: 'Layout',
  components: {
    HainaPageSide,
    HainaPageHeader,
  },
  data() {
    return {
      isShow: false,
      communityName: '',
      adminName: '',
      avatarImg: '',
      whiteLogo: this.$flavor.env.whiteLogo,
    };
  },
  computed: {
    ...mapState('userInfo', ['userInfo']),
    ...mapState(['sideMenus']),
  },
  methods: {
    onToggle() {
      this.isShow = !this.isShow;
    },

    async onMenuClicked(data) {
      console.log(
        'onMenuClicked data: ',
        data,
        ' ; data.link: ',
        data.data.link
      );
      if (/^#/.test(data.data.link)) {

        // window.location.href = linkData.JumpURL;
      } else {
        console.log(`route to ${data.data.link}`);
        this.$router.push({
          path: `/myapp${data.data.link}`,
        });
      }
    },

    handleHeaderMenu(command) {
      console.log('handleHeaderMenu: ', command);

      if (command === 'logout') {
        this.$store.dispatch('userInfo/logout').then(() => {
          this.$router.push({ name: 'login' });
        });
      }
    },
  },

  async created() {
    // 派发请求应用列表
    await this.$store.dispatch('getMenus');
    // this.$store.dispatch('getMyAppSideMenus')
  },
};
</script>

<style lang="less" scoped>
@import url('~@/components/global.less');
@headerHeight: 50px;

.el-button {
  border-radius: 0;
}

.wrapper {
  display: block;
}

@sideMenuWidth: 200px;

.content {
  //position: absolute;
  //left: 0;
  // top: @headerHeight;
  // right: 0;
  // bottom: 0;
  height: calc(100vh - @headerHeight);
  /*background: #000;*/
  width: 100%;
  min-width: @min-width-page;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;

  #haina-sidenav {
    &.shrinked + .main {
      left: 56px;
    }
    &.expanded + .main {
      left: 200px;
    }
  }

  .main {
    // width: calc(100vw - 200px);
    background-color: @main-bg-color;
    overflow-y: auto;
    overflow-x: auto;
    z-index: 0;
    transition: left 0.2s linear;
    height: 100%;
  }
}
</style>
