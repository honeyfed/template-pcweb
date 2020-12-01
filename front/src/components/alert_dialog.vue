<template>
  <el-dialog title="提示" :visible.sync="alertVisible" width="30%" :before-close="hideAlert">
    <p class="certified alert">子账号分配成功，短信已下发至管理员手机，请提醒其注意查收</p>
    <p class="tips">注:弹窗3s后消失</p>
  </el-dialog>
</template>

<script>
export default {
  props: ['alertVisible', 'hideAlert']
}
</script>

<style lang="less" scoped>
@import url("~@/components/global");
.certified.alert {
  background: url("~@/assets/img/icon/tencentcloud/icon-success-32.svg")
    no-repeat left 3px;
  background-size: 15px;
  padding-left: 20px;
  margin: 0;
}
.tips {
  color: @state-danger-color;
  text-align: right;
}
</style>

<style lang="less">
@import url("~@/components/global.less");
.el-dialog__body {
  padding: 10px 20px;
}
</style>
