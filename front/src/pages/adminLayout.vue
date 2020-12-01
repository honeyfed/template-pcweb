<template>
  <div class="content-page">
    <router-view></router-view>
  </div>
</template>

<script>
import * as api from '@/api'

export default {
  name: 'AdminLayout',
  data () {
    return {
      appList: []
    }
  },
  mounted () {
    api.getAppOpenList().then(result => {
      if (result && Array.isArray(result.List)) {
        // 将获取到的应用列表放进vuex中
        this.$store.dispatch('setMyAppSideMenus', result.List)
        // this.appList = []
        // result.List.forEach(app => {
        //   this.appList.push({
        //     name: app.name,
        //     uuid: app.uuid
        //   })
        // })
        console.log('结果', result.List)
      }
    }).catch(err => {
      this.$message.error(err.message)
    })
  },
  methods: {}
}
</script>

<style lang="less" scoped>
  .side-bar {
    position: fixed;
    left: 0;
    top: 88px;
    bottom: 0;
    width: 200px;
    border-right: 1px solid #e6e6e6;
    z-index: 999;
  }

  .content-page {

    position: fixed;
    left: 200px;
    top: 88px;
    right: 0;
    bottom: 0;
    padding: 20px;

  }
</style>

<style lang="less">
  .el-menu {
    border-right: none;
  }

  .el-menu-item {
    //text-align: center;
  }
</style>
