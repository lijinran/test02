/**
 * Created by ljr on 2017/5/31.
 */
require(["vue", "common", "extend", "apiData", "dialog", "vue-marquee", 'vue-navmenu'], function(Vue, app, ext, api, dialog) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;


    let activityInfo = JSON.parse(app.getValue('ActivityInfo', 'session')) || 0;

    // 跑马灯的一些参数
    let getRollTime = app.getValue('getRollTime', 'local') || 0;
    let srcollList = app.getValue('srcollList', 'local') || 0;

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
                turnNum: 1, // 默认是第一轮
                weekType: 2, // 周排行榜
                weekRule: activityInfo.weekRule || '未填写'

            },
            mounted: function() {
                this.getRankList();
                //当有跑马灯数据的时候
                if (srcollList) {
                    let lsList = JSON.parse(srcollList);
                    setTimeout(function() {
                        scroll(lsList)
                    }, 200)
                } else {
                    setTimeout(this.querySrcollList, 100)
                }


            },

            filters: {

                // 格式化 时间
                format: function(str) {
                    if (str) {
                        return new Date(str).format()
                    }
                }
            },
            methods: {
                /**
                 * 活动结束后领取大奖
                 */
                goGetAward: function() {
                    let _this = this;
                    let obj = new Object();
                    obj.winId = 11;
                    obj.form = 'rank'; // 来源地址
                    obj.prizeType = 1301; // 实物
                    obj.logoUrl = _this.prizePic;
                    obj.prizeName = _this.prizeName;
                    ext.linkTo("exchange-result", obj)


                },
                /**
                 * 获取当前城市的排行榜
                 */
                getRankList: function() {
                    let _this = this;

                    api.queryMarketRankList(wxLogin.userToken, wxinfo.openid, barData.province, barData.city, barData.barcode, _this.weekType).done(
                        data => {
                            let type = data.code,
                                edata = data.data;
                            switch (type) {
                                case 200:
                                    _this.thisCity = edata.area;
                                    _this.rankMsg = edata.rankMsg;
                                    _this.bottomMsg = edata.bottomMsg;
                                    _this.rankList = edata.rankLists;
                                    _this.isOver = edata.isOver ? 1 : 0;
                                    _this.rankFlag = edata.rankFlag ? 1 : 0;
                                    _this.isGet = edata.isGet == '1' ? 1 : 0;
                                    _this.prizeName = edata.prizeName;
                                    _this.prizePic = edata.logoUrl;
                                    _this.turnDate = edata.turnDate;
                                    _this.turnNum = edata.turnNum
                                    break
                                case 3101:
                                case 3103:
                                case 3104:
                                    window.location.href = "http://qt.cncqti.com/formal/update.html";
                                    break
                                case 601:
                                    //重新登录  
                                    ext.wxWarranty()
                                    break
                                default:
                                    data.msg && dialog.tipDialog(data.msg);
                                    break

                            }
                            console.log(data)
                        }
                    )

                },
                /**
                 * 获取跑马灯的效果
                 */
                querySrcollList: () => {
                    api.querySrcollList(activityInfo.id,barData.province, barData.city).done(
                        data => {
                            switch (data.code) {
                                case 200:
                                    scroll(data.data);
                                    break;
                                default:
                                    break;
                            }
                        });

                },
                /**
                 * 跳转页面
                 */
                gotoURL: (url) => {
                    app.linkTo(url)
                }

            },
            computed: {}

        });

        //头部滚动
        function scroll(arr) {
            if ($.isArray(arr) && arr.length > 0) {
                var Winlist = arr.map(function(item, index) {
                    if (!item['phone']) {
                        let obj = "未知";
                        return "恭喜用户" + "<span class='newcolor1'>" + obj + "</span>" + "获得" + "<span class='newcolor1'>" + item["prizeName"] + "</span>";
                    } else {
                        var phone = item['phone'].substring(0, 3) + "****" + item['phone'].substring(7, 11);
                        return "恭喜用户" + "<span class='newcolor1'>" + phone + "</span>" + "获得" + "<span class='newcolor1'>" + item["prizeName"] + "</span>";
                    }


                });
                vm.scrollWin = Winlist;
            } else if (arr == 1) {
                vm.scrollWin = ['活动已结束'];
            } else {
                vm.scrollWin = ['暂无中奖数据'];
            }
        }


    });



});