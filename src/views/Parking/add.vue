<template>
  <div class="parking-add">
    <VueForm :formItem="form_item" :formHandler="form_handler">
      <template v-slot:city>
        <CityArea
          ref="cityArea"
          :mapLocation="true"
          :cityAreaValue.sync="form.area"
          @callback="callbackComponent"
        />
      </template>
      <template v-slot:amap>
        <div class="address-map">
          <AMap
            ref="amap"
            :options="options_map"
            @callback="callbackComponent"
          />
        </div>
      </template>
    </VueForm>
    <!-- <el-form ref="form" :model="form" :rules="rules" label-width="120px"> -->
    <!-- </el-form> -->
  </div>
</template>
<script>
// AMAP
import AMap from "../amap";
// 组件
import CityArea from "@c/common/cityArea";
import VueForm from "@c/form";
//api
import { ParkingAdd, ParkingDetailed, ParkingEdit } from "@/api/parking";

export default {
  name: "ParkingAdd",
  data() {
    return {
      //表单配置
      form_item: [
        {
          type: "Input",
          label: "停车场名称",
          placeholder: "请输入停车场名称",
          prop: "parkingName",
          width: "200px",
        },
        {
          type: "Slot",
          slotName: "city",
          label: "区域",
          prop: "area",
          value: [],
        },
        {
          type: "Input",
          label: "详细地址",
          placeholder: "请输入详细地址",
          prop: "address",
        },
        {
          type: "Radio",
          label: "类型",
          prop: "type",
          options: this.$store.state.config.parking_type,
        },
        {
          type: "Input",
          label: "可停放车辆",
          placeholder: "请输入数字类型",
          prop: "carsNumber",
        },
        {
          type: "Radio",
          label: "禁启用",
          prop: "status",
          options: this.$store.state.config.radio_disabled,
        },
        {
          type: "Slot",
          label: "位置",
          slotName: "amap",
        },
        {
          type: "Input",
          label: "经纬度",
          prop: "lnglat",
          disabled: true,
        },
      ],
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.aaa(),
        },
        { label: "重置", key: "reset" },
      ],
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
        parkingName: [
          { required: true, message: "请输入停车场名称", trigger: "change" },
        ],
        carsNumber: [
          { required: true, message: "数量不能为空", trigger: "change" },
          { type: "number", message: "请输入数字" },
        ],
        area: [{ required: true, message: "请选择省市区", trigger: "change" }],
        lnglat: [
          { required: true, message: "经纬度不能为空", trigger: "change" },
        ],
      },
    };
  },
  components: { AMap, CityArea, VueForm },
  beforeMount() {
    this.getDetailed();
  },
  mounted() {},
  methods: {
    aaa() {
      alert("1111");
    },
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
