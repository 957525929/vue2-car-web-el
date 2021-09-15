<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="停车场名称">
              <el-input v-model="form.parking_name" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="区域">
              <el-cascader v-model="form.area" :options="options" :props="{ expandTrigger: 'hover' }"></el-cascader>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="活动区域">
                <el-option label="室内" value="shanghai"></el-option>
                <el-option label="室外" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="danger">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div class="pull-right">
            <router-link to="/parkingAdd">
              <el-button type="danger">新增停车场</el-button>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格数据 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="name" label="停车场名称"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="area" label="区域"></el-table-column>
      <el-table-column prop="carsNumber" label="可停放车辆"></el-table-column>
      <el-table-column prop="disabled" label="禁启用">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.disabled" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="查看位置"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small">编辑</el-button>
          <el-button size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
// API
import { ParkingList } from "@/api/parking";

export default {
  name: "Parking",
  data() {
    return {
      // 页码
      total: 0,
      // 当前页码
      currentPage: 1,
      // 请求API的页码
      pageSize: 10,
      pageNumber: 1,
      form: {
        parking_name: "",
        area: "",
        type: "",
      },
      options: [
        {
          value: 1111,
          label: "广东省",
          children: [
            {
              value: 1111,
              label: "深圳市",
            },
            {
              value: 1111,
              label: "广州市",
            },
          ],
        },
        {
          value: 1111,
          label: "广西省",
          children: [
            {
              value: 1111,
              label: "南宁市",
              children: [
                {
                  value: "2222",
                  label: "八步镇",
                },
              ],
            },
          ],
        },
      ],
      tableData: [],
    };
  },
  methods: {
    getParkingList() {
      const requestData = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };
      ParkingList(requestData).then((response) => {
        const data = response.data;
        // 判断数据是否存在
        if (data) {
          this.tableData = data.data;
        }
        // 页码
        if (data.total) {
          this.total = data.total;
        }
        console.log(response);
      });
      console.log("11111");
    },
  },
  // DOM元素渲染之前（生命周期）
  beforeMount() {
    this.getParkingList();
  },
  mounted() {},
};
</script>
<style lass="scss" scoped></style>
