<template>
  <div class="table-container">
    <el-table
      ref="table"
      class="table"
      v-on="listeners"
      v-bind="$attrs"
      v-loading="loading"
    >
      <slot></slot>
    </el-table>
    <el-pagination
      v-on="$listeners"
      v-bind="$attrs"
      v-if="showPagination"
      :page-sizes="[10, 20, 50, 100]"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'table_pagination',
  computed: {
    listeners() {
      return Object.assign({}, this.$listeners, {
        'current-change'() {},
      });
    },
  },
  props: {
    showPagination: {
      type: Boolean,
      default() {
        return true;
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pagination: {},
    };
  },
  methods: {},
};
</script>

<style lang="less">
.table-container {
  table {
    width: 100% !important;
  }
}
</style>
