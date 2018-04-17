/**
 * Created by ljr on 2017/5/31.
 */
require(["vue", "common", "extend", "apiData", "dialog", 'vue-navmenu'], function (Vue, app, ext, api, dialog) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;


    let activityInfo = JSON.parse(app.getValue('ActivityInfo', 'session')) || 0;


    ext.wxIntercept((barData, wxLogin, wxinfo) => {
        // 无扫码数据。与wx登录数据。 则去登录
        // (!barData || !wxLogin) && ext.wxWarranty();

        console.log(wxinfo)
        let vm = new Vue({
            el: "#app",
            data: {
                screenH: HEIGTH,
                scrollWin: [],
                thisCity: '', // 
                timeText: 1,
                isflag: 4, //底部菜单的索引index传值
                rankList: [], // 排行榜信息
                rankMsg: '*每周开奖,本周为第一期活动,<strong>在周期内系统将评选出每天扫码包数最多的用户为每周周冠军,</strong>周冠军均可获得一份神秘大礼包。', // 顶部提示语句
                bottomMsg: '', // 底部排行规则
                isOver: false, // 活动是否已经结束
                rankFlag: false, // false 是未排上
                isGet: 0, // 1表示已经领取过 0 未领取
                prizeName: '', // 大奖名称
                prizePic: '', // 大奖图片
                myrankInfo: '', // 我的排行榜信息
                turnDate: "", //周期信息
                weekType: 2, // 周排行榜
                weekRule: activityInfo.weekRule || '未填写'

            },
            mounted: function () {
                // this.getRankList();

            },

            methods: {



            },
            computed: {}

        });




    });



});