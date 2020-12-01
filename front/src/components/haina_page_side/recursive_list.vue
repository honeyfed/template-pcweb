<template>
  <ul class="list" :class="levelClass">
    <li
      class="list-item"
      v-for="(item, index) in list"
      :key="index"
      :class="[activeName.includes(item.name) ? 'active' : '',
                !!item.children === true ? 'has-children' : '',
                item.showChildren ? 'expanded' : 'collapsed',
                level > 0 && !navExpanded ? 'children-item' : '']"
    >
      <a
        @click.prevent.stop="onItemClicked(item.link, index)"
        :style="{ paddingLeft: (level * 16) * ( navExpanded ? 1 : 0 ) + 'px'}"
      >
        <!-- 图标 hiddenIcon为真则隐藏图标 level >= 1时显示默认图标-->
        <template v-if="!hiddenIcon || level > 0">
          <!-- 有子列表 -->
          <template v-if="!!item.children === true">
            <!-- 激活 且 收缩状态，则显示高亮图标，否则普通图标 -->
            <!-- <template v-if="activeName === item.name && !navExpanded">
              <img v-if="item.activeIcon" class="item-preicon" :src="item.activeIcon"/>
              <div v-else class="item-preicon"></div>
            </template>-->
            <!-- <template v-else> -->
            <img
              v-if="item.icon"
              class="item-preicon"
              :class="{ active: activeName.includes(item.name) }"
              :src="item.icon"
            />
            <div v-else class="item-preicon"></div>
            <!-- </template> -->
          </template>
          <!-- 无子列表 -->
          <template v-else>
            <!-- 激活 -->
            <!-- <template v-if="activeName === item.name">
              <img v-if="item.activeIcon" class="item-preicon" :src="item.activeIcon"/>
              <div v-else class="item-preicon"></div>
            </template>-->
            <!-- 未激活 -->
            <!-- <template v-else> -->
            <img
              v-if="item.icon"
              class="item-preicon"
              :class="{ active: activeName.includes(item.name) }"
              :src="item.icon"
            />
            <div v-else class="item-preicon"></div>
            <!-- </template> -->
          </template>
        </template>
        <span :class="{'child-active': activeName.includes(item.name) }">{{item.name}}</span>

        <i
          v-if="!!item.children === true"
          class="tea-icon tea-icon-arrowdown"
          style="position:absolute;right:10px;top:50%;transform:translateY(-50%);"
        ></i>
      </a>

      <RecursiveList
        v-if="!!item.children === true"
        v-show="item.showChildren"
        :list="item.children"
        :level="level + 1"
        :hiddenIcon="true"
        :parentIndex="index"
        :activeIndexPath="activeIndexPath"
        :activeName="activeName"
        :navExpanded="navExpanded"
        @menuClick="onChildrenItemClicked"
      ></RecursiveList>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'RecursiveList',
  props: {
    list: {
      type: Array,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    activeIndexPath: {
      type: Array,
      required: true
    },
    parentIndex: {
      type: Number,
      required: true
    },
    navExpanded: {
      type: Boolean,
      required: true
    },
    hiddenIcon: {
      type: Boolean,
      default: false
    },
    activeName: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {
    levelClass () {
      return 'level-' + this.level
    }
  },

  methods: {
    onItemClicked (link, index) {
      if (!link || !link.trim() || link === '#') {
        // 表示有子菜单，显示隐藏子菜单
        this.showChildren(index)
        return
      }

      // collapse all children list
      this.collapseAllChildren()
      this.jumpLink(link, index) // 跳转
    },

    showChildren (index) {
      let item = this.list[index]
      item.showChildren = !item.showChildren
      this.list.splice(index, 1, item)
    },

    collapseAllChildren () {
      this.list.forEach((menu, index) => {
        if (menu.showChildren) {
          menu.showChildren = false
          this.list.splice(index, 1, menu)
        }
      })
    },

    jumpLink (link, index) {
      let indexPath = this.level === 0 ? [index] : [this.parentIndex, index]
      let emitData = { data: this.list[index], indexPath: indexPath }
      this.$emit('menuClick', this.list, emitData)
    },

    onChildrenItemClicked (list, data) {
      let currentIndex = data.indexPath[0]
      if (this.level > 0) {
        data.indexPath.splice(0, 0, this.parentIndex)
      }
      this.$emit('menuClick', this.list, data)
    }
  }
}
</script>

<style lang="less" scoped>
@itemHeight: 35px;
@itemPaddingVertical: 6px;
@itemFontSize: 13px;
@itemColor: #bbb;
img.path {
  fill: red;
}
.list {
  margin-bottom: 35px;
  &:last-child {
    margin-bottom: 0;
  }
  .list-item {
    position: relative;
    display: inline-block;
    width: 100%;
    height: auto;
    margin: 0;
    color: #bbb;
    font-size: 13px;

    &.expanded {
      // background: #262626;
    }

    > a {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: @itemHeight;

      // padding: @itemPaddingVertical 0;
      line-height: 35px;
      box-sizing: border-box;

      color: @itemColor;
      font-size: @itemFontSize;
      text-decoration: none;
      font-weight: 700;

      &:hover {
        background-color: #444;
      }
      .item-preicon {
        position: relative;
        display: inline-block;
        max-height: 18px;
        max-width: 18px;
        margin: 0;
        padding: 0;
        line-height: 0;
        margin-left: 22px;
        // vertical-align: middle;
        // margin-top: (@itemHeight - 2 * @itemPaddingVertical) / 2;
        transform: translateY(-1px);
        user-select: none;
        // vertical-align: middle;
        &.active {
          filter: invert(33%) sepia(72%) saturate(4663%) hue-rotate(206deg)
            brightness(100%) contrast(109%);
          // color: #fff;
        }
        &::before {
          position: absolute;
          right: 0;
          top: 0;
          display: block;
          width: 3px;
          height: 3px;
          content: "";
          border-radius: 10px;
          background: #666;
        }
      }

      span {
        display: inline-block;
        width: auto;
        // height: @itemHeight - 2 * @itemPaddingVertical;
        // line-height: @itemHeight - 2 * @itemPaddingVertical;
        margin-left: 10px;
        color: rgba(184, 184, 184, 1);
        font-size: 13px;
        font-weight: 500;
        // vertical-align: middle;

        // vertical-align: top;
      }
      // 子菜单激活状态
      .child-active {
        color: #fff !important;
      }
    }

    // 有子菜单状态
    &.has-children {
      > .list {
        span {
          color: rgba(184, 184, 184, 0.66);
          font-weight: 12px;
          font-weight: 300;
        }
      }
      > a {
        & + ul {
          position: relative;
          overflow: hidden;
        }
      }

      &.expanded {
        > a {
          &::after {
            transform: translateY(-50%) rotate(90deg);
          }
        }
      }

      &.collapsed {
        > a {
          &::after {
            transform: translateY(-50%) rotate(-90deg);
          }
        }
      }
    } // &.has-children end
  }
}
</style>
