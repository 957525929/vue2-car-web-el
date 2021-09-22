<template>
  <div>
    <!-- 表格数据 -->
    <el-table
      v-loading="loading_data"
      element-loading-text="加载中"
      :data="table_data"
      border
      style="width: 100%"
    >
      <el-table-column
        v-if="table_config.checkbox"
        type="selection"
        width="35"
      ></el-table-column>
      <template v-for="item in this.table_config.thead">
        <el-table-column
          v-if="item.type === 'function'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span
              v-html="item.callback && item.callback(scope.row, item.prop)"
            ></span>
          </template>
        </el-table-column>
        <!-- 插槽slot -->
        <el-table-column
          v-else-if="item.type === 'slot'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
        </el-table-column>
      </template>
    </el-table>
    <el-row class="padding-top-30">
      <el-col :span="4"><div style="padding: 20px;"></div></el-col>
      <el-col :span="20">
        <el-pagination
          v-if="table_config.pagination"
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// API
import { GetTableData } from "@/api/common";
export default {
  name: "TableComponent",
  data() {
    return {
      //加载提示
      loading_data: false,
      table_data: [],
      table_config: {
        thead: [],
        checkbox: true,
        url: "",
        pagination: true,
        data: {},
      },
      // 页码
      total: 0,
      // 当前页码
      currentPage: 1,
    };
  },
  beforeMount() {
    // this.getParkingList();
  },
  methods: {
    initConfig() {
      for (let key in this.config) {
        if (Object.keys(this.table_config).includes(key)) {
          this.table_config[key] = this.config[key];
        }
      }
      //配置完成后开始读取接口数据
      this.loadData();
    },
    loadData() {
      let requestData = {
        url: this.table_config.url,
        data: this.table_config.data,
      };
      this.loading_data = true;
      GetTableData(requestData)
        .then((response) => {
          const data = response.data;
          // 判断数据是否存在
          if (data) {
            this.table_data = data.data;
          }
          this.$nextTick(() => {
            // 考虑到DOM元素渲染完成时候
          });
          this.total = data.total;
          this.loading_data = false;
        })
        .then((error) => {
          this.loading_data = false;
        });
    },
    requestData(params = "") {
      if (params) {
        //处理业务逻辑

        this.table_config.data = params;
      }

      this.loadData();
    },
    /** 页码 */
    handleSizeChange(val) {
      this.table_config.data.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.table_config.data.pageNumber = val;
      this.loadData();
    },
  },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    config: {
      handler(newValue) {
        this.initConfig();
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
