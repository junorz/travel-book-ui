<template>
  <div id="travelBookArea" v-loading="loading" :element-loading-text="loadingText">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账本查看</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row type="flex" justify="space-between">
      <div class="maxWidthArea">
        <div class="totalAmountArea">
          <i class="el-icon-money"></i>
          &nbsp;总支出：{{ totalAmount }}
        </div>
      </div>
      <div class="buttonArea">
        <el-button size="small" @click="settlePreview()">结算预览</el-button>
      </div>
    </el-row>
    <el-row id="urlInput" type="flex" justify="space-between">
      <div class="maxWidthArea">
        <el-input v-model="accessUrl" size="small"></el-input>
      </div>
      <div class="buttonArea">
        <el-button
          size="small"
          type="primary"
          v-clipboard:copy="accessUrl"
          v-clipboard:success="copySuccess"
          v-clipboard:error="copyFailed"
        >复制链接</el-button>
        <!-- <el-button type="success" size="mini">分享到微信</el-button> -->
      </div>
    </el-row>
    <el-row>
      <el-collapse>
        <el-collapse-item title="成员列表">
          <el-tag
            :key="member.id"
            v-for="member in memberList"
            size="mini"
            :type="randomColor()"
          >{{ member.name }}</el-tag>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <el-table :data="detailList" stripe border style="width: 100%" size="medium" ref="dataTable">
      <el-table-column label="日期" min-width="90">
        <template slot-scope="scope">{{ formatDate(scope.row.dateTime) }}</template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" min-width="100"></el-table-column>
      <el-table-column prop="remarks" label="消费明细" min-width="150"></el-table-column>
      <el-table-column prop="primaryCategoryName" label="一级类别"></el-table-column>
      <el-table-column prop="secondaryCategoryName" label="二级类别"></el-table-column>
      <el-table-column prop="member.name" label="付款人"></el-table-column>
      <el-table-column label="付款对象">
        <template slot-scope="scope">
          <el-button size="mini" @click="openPayTarget(scope.row.memberList)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
#travelBookArea {
  min-height: 500px;
}
#urlInput {
  margin: 5px 0;
}
.maxWidthArea {
  flex-grow: 1;
}
.maxWidthArea .totalAmountArea {
  background-color: #fdf6ec;
  border: 1px solid #e6a23c;
  color: #e6a23c;
  font-size: 15px;
  padding: 8px 10px;
  border-radius: 4px;
}
.buttonArea {
  display: flex;
  justify-content: flex-end;
  margin-left: 3px;
}
.buttonArea button {
  margin-left: 3px;
}
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-tag {
  margin: 0 3px;
}
.el-alert {
  padding: 8px 4px;
}
.el-table {
  font-size: 0.8rem;
  margin-top: 8px;
}
</style>

<script>
import TravelBookMixin from "../context/TravelBookMixin";

export default {
  mixins: [TravelBookMixin],
  data: function() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>

