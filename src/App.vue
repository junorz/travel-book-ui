<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <div>{{ bookName }}</div>
        </el-col>
        <el-col :span="6">
          <div style="float: right;">
            <el-button plain v-if="viewMode" @click="adminDialogVisible = true">
              <i class="el-icon-setting"></i>&nbsp;管理账本
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>

    <el-dialog title="登陆管理页面" :visible.sync="adminDialogVisible">
      <p>请输入密码</p>
      <el-input v-model="adminPassword" show-password></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="login()">确认</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<style scoped>
.header {
  background-color: #545c64;
  color: #fff;
  line-height: 60px;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import { post } from "./utils/APIUtil";
import Consts from "./context/Consts";
import Types from "./store/types";

export default {
  data: function() {
    return {
      adminDialogVisible: false,
      adminPassword: ""
    };
  },
  computed: {
    ...mapState(["bookName", "viewMode", "currentBookId"])
  },
  methods: {
    login: function() {
      post(
        Consts.URLs.travelbook.login,
        {
          travelBookId: this.currentBookId,
          password: this.adminPassword
        },
        response => {
          console.log(response.headers);
          // 把 JWT token 存入 localStorage
          localStorage.setItem("token", response.data.data);
          // 跳转页面
          this.$router.push({
            name: "admin",
            params: { url: this.$route.params.url }
          });
          this.adminDialogVisible = false;
          this.adminPassword = "";
        },
        err => {
          this.$alert(err.response.data.message, "验证失败");
        }
      );
    }
  },
  ...mapActions([Types.CHANGE_VIEW_MODE])
};
</script>

