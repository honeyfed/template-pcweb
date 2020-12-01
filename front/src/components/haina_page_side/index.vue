<template>
  <div id="haina-sidenav" :class="expanded ? 'expanded' : 'shrinked'" @mouseleave="onMouseLeaveBody" >
    <div v-if="headline" class="headline">{{headline}}</div>

    <div class="body" @mouseenter="onMouseEnterBody" @scroll="leftScroll" >
     <div class="fixed-menu" @scroll="leftScroll">
        <template v-for="(item, index) in navList">
          <div class="menu-category" v-show="expanded" :key="'category' + index">{{ item.title }}</div>
          <RecursiveList
            :key="index"
            ref="rootRecursiveList"
            :list="item.children"
            :navExpanded="expanded"
            :level="0"
            :activeIndexPath="activeIndexPath"
            :activeName="activeName"
            :parentIndex="-1"
            @menuClick="onMenuClicked">
          </RecursiveList>
        </template>
     </div>
    </div>
    <div class="hover-menu" :class="{'hover-menu-active': !expanded && isHover }">
      <div class="menu" @scroll="rightScroll">
        <template v-for="(item, index) in navList">
          <div class="menu-category" v-show="expanded" :key="'category' + index">{{ item.title }}</div>
          <RecursiveList
            :key="index"
            class="hover-list"
            ref="rootRecursiveList"
            :navExpanded="expanded"
            :hiddenIcon="true"
            :list="item.children"
            :level="0"
            :activeIndexPath="activeIndexPath"
            :activeName="activeName"
            :parentIndex="-1"
            @menuClick="onMenuClicked">
          </RecursiveList>
        </template>
      </div>
      <div class="palceholder"></div>
    </div>
    <div class="footer">
      <i class="expand-shrink" @click="doExpandShrink"></i>
    </div>
  </div>
</template>

<script>
import RecursiveList from './recursive_list'

export default {
  name: 'HainaPageSide',
  components: {
    RecursiveList
  },
  props: {
    title: String,
    navList: {
      type: Array,
      default: () => [] // [{name: 'xxx', link: '/xxx', children: [{name: 'yyy', link: '/yyy'}]}, {}]
    }
  },
  data () {
    return {
      activeIndexPath: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      headline: this.title,
      expanded: true, // 菜单是否展开
      activeItemUpdated: false,
      isHover: false,
      activeName: []
    }
  },

  watch: {
    navList: {
      deep: true,
      // immediate: true,
      handler (val, oldVal) {
        // 初始化 activeIndex
        if (this.activeItemUpdated) {
          return
        }
        // init activeName
        if (val) {
          let home = val[0] && val[0].children[0]
          home = home || {}
          let url = location.pathname ? decodeURIComponent(location.pathname) : home.link
          console.log('menus change', val, oldVal, home, url)
          this.initActiveNameByUrl(url)
        }
        this.udpateActiveItem()
        this.activeItemUpdated = true
      }
    }
  },

  methods: {
    onMenuClicked (children, data) {
      console.log('onMenuClicked: ', children, data)
      this.updateActiveNames(children, data.indexPath)
      this.updateActiveIndexPath(data.indexPath)
      this.$emit('menuClick', data)
    },

    doExpandShrink () {
      // 1. 收起说有展开的children
      // 2. 改变 this.expanded 的状态
      // this.$refs.rootRecursiveList.collapseAllChildren()
      this.expanded = !this.expanded

      if (!this.expanded) { // 收缩状态，需要高亮 parent icon

      } else { // 展开， 需要把 parent icon还原

      }
    },

    onMouseEnterBody () {
      this.isHover = true
      // let hainaSideNav = document.getElementById('haina-sidenav')
      // if (hainaSideNav.classList.contains('shrinked')) {
      //   hainaSideNav.classList.add('shrinked-hover')
      // }
    },

    onMouseLeaveBody (e) {
      if (e.offsetX < 160) {
        // return
      }
      this.isHover = false
      // let hainaSideNav = document.getElementById('haina-sidenav')
      // if (hainaSideNav.classList.contains('shrinked')) {
      //   hainaSideNav.classList.remove('shrinked-hover')
      //   this.$refs.rootRecursiveList.collapseAllChildren()
      // }
    },
    // 更新高亮name数组
    updateActiveNames (children, path) {
      // 重置
      this.activeName.length = 0
      let level = 0
      let p = children[path[level]]
      this.activeName.push(p.name)
      while (p.children && level < path.length) {
        level++
        p = p.children[path[level]]
        this.activeName.push(p.name)
      }
    },
    // 更新side menu, 高亮图标
    udpateActiveItem () {
      let pathWithQuery = decodeURIComponent(location.href.split(location.origin)[1])
      let queue = []
      let result = null
      console.log('navList: ', this.navList)
      queue.push({ level: 0, indexPath: [], list: this.navList || [] })

      while (queue.length > 0) {
        if (result) {
          break
        }

        let obj = queue.shift()
        let list = obj.list
        for (let index = 0; index < list.length; index++) {
          let item = list[index]
          if (item.children && item.children.length > 0) {
            let indexPath = obj.indexPath.slice(0).concat([index])
            queue.push({ level: item.level + 1, indexPath: indexPath, list: item.children })
          }
          if (item.link && item.link.indexOf(pathWithQuery) > -1) { // 找到值
            result = obj.indexPath.concat([index])
          }
        } // for
      } // while

      result = result || [0]
      this.updateActiveIndexPath(result)
    },
    initActiveNameByUrl (url) {
      this.activeName.length = 0
      console.log('initActiveNameByUrl 111: ', url)
      let list = []
      for (let item of this.navList) {
        list = [...list, ...item.children]
      }
      console.log('traverse', list)
      const that = this
      const traverse = (nodes) => {
        for (let item of nodes) {
          if (url && (url.includes(item.uuid) || url.includes(item.link))) {
            that.activeName.push(item.name)
            if (item.children) traverse(item.children)
            // break
          }
        }
      }
      traverse(list)
    },
    updateActiveIndexPath (indexPath) {
      indexPath.forEach((menuIndex, level) => {
        this.activeIndexPath.splice(level, 1, menuIndex)
      })
      for (let i = indexPath.length; i < this.activeIndexPath.length; i++) {
        this.activeIndexPath.splice(i, 1, -1)
      }
    },
    leftScroll (e) {
      clearTimeout(this.leftScrollTimeId)
      if (this.rightScrollFlag) return
      this.leftScrollFlag = true
      this.hoverMenuElement.scrollTop = e.target.scrollTop
      // 滚动结束
      this.leftScrollTimeId = setTimeout(() => {
        this.leftScrollFlag = false
      }, 200)
    },

    rightScroll (e) {
      console.log('scroll right', e.target.scrollTop, this.rightScrollFlag)
      clearTimeout(this.rightScrollTimeId)
      if (this.leftScrollFlag) return
      this.rightScrollFlag = true
      this.fixedMenuElement.scrollTop = e.target.scrollTop
      this.rightScrollTimeId = setTimeout(() => {
        this.rightScrollFlag = false
      }, 200)
    }
  },
  beforeRouteUpdate () {
    console.log('route-update')
  },
  mounted () {
    window.onpopstate = () => { console.log('popstate') }
    this.$nextTick(() => {
      this.hoverMenuElement = document.querySelector('.hover-menu .menu')
      this.fixedMenuElement = document.querySelector('body .fixed-menu')
    })
  }
}
</script>

<style lang="less">
  @menuHeight: 30px;

  #haina-sidenav {
    position: relative;
    height: 100%;
    // overflow-y: auto;
    // overflow-x: hidden;
    // overflow: hidden;
    transition: width .2s linear;
    float: left;

    background-color: #333;
    // box-sizing: border-box;
    // border-top: 1px solid #262626;

    z-index: 1;

    .headline {
      width: 100%;
      height: 50px;
      margin: 0;
      padding: 0 20px;
      line-height: 50px;
      font-size: 16px;
      color: #fff;
      text-align: left;

      & + .body {
        top: 50px;
      }
    }

    .body {
      position: absolute;
      top: 0;
      width:60px;
      bottom:60px;
      height: 100%;
      overflow-y: hidden;
      padding-top: 30px;
      background-color: #333;
      z-index: 2;
      .menu-category {
        margin-bottom: 9px;
        padding-left: 25px;
        color:  #797979;
      }
    }
    .fixed-menu {
      position: absolute;
       top: 0;
       z-index: 2;
      width:60px;
      bottom:60px;
      overflow-y: auto;
      padding-top: 30px;
      & /deep/ .children-item {
         .item-preicon {
           visibility: hidden;
         }
      }
    }
    .hover-menu {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 160px;
        // height: 100%;
        transition: all .2s linear;
        transform: translateX(-160px);
        z-index: 1;
        background: black;
        & .menu {
          position: absolute;
          top: 0;
          bottom: 60px;
          width: 100%;
          padding-top: 30px;
          overflow-y: auto;
        }
        & /deep/ .list-item {
          span {
            margin-left: 20px;
          }
        }
        & /deep/ .children-item {
          a {
            .item-preicon {
              margin-left: 0;
            }
          }
      }
    }
    .hover-menu-active {
       transform: translateX(60px);
    }
    .footer {
      position: absolute;
      width: 100%;
      height:60px;
      line-height:60px;
      z-index: 2;
      background-color: #333;
      bottom: 0;
      border-top: 1px solid #262626;
      user-select: none;
      i {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 36px;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        cursor: pointer;

        &.expand-shrink {
          &::after {
            content: "";
            display: block;
            width: 16px;
            height: 16px;
            margin: 10px 0 0 10px;
          }
        }
      }
    }

    // 展开状态下的特殊样式
    &.expanded {
      width: 200px;
      .body {
        .fixed-menu {
          width: 100%;
          background-color: #333;
        }
        width: 100%;
        overflow-y: auto;

        .list-item {
          span {
            display: inline-block;
          }
          i {
            display: inline-block;
          }
        }
      }

      .footer {
        .expand-shrink {
          &::after {
            background: url("~@/assets/img/icon_sidemenu_shrink.svg");
          }
        }
      }
    }

    // 收缩状态下的特殊样式
    &.shrinked {
      width: 60px;
      //

      .body {
        overflow: hidden;

        .list-item {
          span {
            display: none;
          }
          i {
            display: none;
          }
        }
      }

      .footer {
        .expand-shrink {
          &::after {
            background: url("~@/assets/img/icon_sidemenu_expand.svg");
          }
        }
      }
    }

    &.shrinked-hover {
      width: 200px;
      .body {
        width: 200px;
        overflow-y: auto;

        .list-item {
          span {
            display: inline-block;
          }
          i {
            display: inline-block;
          }
        }
      }
    }
  }

</style>
