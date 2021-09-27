<template>
  <el-form ref="form" label-width="120px">
    <el-form-item
      v-for="item in formItem"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
    >
      <!--Input-->
      <el-input
        v-if="item.type === 'Input'"
        v-model="form[item.prop]"
        :placeholder="item.placeholder"
        :style="{ width: item.width }"
        :disabled="item.disabled"
      ></el-input>
      <!--省市区-->
      <slot v-if="item.type === 'Slot'" :name="item.slotName" />
      <el-radio-group v-if="item.type === 'Radio'" v-model="form[item.prop]">
        <el-radio
          v-for="radio in item.options"
          :label="radio.value"
          :key="radio.value"
          >{{ radio.label }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <!--按钮-->
    <el-form-item>
      <el-button
        v-for="item in formHandler"
        :key="item.key"
        :type="item.type"
        @click="item.handler && item.handler()"
        >{{ item.label }}</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
// 省市区
import CityArea from "@c/common/cityArea";
export default {
  name: "Form",
  components: {
    CityArea,
  },
  props: {
    formItem: {
      type: Array,
      default: () => [],
    },
    //按钮
    formHandler: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {},
    };
  },
  methods: {
    initFormData() {
      const formData = {};
      this.formItem.forEach((item) => {
        if (item.prop) {
          formData[item.prop] = item.value || null;
        }
      });
      this.form = formData;
      console.log(this.form);
    },
  },
  watch: {
    formItem: {
      handler(newValue) {
        this.initFormData();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
