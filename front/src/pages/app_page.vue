<template>
  <div id="app-container">
    <iframe
      class="page-container"
      :src="url"
      frameborder="0"
      style="min-width: 923px; width: 100%; height: 100%;position: absolute;left: 0; top: 0; right: 0; bottom: 0;"
    ></iframe>
  </div>
</template>

<script>
import * as api from '@/api'
import ViewTitle from '@/components/viewTitle'
import { mapGetters } from 'vuex'

export default {
  components: {
    ViewTitle
  },

  data () {
    return {
      appName: '',
      customPages: [],
      iframeUrl: 'about:blank'
    }
  },
  mounted () {
    this.getIframeUrl()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getIframeUrl()
    // this.getAppDetail()
  },
  computed: {
    uuid () {
      return this.$route.params.uuid
    },
    url () {
      return this.iframeUrl !== 'about:blank' ? this.iframeUrl : this.homeAddress
    },
    ...mapGetters(['homeAddress'])
  },
  methods: {
    getIframeUrl () {
      let url = this.$route.query.url
      if (url) {
      }
      url ? (this.iframeUrl = url) : ''
    },
    getAppDetail () {
      // homeAddress的计算是异步的
      setTimeout(() => {
        this.iframeUrl = this.homeAddress
      }, 500)
    },
    selectAction (val) {
      console.log('被选中的实例', val)
      // this.iframeSrc = this.customPages[val.index].url
    }
  }
}
</script>

<style lang="less" scoped>
#app-container {
  /deep/ .el-loading-spinner {
    margin-top: 20px !important;
  }
}
.custom-pages {
  position: relative;

  .page-container {
    width: 100%;
    height: 100%;

    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 10px;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #ccc;
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #e0e0e0;
    }
  }
}
</style>
