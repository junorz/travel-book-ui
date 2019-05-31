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
        <el-button type="primary">确认</el-button>
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
import { mapState } from "vuex";

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
    openAdmin: function() {}
  }
};
</script>

