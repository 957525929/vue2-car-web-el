<template>
  <div class="parking-add">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="停车场名称" prop="parkingName">
        <el-input v-model="form.parkingName"></el-input>
      </el-form-item>
      <el-form-item label="区域" prop="area">
        <CityArea ref="cityArea" :mapLocation="true" :cityAreaValue.sync="form.area" @callback="callbackComponent" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="item in type" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可停放车辆" prop="carsNumber">
        <el-input v-model.number="form.carsNumber"></el-input>
      </el-form-item>
      <el-form-item label="禁启用" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="item in status" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="位置">
        <div class="address-map">
          <AMap ref="amap" @callback="callbackComponent" />
        </div>
      </el-form-item>
      <el-form-item label="经纬度" prop="lnglat">
        <el-input v-model="form.lnglat"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="onSubmit('form')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// AMAP
import AMap from "../amap";
// 组件
import CityArea from "@c/common/cityArea";
//api
import { ParkingAdd } from "@/api/parking";
export default {
  // name: "ParkingAdd",
  data() {
    return {
      button_loading
      status: [
        { label: "禁用", value: 1 },
        { label: "启用", value: 2 },
      ],
      type: [
        { label: "室内", value: 1 },
        { label: "室外", value: 2 },
      ],
      form: {
        parkingName: "",
        area: "",
        type: "",
        carsNumber: "",
        status: "",
        lnglat: "",
        content: "",
        address: "",
      },
      //表单规则验证
      rules: {
        parkingName: [{ required: true, message: "请输入停车场名称", trigger: "change" }],
        carsNumber: [
          { required: true, message: "数量不能为空", trigger: "change" },
          { type: "number", message: "请输入数字" },
        ],
        area: [{ required: true, message: "请选择省市区", trigger: "change" }],
        lnglat: [{ required: true, message: "经纬度不能为空", trigger: "change" }],
      },
    };
  },
  components: { AMap, CityArea },
  mounted() {},
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    setMapCenter(data) {
      this.$refs.amap.setMapCenter(data.address);
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addParking();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //新增停车场
    addParking() {
      this.button_loading = true;
      ParkingAdd(this.form).then((response) => {
        console.log(response);
        // this.reset("form");
      });
    },
    //重置表单
    reset(formName) {
      this.$refs[formName].resetFields();
      //清除 cityAray 的值
      this.$refs.cityArea.clear();
      //清除地图覆盖物
      this.$refs.amap.clearMarker();
    },
    //获取经纬度
    getLonlat(data) {
      this.form.lnglat = data.lnglat.value;
    },
  },
};
</script>
<style lass="scss" scoped>
.address-map {
  width: 100%;
  height: 500px;
}
</style>
