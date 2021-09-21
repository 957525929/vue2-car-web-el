<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <!-- <el-form-item label="停车场名称">
              <el-input
                v-model="form.parking_name"
                placeholder="审批人"
              ></el-input>
            </el-form-item> -->
            <el-form-item label="区域">
              <CityArea
                ref="cityArea"
                :cityAreaValue.sync="form.area"
                @callback="callbackComponent"
              />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="活动区域">
                <el-option
                  v-for="item in parking_type"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁启用">
              <el-select
                v-model="form.status"
                placeholder="请选择"
                class="width-120"
              >
                <el-option
                  v-for="item in parking_status"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字">
              <el-select
                v-model="search_key"
                placeholder="请选择"
                @change="searchKeySelect"
                class="width-120"
              >
                <el-option label="停车场名称" value="parkingName"></el-option>
                <el-option label="详细区域" value="address"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="keyword"
                placeholder="请输入关键字按Enter搜索"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="search">搜索</el-button>
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
    <TableData ref="table" :config="table_config">
      <!-- 禁启用 -->
      <template v-slot:status="slotData">
        <el-switch
          v-model="slotData.data.status"
          active-value="2"
          inactive-value="1"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>
      <!--查看地图-->
      <template v-slot:lnglat="slotData">
        <el-button type="success" size="mini" @click="showMap(slotData.data)"
          >查看地图</el-button
        >
      </template>
      <!--操作-->
      <template v-slot:operation="slotData">
        <el-button type="danger" size="small" @click="edit(slotData.data.id)"
          >编辑</el-button
        >
        <el-button size="small" @click="delConfirm(slotData.data.id)"
          >删除</el-button
        >
      </template>
    </TableData>

    <MapLocation :flagVisible.sync="map_show" :data="parking_data" />
  </div>
</template>
<script>
// 组件
import CityArea from "@c/common/cityArea";
import MapLocation from "@c/dialog/showMapLocation";
import TableData from "@c/tableData";
// API
import { ParkingDelete } from "@/api/parking";
//common
import { address, parkingType } from "@/utils/common";

let _this;
export default {
  name: "Parking",
  data() {
    _this = this;
    return {
      //表格配置
      table_config: {
        thead: [
          { label: "停车场名称", props: "parkingName" },
          {
            label: "类型",
            prop: "type",
            type: "function",
            callback: (row, prop) => parkingType(row[prop]),
          },
          {
            label: "区域",
            prop: "address",
            type: "function",
            callback: (row, prop) => address(row[prop]),
          },
          { label: "可停放车辆", prop: "carsNumber" },
          { label: "禁启用", prop: "status", type: "slot", slotName: "status" },
          {
            label: "查看位置",
            prop: "lnglat",
            type: "slot",
            slotName: "lnglat",
          },
          { label: "操作", type: "slot", slotName: "operation" },
        ],
        url: "parkingList", // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
      },

      // 请求API的页码
      pageSize: 10,
      pageNumber: 1,
      search_key: "",
      parking_data: {},
      form: {
        parking_name: "",
        area: "",
        type: "",
      },
      keyword: "",
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
      // 禁启用
      parking_status: this.$store.state.config.parking_status,
      // 停车场类型
      parking_type: this.$store.state.config.parking_type,
      map_show: false,
      table_loading: false,
    };
  },

  components: { CityArea, MapLocation, TableData },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    search() {
      const requestData = {
        pageSize: 10,
        pageNumber: 1,
      };
      // 过滤筛选
      const filterData = JSON.parse(JSON.stringify(this.form));
      for (let key in filterData) {
        if (filterData[key]) {
          requestData[key] = filterData[key];
        }
      }
      // 关键字
      if (this.keyword && this.search_key) {
        requestData[this.search_key] = this.keyword;
      }
      console.log(requestData);
      // 调用子组件的方法
      this.$refs.table.requestData(requestData);
    },

    //关键字下拉
    searchKeySelect(val) {
      console.log(val);
    },
    //编辑
    edit(id) {
      this.$router.push({
        name: "ParkingAdd",
        query: {
          id,
        },
      });
    },
    /** 删除 */
    delConfirm(id) {
      this.$confirm("确定删除此信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ParkingDelete({ id }).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
            });
            this.$refs.table.requestData();
          });
        })
        .catch(() => {});
    },
    /** 显示地图 */
    showMap(data) {
      this.map_show = true;
      this.parking_data = data;
    },
  },
  // DOM元素渲染之前（生命周期）
  beforeMount() {
    // this.getParkingList();
  },
  mounted() {},
  filters: {
    //返回文本类型
    getType(value) {
      const data = _this.parking_type.filter((item) => item.value == value);
      if (data && data.length > 0) {
        return data[0].label;
      }
    },
  },
};
</script>
<style lass="scss" scoped></style>
