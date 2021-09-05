<template>
  <div class="parking-add">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="停车场名称" prop="parkingName">
        <el-input v-model="form.parkingName"></el-input>
      </el-form-item>
      <el-form-item label="区域">
        <CityArea
          :mapLocation="true"
          :cityAreaValue.sync="form.area"
          @callback="callbackComponent"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio label="1">室内</el-radio>
          <el-radio label="2">室外</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可停放车辆">
        <el-input v-model="form.carsNumber"></el-input>
      </el-form-item>
      <el-form-item label="禁启用">
        <el-radio-group v-model="form.status">
          <el-radio label="1">禁用</el-radio>
          <el-radio label="2">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="位置">
        <div class="address-map">
          <AMap ref="amap" @callback="callbackComponent" />
        </div>
      </el-form-item>
      <el-form-item label="经纬度">
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
export default {
  name: "ParkingAdd",
  data() {
    return {
      form: {
        parkingName: "",
        area: "",
        type: "",
        carsNumber: "",
        status: "",
        lnglat: "",
        content: "",
      },
      //表单规则验证
      rules: {
        parkingName: [
          { required: true, message: "请输入停车场名称", trigger: "change" },
        ],
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
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
