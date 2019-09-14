<template>
  <div class="home">
    <el-row>
      <el-col>
        <el-button type="primary" @click="openCreateDialog()">
          <i class="el-icon-notebook-1"></i>&nbsp;新建账本
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button @click="navToUserGuide()">
          <i class="el-icon-question"></i>&nbsp;使用帮助
        </el-button>
      </el-col>
    </el-row>

    <el-dialog title="新建账本" :visible.sync="createDialogVisible" width="80%">
      <el-form :model="createForm" label-position="right" label-width="auto">
        <el-form-item label="账本名称">
          <el-input v-model="createForm.name"></el-input>
        </el-form-item>
        <el-alert
          v-if="validationMsg.createForm.name != null && validationMsg.createForm.name != '' "
          :title="validationMsg.createForm.name"
          type="error"
          show-icon
          :closable="false"
        ></el-alert>
        <el-form-item label="管理员密码">
          <el-input v-model="createForm.adminPassword" show-password></el-input>
        </el-form-item>
        <el-alert
          v-if="validationMsg.createForm.adminPassword != null && validationMsg.createForm.adminPassword != ''"
          :title="validationMsg.createForm.adminPassword"
          type="error"
          show-icon
          :closable="false"
        ></el-alert>
        <el-form-item label="确认密码">
          <el-input v-model="createForm.confirmPassword" show-password></el-input>
        </el-form-item>
        <el-alert
          v-if="validationMsg.createForm.confirmPassword != null && validationMsg.createForm.confirmPassword != ''"
          :title="validationMsg.createForm.confirmPassword"
          type="error"
          show-icon
          :closable="false"
        ></el-alert>
        <el-form-item label="货币种类">
          <el-select v-model="createForm.currency" placeholder="请选择货币种类">
            <el-option
              v-for="item in currencyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-alert
          v-if="validationMsg.createForm.currency != null && validationMsg.createForm.currency != ''"
          :title="validationMsg.createForm.currency"
          type="error"
          show-icon
          :closable="false"
        ></el-alert>
        <el-button type="primary" @click="createNewTravelBook()">
          <i class="el-icon-s-promotion"></i>&nbsp;立即创建
        </el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  margin-top: 25%;
}
.el-row {
  margin-bottom: 20px;
}
.el-select {
  display: block;
}
.el-alert {
  margin: -10px 0 10px;
}
</style>

<script>
import { get, post } from "../utils/APIUtil";
import Consts from "../context/Consts";
import { mapState, mapActions } from "vuex";
import Types from "../store/types";
import { mapToLabelValue } from "../utils/CurrencyUtil";

export default {
  data: function() {
    return {
      createDialogVisible: false,
      settingDialogVisible: false,
      createForm: {
        name: "",
        adminPassword: "",
        confirmPassword: "",
        currency: ""
      },
      settingForm: {},
      currencyList: [],
      validationMsg: {
        createForm: {
          name: "",
          adminPassword: "",
          confirmPassword: "",
          currency: ""
        }
      }
    };
  },
  computed: {
    ...mapState(["bookName", "viewMode", "currentBookId"])
  },
  methods: {
    openCreateDialog: function() {
      this.createDialogVisible = true;
    },
    closeCreateDialog: function() {
      this.createDialogVisible = false;
    },
    opensettingDialog: function() {
      this.settingDialogVisible = true;
    },
    closeSettingDialog: function() {
      this.settingDialogVisible = false;
    },
    createNewTravelBook: function() {
      if (this.validateCreateForm()) {
        post(
          Consts.URLs.travelbook.create,
          this.createForm,
          response => {
            console.log(response);
            this.$router.push({
              name: "travelBook",
              params: { url: response.data.data.accessUrl }
            });
          },
          err => {
            // 处理后端错误消息
            Object.keys(this.validationMsg.createForm).forEach(key => {
              this.validationMsg.createForm[key] = null;
            });
            const errArray = err.response.data.data;
            if (Array.isArray(errArray)) {
              errArray.forEach(e => {
                this.validationMsg.createForm[e.fieldName] = e.errorMessage;
              }, this);
            }
          }
        );
      }
    },
    validateCreateForm: function() {
      let result = true;
      if (this.createForm.name == null || this.createForm.name.trim() == "") {
        this.validationMsg.createForm.name = "账本名称不能为空";
        result = false;
      } else {
        this.validationMsg.createForm.name = "";
      }

      if (
        this.createForm.adminPassword == null ||
        this.createForm.adminPassword.trim() == ""
      ) {
        this.validationMsg.createForm.adminPassword = "密码不能为空";
        result = false;
      } else {
        this.validationMsg.createForm.adminPassword = "";
      }

      if (
        this.createForm.confirmPassword == null ||
        this.createForm.confirmPassword.trim() == ""
      ) {
        this.validationMsg.createForm.confirmPassword = "密码不能为空";
        result = false;
      } else {
        this.validationMsg.createForm.confirmPassword = "";
      }

      if (this.createForm.adminPassword != this.createForm.confirmPassword) {
        this.validationMsg.createForm.adminPassword = "密码不一致";
        this.validationMsg.createForm.confirmPassword = "密码不一致";
        result = false;
      }

      if (
        this.createForm.currency == null ||
        this.createForm.currency.trim() == ""
      ) {
        this.validationMsg.createForm.currency = "货币种类不能为空";
        result = false;
      } else {
        this.validationMsg.createForm.currency = "";
      }

      return result;
    },
    navToUserGuide: function () {
      this.$router.push('help');
    },
    ...mapActions([
      Types.CHANGE_BOOK_NAME,
      Types.CHANGE_VIEW_MODE,
      Types.CHANGE_CURRENT_BOOK
    ])
  },
  created: function() {
    get(
      Consts.URLs.currency.base,
      null,
      response => {
        this.currencyList = response.data.data.map(mapToLabelValue);
      },
      () => {
        this.$notify.error({
          title: "错误",
          message: "与服务器通信失败"
        });
      }
    );
  },
  mounted: function() {
    this.CHANGE_VIEW_MODE({ viewMode: false });
    this.CHANGE_BOOK_NAME({ bookName: Consts.appName });
    this.CHANGE_CURRENT_BOOK({ currentBookId: "" });
  }
};
</script>

