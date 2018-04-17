/**
 * Created by ljr on 2017/5/31.
 */
require(["vue", "common", "extend", "apiData", "dialog", "timeouter", "validate"], function(Vue, app, ext, api, dialog, timeouter, val) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;
    ext.wxIntercept((barData, wxLogin) => {
        // 无扫码数据。与wx登录数据。 则去登录
        // (!barData || !wxLogin) && ext.wxWarranty();
        let prizeId = ext.getValue('prizeId') || 0;
        let giftId = ext.getValue('giftId') || 0;
        let cardNum = ext.getValue('cardNum') || 1;
        !prizeId && ext.backOut();



        let vm = new Vue({
            el: "#app",
            data: {
                screenH: HEIGTH,
                cardNum: cardNum, // 消耗
                prizeName: '', // 奖品名称
                prizePic: '', // 奖品图片
                comment: '', // 卡劵说名
                activityId: '',
                isSubmit: true,
                phone: '',
                rephone: '',
                isShowPoint: false,
                isShowPointTxt: '',
                showMask: false
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
            watch: {

                /**
                 * 监听用户输入的手机号
                 * @param n 是新输入
                 * @param o 旧数据
                 */
                phone: function(n, o) {
                    //限制用户输入数字
                    let Reg = /^\d+$/
                    if (Reg.test(n)) {

                    } else if (n != '') {
                        vm.phone = o;
                    } else if (n == '') {
                        vm.phone = '';
                    }

                },
                /**
                 * 监听用户输入的手机号
                 * @param n 是新输入
                 * @param o 旧数据
                 */
                rephone: function(n, o) {
                    //限制用户输入数字
                    let Reg = /^\d+$/
                    if (Reg.test(n)) {

                    } else if (n != '') {
                        vm.phone = o;
                    } else if (n == '') {
                        vm.phone = '';
                    }

                }

            },

            methods: {
                exchangeFun: function() {
                    let that = this
                    ext.bannedClick(
                        checkInput(function() {
                            ext.getCheckout(that.phone, function() {
                                // ext.doClick(true)
                                api.exchangeCard(giftId, prizeId, wxLogin.userToken, barData.province, barData.city, barData.area, barData.town, barData.barcode, barData.product_id, that.phone).done(
                                    data => {
                                        let type = data.code,
                                            edata = data.data;
                                        ext.doClick(true)
                                        switch (type) {
                                            case 200:
                                                // 兑换成功后  跳转到兑换成功
                                                // ext.linkTo("exchange-success", {
                                                //     prizeId: prizeId,
                                                //     winId: 1
                                                // });
                                                that.isShowPoint = true;
                                                that.isShowPointTxt = '兑换成功';
                                                that.showMask = true;
                                                app.setMainHeight("Point");

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
                            })


                        })
                    )


                },
                /**
                 * 验正输入
                 */
                checkPhone: () => {
                    checkInput()
                },
                /**
                 * @desc 隐藏弹窗
                 */
                hidePopup: function() {
                    // this.showPhone = false;
                    this.showMask = false;
                    this.isShowPoint = false;
                },
                /**
                 * 页面跳转
                 * 
                 * @param {any} url 
                 */
                gotoURL(url) {
                    app.linkTo(url)
                }


            },
            computed: {}

        });




    });

    function checkInput(callback) {
        let inputItem = new val([{
                name: 'phone',
                type: ['required', 'tel'],
                message: {
                    required: '请输入手机号码'
                }
            },
            {
                name: 'rephone',
                type: ['required', 'tel', 'compare|phone'],
                message: {
                    required: '请输入手机号码',
                    compare: '两次输入的手机号码不一样'
                }
            }
        ], function() {
            return callback && callback();
        }, function() {
            ext.doClick(true)
        })
        inputItem.checkAll();
    }




});