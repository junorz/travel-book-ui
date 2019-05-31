import { get } from "../utils/APIUtil"
import { mapState, mapActions } from 'vuex'
import Types from '../store/types'
import moment from "moment";
import Consts from "./Consts"

export default {
    computed: {
        ...mapState(["bookName", "viewMode", "currentBookId"])
    },
    data: function () {
        return {
            travelBookId: "",
            accessUrl: "",
            pureUrl: "",
            memberList: [],
            detailList: [],
            totalAmount: "",
            pureAmount: "",
            calculation: {},
            loading: true,
            loadingText: "账本数据加载中"
        }
    },
    methods: {
        initialize: function (url) {
            this.loadingText = "账本数据加载中";
            this.loading = true;
            this.CHANGE_VIEW_MODE({ viewMode: true });
            // 加载账本数据
            get(
                Consts.URLs.base + "/" + url,
                null,
                response => {
                    console.log(response);
                    // 更新组件数据
                    this.CHANGE_BOOK_NAME({ bookName: response.data.data.name });
                    this.travelBookId = response.data.data.id;
                    this.totalAmount = response.data.data.calculation.amount
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
                    this.pureAmount = response.data.data.calculation.amount;
                    this.pureUrl = response.data.data.accessUrl;
                    this.accessUrl =
                        Consts.URLs.frontBase + "/#/t/" + response.data.data.accessUrl;
                    this.memberList = response.data.data.memberList;
                    this.detailList = response.data.data.detailList;
                    this.detailList.forEach(d => {
                        d.dateTime = moment(d.dateTime).format("YYYY/MM/DD");
                    });
                    this.calculation = response.data.data.calculation;
                    this.loading = false;
                    this.CHANGE_CURRENT_BOOK({ currentBookId: response.data.data.id });
                },
                () => {
                    this.$alert("无法读取账本数据", "数据请求失败");
                    this.CHANGE_BOOK_NAME({ bookName: Consts.appName });
                    this.loading = true;
                    this.loadingText = "账本数据加载失败";
                    this.CHANGE_CURRENT_BOOK({ currentBookId: "" });
                }
            );
        },
        ...mapActions([Types.CHANGE_BOOK_NAME, Types.CHANGE_VIEW_MODE, Types.CHANGE_CURRENT_BOOK])
    }, mounted: function () {
        this.initialize(this.$route.params.url);
    },
    beforeRouteUpdate: function (to, from, next) {
        this.initialize(to.params.url);
        next();
    }
}