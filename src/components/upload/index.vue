<template>
  <el-upload
    class="avatar-uploader"
    action="https://up-z2.qiniup.com"
    :data="uploadData"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { GetQiniuToken } from "@/api/common";
export default {
  name: "",
  components: {},
  data() {
    return {
      imageUrl: "",
      uploadData: {},
    };
  },
  beforeMount() {
    this.getQiniuToken();
  },
  methods: {
    getQiniuToken() {
      // 在工作中，
      const requestData = {
        ak: "tN2O3N5OIIF-NIFRU6t14RyXaN2IsMGYG118CH2R",
        sk: "LPOx7PjEP5lNhLFw_tmGj6DV5DzDhb0JO9ZgwNZS",
        buckety: "sfsda",
      };
      GetQiniuToken(requestData).then((response) => {
        const data = response.data;
        if (data.token) {
          this.uploadData.token = data.token;
        }
        console.log(this.uploadData.token);
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = `http://r1hhmhfoq.hn-bkt.clouddn.com/${res.key}`;
      this.$emit("update:value", this.imageUrl);
      //   this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      let fileName = file.name;
      let key = encodeURI(fileName);
      this.uploadData.key = key;
      return isJPG && isLt2M;
    },
  },
  props: {
    // 接收到的数据属于“静态数据”，是单向数据，不能反向修改
    imgUrl: {
      type: String,
      default: "",
    },
  },
  watch: {
    imgUrl: {
      handler(newValue) {
        this.imageUrl = newValue;
      },
    },
  },
};
</script>
<style lang="scss"></style>
