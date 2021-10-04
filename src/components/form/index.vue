<template>
  <el-form ref="form" :model="formData" :label-width="labelWidth">
    <el-form-item
      v-for="item in formItem"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :rules="item.rules"
    >
      <!--Input-->
      <el-input
        v-if="item.type === 'Input'"
        v-model.trim="formData[item.prop]"
        :placeholder="item.placeholder"
        :style="{ width: item.width }"
        :disabled="item.disabled"
      ></el-input>
      <!--省市区-->
      <slot v-if="item.type === 'Slot'" :name="item.slotName" />
      <el-radio-group
        v-if="item.type === 'Radio'"
        v-model="formData[item.prop]"
      >
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
    formData: {
      type: Object,
      default: () => [],
    },
    //按钮
    formHandler: {
      type: Array,
      default: () => [],
    },
    labelWidth: {
      type: String,
      default: "120px",
    },
  },
  data() {
    return {
      //是否存在必填规则
      type_msg: {
        Input: "请输入",
        Radio: "请选择",
      },
    };
  },
  methods: {
    initFormData() {
      this.formItem.forEach((item) => {
        //rules规则
        if (item.required) {
          this.rules(item);
        }
        //自定义规则
        if (item.validator) {
          item.rules = item.validator;
        }
      });
    },
    rules(item) {
      // console.log(item);

      const requestRules = [
        {
          required: true,
          message:
            item.requiredMsg || `${this.type_msg[item.type]}${item.label}`,
          trigger: "change",
        },
      ];
      //其他的rules的规则
      if (item.rules && item.rules.length > 0) {
        item.rules = requestRules.concat(item.rules);
      } else {
        item.rules = requestRules;
      }
      console.log(item.rules);
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
