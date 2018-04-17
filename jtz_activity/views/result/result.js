/**
 * Created by ljr on 2017/5/31.
 */
require(["vue", "common", "apiData", "extend", "dialog", 'vue-navmenu'], function(Vue, app, api, ext, dialog) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;
    let styleBg = ext.getValue("styleBg"),
        prizeName = ext.getValue("prizeName"),
        prizeValue = ext.getValue("prizeValue") / 100,
        prePrizeId = ext.getValue("prePrizeId"),
        logoUrl = ext.getValue("logoUrl");
    let isSmoke = false;
    let reg = /幸运奖/ig;
    if (reg.test(prizeName)) {
        isSmoke = true
    }

    let headPortrait = "static/" + __uri("../../components/common/images/headPortrait.png");

    ext.wxIntercept((barData, wxLogin) => {
        // 无扫码数据。与wx登录数据。 则去登录
        // (!barData || !wxLogin) && ext.wxWarranty();
        let vm = new Vue({
            el: "#app",
            data: {
                screenH: HEIGTH,
                isflag: 5, //底部菜单的索引index传值
                styleBg: styleBg, //  1.实物，2.红包，3.卡券 的背景
                ticketResult: 'ticketResult',
                kindResult: 'kindResult',
                redpacketResult: 'redpacketResult',
                jiantou: true,
                prizeName: prizeName,
                prizeValue: prizeValue,
                prePrizeId: prePrizeId,
                logoUrl: logoUrl,
                isSmoke: isSmoke,
                nextPage: 1,
                pageSize: 10,
                array: [],
            },
            mounted: function() {
                let that = this
                    // console.log(this);

                //卡券列表
                if (styleBg == 3) {
                    api.queryPrizeGiftByGiftId(prePrizeId, that.nextPage, that.pageSize, barData.barcode, barData.province, barData.city).done(
                        data => {
                            let edata = data.data;
                            switch (data.code) {
                                case 200:
                                    // 做数据过滤 
                                    let tempArray = [];
                                    try {
                                        edata.list.forEach(function(el) {
                                            if (el.type != 130301) {
                                                tempArray.push(el)
                                            }
                                        }, this);
                                        vm.array = tempArray;
                                    } catch (error) {
                                        vm.array = [];
                                    }


                                    break;
                                case 601:
                                    //重新登录
                                    //ext.wxWarranty()
                                    break;
                                default:
                                    data.msg && dialog.tipDialog(data.msg);
                                    break;
                            }
                        });
                    //end
                }

            },

            methods: {
                toggleFun: function() {
                    this.jiantou = !this.jiantou
                },
                moreFun: function() {
                    ext.linkTo("exchange-welfare");
                },
                doExchangeCard: function(el) {
                    let _this = this;
                    !el && dialog.tipDialog("兑换信息错误");
                    ext.linkTo("exchange-ticket", {
                        prizeId: el.id,
                        giftId: el.giftId
                    });
                    // api.exchangeCard(el.giftId, el.id, wxLogin.userToken, barData.province, barData.city, barData.area,barData.town, 1).done(
                    //     data => {
                    //         let type = data.code,
                    //             edata = data.data;
                    //         switch (type) {
                    //             case 200:
                    //                 // 更新用户数据
                    //                 getUserInfo();
                    //                 let obj = new Object();
                    //                 obj = edata;
                    //                 obj.logoUrl = edata.prizePic;

                    //                 // 兑换成功后  跳转到兑换成功
                    //                 // ext.linkTo("exchange-result", obj);

                    //                 break
                    //                  case 3101:
                    //                  case 3103:
                    //                  case 3104:
                    //                  window.location.href = "http://qt.cncqti.com/formal/update.html";
                    //                   break
                    //             case 601:
                    //                 //重新登录
                    //                 ext.wxWarranty()
                    //                 break
                    //             default:
                    //                 //data.msg && dialog.tipDialog(data.msg);
                    //                 break

                    //         }
                    //     }
                    // )
                },
            },
            computed: {}

        });

        function getUserInfo() {
            api.getUserInfo(wxLogin.userToken).done(
                data => {
                    switch (data.code) {
                        case 200:
                            vm.userpic = data.data.headImgUrl || headPortrait;
                            vm.nickname = data.data.nickname;
                            vm.userphone = data.data.phone;
                            vm.cqJnkpValue = data.data.cqJnkpValue;
                            break;
                        case 601:
                            //重新登录
                            ext.wxWarranty()
                            break;
                        default:
                            data.msg && dialog.tipDialog(data.msg);
                            break;
                    }
                }
            );
        }
    });


});