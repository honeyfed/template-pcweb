<template>
  <div class="view-title">
    <div class="header">
      <div class="header-left">
        <b class="goback_button" v-if="goBack" @click="handelGoBack"></b>
        <h2>{{ title }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'viewTitle',
  data() {
    return {};
  },
  components: {},
  props: {
    title: String,
    goBack: Boolean,
  },
  methods: {
    handelGoBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
@import url('~@/components/global.less');
.view-title {
  position: relative;
  height: auto;
  padding: 10px 20px 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  min-height: inherit;
  line-height: inherit;

  .header {
    padding-bottom: 10px;
    .goback_button {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      width: 30px;
      background: url('~@/assets/icon_goback.svg') no-repeat center center;
    }
    h2 {
      display: inline-block;
      margin-right: 20px;
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
}
</style>
