<template>
  <div v-loading="loading" :element-loading-text="loadingText">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'travelBook', params: {'url': this.pureUrl}}">账本查看</el-breadcrumb-item>
      <el-breadcrumb-item>结算预览(BETA)</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="此页面为结算预览，进行结算请到管理员页面" type="info" show-icon></el-alert>

    <el-row :gutter="12" style="display: flex; flex-wrap: wrap;">
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="6"
        :xl="3"
        :key="cal.name"
        v-for="cal in this.calculation.settleDetails"
        style="display: flex"
      >
        <el-card shadow="hover" style="flex: 1 0 auto;">
          <h4>{{ cal.name }}</h4>
          <p>已支付：{{ cal.paid.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }}</p>
          <p>平均花费：{{ cal.average.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }}</p>
          <el-alert
            type="success"
            effect="dark"
            :closable="false"
            :key="path.toName"
            v-for="path in cal.paths"
          >
            <i class="el-icon-coin"></i>
            &nbsp;需要支付给 {{ path.toName }}&nbsp;{{ path.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }}
          </el-alert>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-alert {
  margin-bottom: 5px;
}
.el-card {
  margin-top: 10px;
}
.el-card p {
  font-size: 0.9rem;
  line-height: 0.9;
}
</style>

<script>
import TravelBookMixin from "../context/TravelBookMixin";

export default {
  mixins: [TravelBookMixin],
  data: function() {
    return {};
  },
  methods: {}
};
</script>


