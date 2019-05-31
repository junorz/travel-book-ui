<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <div>{{ bookName }}</div>
        </el-col>
        <el-col :span="6">
          <div style="float: right;">
            <el-button plain v-if="viewMode">
              <i class="el-icon-setting"></i>&nbsp;管理账本
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
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
  computed: {
    ...mapState(["bookName", "viewMode"])
  }
};
</script>

