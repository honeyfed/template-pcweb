<template>
    <div>
        <div class="header" v-clickoutside="closeAllMenu">
            <div class="title" :class="{'title-line': menuData &&menuData.length > 0}">南浦仓智慧园区管理系统</div>
            <div class="menu-list">
                <ul>
                    <li v-for="(val,index) in menuData" :key="index" @click="!val.subMenu &&jumpToPage(index)">
                        <a @click="showSubTitle(index)" :class="{'current': val.current === true}">{{val.name}}<i class="caret" v-if="val.subMenu && val.subMenu.length > 0 " ></i></a>
                        <ul v-if="isShowSub[index]" class="sub-menu">
                            <li v-for="(list,i) in val.subMenu" :key="i" @click="jumpToSubPage(index,i)">
                                <a :class="{'current': list.current === true}">{{list.name}}</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="log-out" v-if="footerList&&userName">
                <div @click="()=>{this.showRight = !this.showRight}">{{userName}}<i class="caret"></i></div>
                <ul class="sub-menu" v-if="showRight">
                    <li v-for="(val,index) in footerList" :key="index" @click="val.callBack()">
                        <a>{{val.name}}</a>
                    </li>
                    <li @click="logout">
                        <a>退出</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="uw-view-title" v-if="showTitle && (currentTitle || specialTitle)">
            <h2>{{specialTitle ? specialTitle : currentTitle}}</h2>
        </div>
    </div>
</template>

<script>
import Clickoutside from '../../static/js/utils/clickoutside'
import { publicApi } from '../api/index'
export default {
  name: 'header-loyout',
  props: {
    menuList: {
      type: Array,
      default: null
    },
    userName: {
      type: String,
      default: ''
    },
    footerList: {
      type: Array,
      default: null
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    specialTitle: {
      type: String,
      default: ''
    },
    subMenuIndex: {
      type: String,
      default: '1'
    }
  },
  directives: { Clickoutside },
  data () {
    return {
      isShowSub: [],
      showRight: false,
      menuData: [],
      currentTitle: '',
      pathArr: ['/enterprise-list']
    }
  },
  created () {},
  watch: {
    $route: function () {
      const path = this.$route.path
      console.log(this.menuData)
      let current = -1
      this.menuData.map((val, index) => {
        if (val.path === path) {
          current = index
          val.current = true
        } else {
          val.current = false
        }
        return val
      })
      if (current > -1) {
        this.setCurrentTab(current)
        if (current === +this.subMenuIndex) {
          this.setSubTab(current, this.$route.query.appId)
        }
      } else {
        if (path === '/enterprise-list') {
          this.currentTitle = '切换企业'
        } else {
          this.currentTitle = ''
          if (this.menuData.length > 0 && path !== '/no-authority') {
            this.currentTitle = ''
            this.$router.replace({ path: '/no-authority' })
          }
        }
      }
      this.closeAllMenu()
    },
    menuList: function (newVal, oldVal) {
      let path = this.$route.path
      let current = -1
      this.menuData = this.menuList.map((val, index) => {
        this.isShowSub.push(false)
        if (val.path == path) {
          val.current = true
          current = index
          this.currentTitle = val.name
        } else {
          val.current = false
        }
        return {
          ...val
        }
      })
      if (current === -1) {
        console.log(2)
        if (this.pathArr.indexOf(path) <= -1 && path !== '/no-authority') {
          this.currentTitle = ''
          this.$router.replace({ path: '/no-authority' })
        }
      }
    }
  },
  methods: {
    showSubTitle (index) {
      this.isShowSub[index] = !this.isShowSub[index]
      this.isShowSub = [...this.isShowSub]
    },
    closeAllMenu () {
      this.isShowSub = this.isShowSub.map(() => {
        return false
      })
      this.isShowSub = [...this.isShowSub]
      this.showRight = false
    },
    logout () {
      console.log('我要退出！')
      publicApi.logOut().then(res => {
        console.log(res)
        window.location.href = window.systemUrl
      })
    },
    jumpToPage (index) {
      let path = this.menuData[index].path
      this.$router.push({ path: path })
    },
    setCurrentTab (index) {
      this.menuData = this.menuData.map(val => {
        val.current = false
        if (val.subMenu) {
          val.subMenu = val.subMenu.map(value => {
            value.current = false
            return {
              ...value
            }
          })
        }
        return {
          ...val
        }
      })
      this.currentTitle = this.menuData[index].name
      this.menuData[index].current = true
    },
    jumpToSubPage (i, index) {
      let menu = this.menuData[i].subMenu[index]
      this.$router.push({ path: this.menuData[i].path, query: {appId: menu.appId}})
    },
    setSubTab (i, appId) {
      this.menuData[i].subMenu = this.menuData[i].subMenu.map(val => {
        val.current = false
        if (val.appId === appId) {
          val.current = true
          this.currentTitle = val.name
        }
        return {
          ...val
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
	@import "common";
	.header{
		height: 50px;
		background: @background-color;
		color: @header-color;
		padding-left: 20px;
		display: table;
		box-sizing: border-box;
		width: 100%;
		font-size: @font-size-h1;
		font-family: @font-family;
		.title{
			width: 220px;
			display: table-cell;
			vertical-align: middle;
			padding-left: 60px;
			font-size: inherit;
			position: relative;
		}
    .title-line{
      &:after{
        content: '';
        position: absolute;
        right: 0;
        top: 19px;
        height: 14px;
        width: 1px;
        background-color:  @header-color;
      }
    }
		.menu-list{
			display: table-cell;
			vertical-align: top;
			font-size: inherit;
		}
		ul{
			height: 50px;
			background-color: @background-color;
			margin: 0;
			padding: 0 0 0 20px;
			display: table;
			box-sizing: border-box;
			width: 100%;
			font-size: inherit;
			li{
				display: inline-block;
				line-height: 49px;
				color: @header-color;
				vertical-align: top;
				cursor: pointer;
				font-size: inherit;
				position: relative;
				a{
					display: inline-block;
					padding: 0 20px;
					font-size: inherit;
					width: 100%;
          color: #fff;
				}
				a:hover{
					color: @main-color;
					i{
						border-color: @main-color transparent transparent;/*灰 透明 透明 */
					}
				}
				.sub-menu{
					position: absolute;
					z-index: 8;
					top: 49px;
					right: 0;
					width: 110%;
					padding: 0px;
					background-color: @background-color;
					box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
					li{
						width: 100%;
						a{
							padding: 0;
							text-align: center;
							font-size: @font-size-h2;
						}
					}
				}
			}
		}
		.log-out{
			position: absolute;
			right: 40px;
			text-align: center;
			width: 160px;
			line-height: 50px;
			cursor: pointer;
			z-index: 8;
			ul{
				padding: 0;
				li{
					text-align: left;
				}
			}
			&:hover{
				color: @main-color;
				i{
					border-color: @main-color transparent transparent;/*灰 透明 透明 */
				}
			}
		}
		.caret{
			position: absolute;
			right: 0;
			top: 23px;
			width:0;
			height:0;
			border-width:5px 5px 0;
			border-style:solid;
			border-color:#fff transparent transparent;/*灰 透明 透明 */
			&:hover{
				color: @main-color;
			}
		}
		.current{
			color: @main-color;
			i{
				border-color: @main-color transparent transparent;/*灰 透明 透明 */
			}
		}
	}
    .uw-view-title{
        padding: 10px 20px;
        background-color: #fff;
        height: auto;
        line-height: inherit;
        min-height: inherit;
        position: relative;
        border-bottom: 1px solid #ddd;
        h2{
            display: inline-block;
            vertical-align: middle;
            margin: 0;
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            font-weight: 700;
            max-width: 50%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
</style>
