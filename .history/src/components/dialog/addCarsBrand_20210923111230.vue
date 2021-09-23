<template>
  <!--dialog 弹窗
    子组件接收父组件的数据，是通过属性接收
  -->
  <el-dialog title="新增车辆品牌" :visible.sync="dialogVisible" class="cars-dialog-center" @close="close" @open="opened" :close-on-click-modal="false">
    <!--内容区-->
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="品牌中文" prop="nameCh">
        <el-input v-model="form.nameCh"></el-input>
      </el-form-item>
      <el-form-item label="品牌英文" prop="nameEn">
        <el-input v-model="form.nameEn"></el-input>
      </el-form-item>
      <el-form-item label="LOGO" prop="imgUrl">
        <el-input v-model="form.imgUrl"></el-input>
      </el-form-item>
      <el-form-item label="禁启用" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="item in radio_disabled" :key="item.id" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
    <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>-->
  </el-dialog>
</template>

<script>
import { BrandLogo, BrandAdd } from "@/api/brand";
export default {
  name: "",
  components: {},
  props: {
    flagVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 弹窗显示/关闭标记
      dialogVisible: false,
      // 表单
      form: {
        nameCh: "",
        nameEn: "",
        imgUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593447137003&di=8e2c8ba51d3018e302c66a0bd851c7e8&imgtype=0&src=http%3A%2F%2Fimg.bqatj.com%2Fimg%2F4e384e839d6b6e96.jpg",
        status: "",
        content: "",
      },
      //状态
      radio_disabled: this.$store.state.config.radio_disabled,
      logo_current: "",
      //logo
      logo: [],
    };
  },
  methods: {
    opened() {
      this.getBrandLogo();
    },
    //获取logo
    getBrandLogo() {
      //存在数据时，不再请求接口
      if (this.logo.length != 0) {
        return false;
      }
      //没有数据时，
      BrandLogo().then((response) => {
        const data = response.data;
        if (data) {
          this.logo = data;
        }
      });
    },
    submit() {
      this.form.imgUrl = this.logo_current;
      BrandAdd(this.form).then((response) => {
        this.$message({
          type: "success",
          message: response.message,
        });
      });
      //重置表单
      this.reset("form");
    },
    //重置表单
    reset(formName) {
      this.$refs[formName].resetFields();
      //重置表单
      this.logo_current = "";
    },
    close() {
      this.$emit("update:flagVisible", false); // {}
    },
  },
  watch: {
    flagVisible: {
      handler(newValue, oldValue) {
        this.dialogVisible = newValue;
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
