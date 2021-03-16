<template>
  <div
    id="haina-sidenav"
    :class="expanded ? 'expanded' : 'shrinked'"
    @mouseleave="onMouseLeaveBody"
  >
    <div v-if="headline" class="headline">{{ headline }}</div>

    <div class="body" @mouseenter="onMouseEnterBody" @scroll="leftScroll">
      <div class="fixed-menu" @scroll="leftScroll">
        <template v-for="(item, index) in navList">
          <div
            class="menu-category"
            v-show="expanded"
            :key="'category' + index"
          >
            {{ item.title }}
          </div>
          <NavList
            :key="index"
            ref="rootRecursiveList"
            :list="item.children"
            :navExpanded="expanded"
            :level="0"
            :activeName="activeName"
            :parentIndex="-1"
            @menu-click="onMenuClicked"
          >
          </NavList>
        </template>
      </div>
    </div>
    <div
      class="hover-menu"
      :class="{ 'hover-menu-active': !expanded && isHover }"
    >
      <div class="menu" @scroll="rightScroll">
        <template v-for="(item, index) in navList">
          <div
            class="menu-category"
            v-show="expanded"
            :key="'category' + index"
          >
            {{ item.title }}
          </div>
          <NavList
            :key="index"
            class="hover-list"
            ref="rootRecursiveList"
            :navExpanded="expanded"
            :hiddenIcon="true"
            :list="item.children"
            :level="0"
            :activeName="activeName"
            :parentIndex="-1"
            @menu-click="onMenuClicked"
          >
          </NavList>
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
import NavList from './nav_list';

export default {
  name: 'HainaPageSide',
  components: {
    NavList,
  },
  props: {
    title: String,
    navList: {
      type: Array,
      default: () => [],
    },
    activeLink: {
      type: String,
      default: '',
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.initActiveNameByUrl();
      },
    },
    navList: {
      immediate: true,
      deep: true,
      handler() {
        this.initActiveNameByUrl();
      },
    },
  },
  data() {
    return {
      headline: this.title,
      expanded: true, // 菜单是否展开
      isHover: false,
      activeName: [],
    };
  },

  methods: {
    onMenuClicked(children, data) {
      console.log('onMenuClicked: ', children, data);
      this.$emit('menu-click', data);
    },

    doExpandShrink() {
      // 1. 收起说有展开的children
      // 2. 改变 this.expanded 的状态

      this.expanded = !this.expanded;

      if (!this.expanded) {
        // 收缩状态，需要高亮 parent icon
      } else {
        // 展开， 需要把 parent icon还原
      }
    },

    onMouseEnterBody() {
      this.isHover = true;
    },

    onMouseLeaveBody(e) {
      if (e.offsetX < 160) {
        // return
      }
      this.isHover = false;
    },

    initActiveNameByUrl(url) {
      // debugger;
      // eslint-disable-next-line no-param-reassign
      url = url || decodeURIComponent(location.href);
      console.log('initActiveNameByUrl: ', url);
      let list = [];
      this.navList.forEach((item) => {
        list = list.concat(item.children);
      });

      function linkParent(node, parent) {
        if (node) {
          // eslint-disable-next-line no-param-reassign
          node.parent = parent;
          if (Array.isArray(node.children) && node.children.length > 0) {
            node.children.forEach((child) => linkParent(child, node));
          }
        }
      }
      list.forEach((item) => linkParent(item, null));

      function markSelectItem(node, names) {
        let hasMatch = false;
        if (node) {
          const nodeUrl = node.url || node.link;

          if (url.includes(node.uuid) || url.includes(nodeUrl)) {
            hasMatch = true;
          }

          if (Array.isArray(node.children) && node.children.length > 0) {
            node.children.forEach((child) => {
              const subAppMatch = markSelectItem(child, names);
              hasMatch = hasMatch || subAppMatch;
            });
          }
        }
        if (hasMatch) {
          // eslint-disable-next-line no-param-reassign
          names[node.name] = true;
        }
        return hasMatch;
      }
      const names = {};
      list.forEach((item) => markSelectItem(item, names));

      const foundLeafNodes = Object.keys(names);

      this.activeName = foundLeafNodes;
    },

    leftScroll(e) {
      clearTimeout(this.leftScrollTimeId);
      if (this.rightScrollFlag) return;
      this.leftScrollFlag = true;
      this.hoverMenuElement.scrollTop = e.target.scrollTop;
      // 滚动结束
      this.leftScrollTimeId = setTimeout(() => {
        this.leftScrollFlag = false;
      }, 200);
    },

    rightScroll(e) {
      console.log('scroll right', e.target.scrollTop, this.rightScrollFlag);
      clearTimeout(this.rightScrollTimeId);
      if (this.leftScrollFlag) return;
      this.rightScrollFlag = true;
      this.fixedMenuElement.scrollTop = e.target.scrollTop;
      this.rightScrollTimeId = setTimeout(() => {
        this.rightScrollFlag = false;
      }, 200);
    },
  },
  beforeRouteUpdate() {
    console.log('route-update');
  },
  mounted() {
    this.$nextTick(() => {
      this.hoverMenuElement = document.querySelector('.hover-menu .menu');
      this.fixedMenuElement = document.querySelector('body .fixed-menu');
    });
  },
};
</script>

<style lang="less">
@menuHeight: 30px;

#haina-sidenav {
  position: relative;
  height: 100%;
  transition: width 0.2s linear;
  float: left;
  background-color: #333;
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
    width: 60px;
    bottom: 60px;
    height: 100%;
    overflow-y: hidden;
    padding-top: 30px;
    background-color: #333;
    z-index: 2;
    .menu-category {
      margin-bottom: 9px;
      padding-left: 25px;
      color: #797979;
    }
  }
  .fixed-menu {
    position: absolute;
    top: 0;
    z-index: 2;
    width: 60px;
    bottom: 60px;
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
    transition: all 0.2s linear;
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
    height: 60px;
    line-height: 60px;
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
          content: '';
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
          background: url('~@/assets/img/icon_sidemenu_shrink.svg');
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
          background: url('~@/assets/img/icon_sidemenu_expand.svg');
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
