/**
 * Created by ljr on 2017/5/31.
 */
require(["vue", "common", "extend", "apiData", "dialog", "timeouter", "validate", "area"], function(Vue, app, ext, api, dialog, timeouter, val) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;
    ext.wxIntercept((barData, wxLogin) => {
        // 无扫码数据。与wx登录数据。 则去登录
        // (!barData || !wxLogin) && ext.wxWarranty();
        let prizeId = ext.getValue('prizeId') || 0;
        let giftId = ext.getValue('giftId') || 0;
        !prizeId && ext.backOut();

        let vm = new Vue({
            el: "#app",
            data: {
                screenH: HEIGTH,
                prizeName: '', // 奖品名称
                prizePic: '', // 奖品图片
                comment: '', // 卡劵说名
                activityId: '',
                isSubmit: true
            },
            mounted: function() {
                api.queryPrizeDetailInfo(prizeId, wxLogin.userToken, "").done(
                    data => {
                        let pedata = data.data;

                        switch (data.code) {
                            case 200:
                                vm.prizeName = pedata.prizeName;
                                vm.prizePic = pedata.logoUrl;
                                vm.comment = pedata.comment;
                                break;
                            case 601:
                                //重新登录
                                ext.wxWarranty();
                                break;
                            default:
                                data.msg && dialog.tipDialog(data.msg);
                                break;
                        }
                    });
                //end
            },
            watch: {},

            methods: {
                exchangeFun: function() {
                    // 兑换卡劵
                    api.exchangeCard(giftId, prizeId, wxLogin.userToken, barData.province, barData.city, barData.area, barData.town, barData.barcode, barData.product_id, "").done(
                        data => {
                            let type = data.code,
                                edata = data.data;
                            switch (type) {
                                case 200:
                                    console.log(edata);
                                    // debugger
                                    // 兑换成功后  跳转到兑换成功
                                    ext.linkTo("exchange-success", {
                                        prizeId: prizeId,
                                        orderNo: edata.orderNo,
                                        winId: 1
                                    });
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
                        }
                    )
                }

            },
            computed: {}

        });


    });




});