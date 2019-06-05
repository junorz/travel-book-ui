<template>
  <div id="travelBookArea" v-loading="loading" :element-loading-text="loadingText">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理账本</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row type="flex">
      <el-button
        type="warning"
        size="small"
        class="maxWidthArea"
        @click="openDetailDialog('newDetailMode')"
      >
        <i class="el-icon-edit-outline"></i>&nbsp;记一笔
      </el-button>
    </el-row>
    <el-row type="flex" justify="space-between">
      <div class="maxWidthArea">
        <div class="totalAmountArea">
          <i class="el-icon-money"></i>
          &nbsp;总支出：{{ totalAmount }}
        </div>
      </div>
      <div class="buttonArea">
        <el-button size="small" @click="settlePreview()">
          <i class="el-icon-document-checked"></i>&nbsp;结算
        </el-button>
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
        >
          <i class="el-icon-copy-document"></i>&nbsp;复制链接
        </el-button>
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
            closable
            @close="removeMember(member.id)"
          >{{ member.name }}</el-tag>
          <el-row type="flex" class="memberAdd">
            <el-input v-model="newMemberName" placeholder="请输入新成员姓名" size="small"></el-input>
            <el-button size="small" @click="addMember()">
              <i class="el-icon-circle-plus"></i>&nbsp;添加
            </el-button>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <el-table :data="detailList" stripe border style="width: 100%" size="medium" ref="dataTable">
      <el-table-column label="操作" width="85">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            class="el-button-mini"
            @click="openDetailDialog('editDetailMode', scope.row)"
          >
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button
            type="danger"
            size="mini"
            class="el-button-mini"
            @click="removeDetail(scope.row)"
          >
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
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

    <el-dialog
      id="detailDialog"
      :title="detailDialogMode == 'newDetailMode' ? '新项目' : '编辑'"
      :visible.sync="detailDialogVisible"
    >
      <el-form ref="detailItem" :model="detailItem" label-position="right" label-width="auto">
        <el-form-item label="金额">
          <el-input v-model="detailItem.amount" type="number"></el-input>
        </el-form-item>
        <el-alert
          v-if="!isCurrencySame"
          :title="amountInfo"
          :closable="false"
          type="warning"
          show-icon
        ></el-alert>
        <el-form-item label="消费明细">
          <el-input v-model="detailItem.remarks"></el-input>
        </el-form-item>
        <el-form-item label="付款人">
          <el-select v-model="detailItem.memberId" placeholder="请选择付款人">
            <el-option
              v-for="member in memberList"
              :key="member.id"
              :label="member.name"
              :value="member.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款对象">
          <el-select v-model="detailItem.memberList" placeholder="全员" multiple>
            <el-option
              v-for="member in memberList"
              :key="member.id"
              :label="member.name"
              :value="member.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-alert title="留空则为全员平分这项付款" type="info" show-icon :closable="false"></el-alert>
        <el-form-item label="一级类别">
          <el-select
            v-model="detailItem.primaryCategoryId"
            placeholder="请选择一级类别"
            @change="detailItem.secondaryCategoryId = ''"
          >
            <el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级类别">
          <el-select v-model="detailItem.secondaryCategoryId" placeholder="请选择二级类别">
            <el-option v-for="c in secondaryCategoryList" :key="c.id" :label="c.name" :value="c.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货币种类">
          <el-select v-model="detailItem.currency" @change="setAmountInfo">
            <el-option v-for="c in currencyList" :key="c.value" :label="c.label" :value="c.value"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="!isCurrencySame">
          <el-alert :title="currencyInfo" type="info" show-icon :closable="false"></el-alert>
          <el-form-item label="汇率">
            <el-row type="flex" :gutter="5">
              <el-col>
                <el-input v-model="detailItem.exchangeRate"></el-input>
              </el-col>
              <el-col>
                <el-button type="primary" plain @click="getExchangeRate()" size="small">
                  <span v-html="getExchangeRateButton"></span>
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <el-form-item label="日期">
          <el-date-picker v-model="detailItem.dateTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-row type="flex" justify="center" v-if="detailDialogMode == 'newDetailMode'">
          <el-button type="primary" @click="addNewDetail(false)" :loading="buttonLoading">提交</el-button>
          <el-button @click="addNewDetail(true)" :loading="buttonLoading">继续添加</el-button>
        </el-row>
        <el-row type="flex" justify="center" v-if="detailDialogMode == 'editDetailMode'">
          <el-button type="primary" @click="updateDetail()" :loading="buttonLoading">更新</el-button>
        </el-row>
      </el-form>
    </el-dialog>
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
#detailDialog .el-form {
  margin-top: -20px;
}
#detailDialog .el-alert {
  margin: -2px 0 10px;
}
#detailDialog .el-form-item {
  margin-bottom: 8px;
}
.memberAdd {
  margin-top: 5px;
}
.memberAdd button {
  margin-left: 3px;
}
.el-row {
  margin-bottom: 5px;
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
.el-button-mini {
  padding: 5px;
  margin-left: 5px !important;
}
</style>

<script>
import TravelBookInitMixin from "../context/TravelBookInitMixin";
import { get, authPost } from "../utils/APIUtil";
import Consts from "../context/Consts";
import * as CurrencyUtil from "../utils/CurrencyUtil";
import moment from "moment";

export default {
  mixins: [TravelBookInitMixin],
  data: function() {
    return {
      detailDialogVisible: false,
      newMemberName: "",
      detailItem: {
        id: "", // ID只有在编辑模式时使用
        amount: "",
        remarks: "",
        memberId: "",
        memberList: [],
        primaryCategoryId: "",
        secondaryCategoryId: "",
        currency: "",
        exchangeRate: "1.00",
        dateTime: ""
      },
      secondaryCategoryList: [],
      currencyInfo: "",
      currencyList: [],
      getExchangeRateButton: "获取当前汇率",
      buttonLoading: false,
      amountInfo: "",
      detailDialogMode: "newDetailMode"
    };
  },
  computed: {
    isCurrencySame: function() {
      return this.currency == this.detailItem.currency;
    }
  },
  watch: {
    currency: function() {
      // 账本货币类型初始化完成之后设置新帐目默认类型
      this.currencyInfo =
        "此帐本的货币类型为 " +
        CurrencyUtil.getName(this.currency) +
        "。如果你选择了其他货币类型请指定一个汇率。";
      this.detailItem.currency = this.currency;
    },
    "detailItem.primaryCategoryId": function() {
      this.categoryList.forEach(c => {
        if (c.id == this.detailItem.primaryCategoryId) {
          this.secondaryCategoryList = c.secondaryCategoryList;
        }
      });
    }
  },
  methods: {
    openDetailDialog: function(mode, data) {
      this.detailDialogMode = mode;
      this.detailDialogVisible = true;
      if (mode == "newDetailMode") {
        this.resetDetailDialog();
        this.detailItem.dateTime = new Date();
      } else if (mode == "editDetailMode") {
        this.detailItem.id = data.id;
        this.detailItem.amount = data.amount;
        this.detailItem.remarks = data.remarks;
        this.detailItem.memberId = data.member.id;
        this.detailItem.memberList = data.memberList.map(m => m.id);
        this.detailItem.primaryCategoryId = data.primaryCategoryId;
        this.detailItem.secondaryCategoryId = data.secondaryCategoryId;
        this.detailItem.currency = data.currency;
        this.detailItem.exchangeRate = data.exchangeRate;
        this.detailItem.dateTime = data.dateTime;
      }
    },
    resetDetailDialog: function() {
      this.detailItem.id = "";
      this.detailItem.amount = "";
      this.detailItem.remarks = "";
      this.detailItem.memberId = "";
      this.detailItem.memberList = [];
      this.detailItem.primaryCategoryId = "";
      this.detailItem.secondaryCategoryId = "";
      this.detailItem.currency = this.currency;
      this.detailItem.exchangeRate = "1.00";
    },
    formatDate: function(dateTime) {
      return moment(dateTime).format("YYYY/MM/DD");
    },
    copySuccess: function() {
      this.$message({
        message: "复制链接成功",
        type: "success"
      });
    },
    copyFailed: function() {
      this.$message({
        message: "复制链接失败",
        type: "error"
      });
    },
    randomColor: function() {
      const colors = ["", "success", "info", "warning", "danger"];
      const randomInt = Math.floor(Math.random() * Math.floor(colors.length));
      return colors[randomInt];
    },
    openPayTarget: function(data) {
      this.$alert(data.map(d => d.name).join(", "), "付款对象");
    },
    settlePreview: function() {
      this.$router.push({
        name: "settlePreview",
        params: { url: this.pureUrl }
      });
    },
    addMember: function() {
      authPost(
        Consts.URLs.member.create,
        {
          travelBookId: this.travelBookId,
          memberName: this.newMemberName
        },
        response => {
          this.memberList.push(response.data.data);
          this.newMemberName = "";
        },
        err => {
          // 如果 data 不为空，则循环出所有错误消息
          if (err.response.data.data != null) {
            this.$message({
              type: "error",
              message: err.response.data.data
                .map(m => m.errorMessage)
                .join("\n")
            });
          } else {
            this.$message({
              type: "error",
              message: err.response.data.message
            });
          }
        }
      );
    },
    removeMember: function(memberId) {
      authPost(
        Consts.URLs.member.base + "/" + memberId + "/delete",
        {
          travelBookId: this.travelBookId
        },
        response => {
          const index = this.memberList.findIndex(
            m =>
              m.name ==
              response.data.data.name.slice(
                0,
                response.data.data.name.indexOf("_")
              )
          );
          this.memberList.splice(index, 1);
        },
        err => {
          this.$alert(err.response.data.message, "错误");
        }
      );
    },
    getExchangeRate: function() {
      this.getExchangeRateButton =
        '<i class="el-icon-loading"></i>&nbsp;获取中';
      get(
        Consts.URLs.currency.base +
          "/" +
          this.detailItem.currency +
          "/" +
          this.currency,
        null,
        response => {
          this.detailItem.exchangeRate = response.data.data;
          this.getExchangeRateButton = "获取当前汇率";
        },
        () => {
          this.getExchangeRateButton =
            '<i class="el-icon-error"></i>&nbsp;获取失败';
        }
      );
    },
    setAmountInfo: function() {
      this.amountInfo =
        "金额处请填写" + CurrencyUtil.getName(this.detailItem.currency) + "。";
    },
    addNewDetail: function(isContinue) {
      this.buttonLoading = true;
      authPost(
        Consts.URLs.detail.create,
        {
          travelBookId: this.travelBookId,
          memberId: this.detailItem.memberId,
          memberList:
            this.detailItem.memberList.length == 0
              ? this.memberList.map(m => m.id)
              : this.detailItem.memberList,
          primaryCategoryId: this.detailItem.primaryCategoryId,
          secondaryCategoryId: this.detailItem.secondaryCategoryId,
          amount: this.detailItem.amount,
          currency: this.detailItem.currency,
          exchangeRate: this.detailItem.exchangeRate,
          dateTime: moment.utc(this.detailItem.dateTime).unix(),
          remarks: this.detailItem.remarks
        },
        () => {
          this.resetDetailDialog();
          this.initialize(this.pureUrl);
          if (!isContinue) {
            this.detailDialogVisible = false;
          }
        },
        err => {
          if (
            err.response.data.data != null &&
            Array.isArray(err.response.data.data)
          ) {
            this.$message.error(err.response.data.data[0]["errorMessage"]);
          } else {
            this.$message.error(err.response.data.message);
          }
        },
        () => {
          this.buttonLoading = false;
        }
      );
    },
    removeDetail: function(row) {
      this.$confirm("是否删除此条记录？", "确认删除", { type: "warning" })
        .then(() => {
          authPost(
            Consts.URLs.detail.base + "/" + row.id + "/delete",
            { travelBookId: row.travelBookId },
            () => {
              this.$message.success("删除成功");
              this.initialize(this.pureUrl);
            },
            err => {
              this.$message.error(err.response.data.message);
            }
          );
        })
        .catch(() => {});
    },
    updateDetail: function() {
      this.buttonLoading = true;
      authPost(
        Consts.URLs.detail.base + "/" + this.detailItem.id + "/edit",
        {
          travelBookId: this.travelBookId,
          memberId: this.detailItem.memberId,
          memberList:
            this.detailItem.memberList.length == 0
              ? this.memberList.map(m => m.id)
              : this.detailItem.memberList,
          primaryCategoryId: this.detailItem.primaryCategoryId,
          secondaryCategoryId: this.detailItem.secondaryCategoryId,
          amount: this.detailItem.amount,
          currency: this.detailItem.currency,
          exchangeRate: this.detailItem.exchangeRate,
          dateTime: moment.utc(this.detailItem.dateTime).unix(),
          remarks: this.detailItem.remarks
        },
        () => {
          this.detailDialogVisible = false;
          this.resetDetailDialog();
          this.$message.success("更新成功");
          this.initialize(this.pureUrl);
        },
        err => {
          if (
            err.response.data.data != null &&
            Array.isArray(err.response.data.data)
          ) {
            this.$message.error(err.response.data.data[0]["errorMessage"]);
          } else {
            this.$message.error(err.response.data.message);
          }
        },
        () => {
          this.buttonLoading = false;
        }
      );
    }
  },
  mounted: function() {
    get(Consts.URLs.currency.base, null, response => {
      this.currencyList = response.data.data.map(c =>
        CurrencyUtil.mapToLabelValue(c)
      );
    });
  }
};
</script>

