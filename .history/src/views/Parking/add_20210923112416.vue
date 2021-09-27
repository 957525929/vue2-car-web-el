<template>
  <div class="parking-add">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="停车场名称" prop="parkingName">
        <el-input v-model="form.parkingName"></el-input>
      </el-form-item>
      <el-form-item label="区域" prop="area">
        <CityArea ref="cityArea" :mapLocation="true" :cityAreaValue.sync="form.area" @callback="callbackComponent" />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="form.address"></el-input>
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
        <el-radio-group v-model="form.status" @change="changeData">
          <el-radio v-for="item in status" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="位置">
        <div class="address-map">
          <AMap ref="amap" :options="options_map" @callback="callbackComponent" />
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
import { ParkingAdd, ParkingDetailed, ParkingEdit } from "@/api/parking";

export default {
  // name: "ParkingAdd",
  data() {
    return {
      options_map: {
        mapLoad: true,
      },
      //id
      id: this.$route.query.id,
      button_loading: false,
      status: this.$store.state.config.radio_disabled,
      type: this.$store.state.config.parking_type,
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
  beforeMount() {
    this.getDetailed();
  },
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
          this.id ? this.editParking() : this.addParking();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //新增停车场
    addParking() {
      this.button_loading = true;
      ParkingAdd(this.form)
        .then((response) => {
          this.$message({
            type: "primary",
            message: response.message,
          });
          this.button_loading = false;
          this.reset("form");
        })
        .catch((error) => {
          this.button_loading = false;
        });
    },
    //修改停车场
    editParking() {
      let requestData = JSON.parse(JSON.stringify(this.form));
      requestData.id = this.id;
      this.button_loading = true;
      ParkingEdit(requestData)
        .then((response) => {
          this.$message({
            type: "primary",
            message: response.message,
          });
          this.button_loading = false;
          this.$router.push({
            name: "ParkingIndex",
          });
        })
        .catch((error) => {
          this.button_loading = false;
        });
    },
    //获取详情
    getDetailed() {
      if (!this.id) {
        return false;
      }
      ParkingDetailed({ id: this.id }).then((response) => {
        const data = response.data;
        for (let key in data) {
          //接口请求出来
          if (Object.keys(this.form).includes(key)) {
            this.form[key] = data[key];
          }
        }
        //设置覆盖物
        const splitLnglat = data.lnglat.split(",");
        const lnglat = {
          lng: splitLnglat[0],
          lat: splitLnglat[1],
        };
        this.$refs.amap.setMarker(lnglat);
        console.log(data);
        // 初始化省市区
        this.$refs.cityArea.initDefault(data.region);
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
    mapLoad() {
      this.getDetailed();
    },
    changeData(value) {
      console.log(value);
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
