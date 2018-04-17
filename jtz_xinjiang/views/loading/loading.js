/**
 * Created Dio 2017-6-1 9:40:47
 * */
require(["vue", "common", "extend", "apiData", "dialog", "timeouter"], function(Vue, app, ext, api, dialog, timeouter) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;
    ext.wxIntercept((barData, wxLogin) => {
        // 无扫码数据。与wx登录数据。 则去登录
        // (!barData || !wxLogin) && ext.wxWarranty()

        let vm = new Vue({
            el: "#app",
            data: {
                screenH: HEIGTH,
                captchaNum: '', // 验证码
                captchaArray: [], //
                isErrmsg: false,
                errmsg: "",
                showAddress: false,
                showMask: false, // 蒙板背景
                isShowTip: false, // 显示顶部信息默认
                showTipTxt: '' // 提示语

            },
            mounted: function() {

                DOC.body.style.height = HEIGTH + "px"
                this.getPromptInfo();
            },
            watch: {
                captchaNum: function(n, o) {
                    // console.log(o + "----" + n)

                    //限制用户输入数字
                    let Reg = /^\d+$/
                    if (Reg.test(n)) {

                    } else if (n != '') {
                        vm.captchaNum = o;
                    } else if (n == '') {
                        vm.captchaNum = '';
                    }

                    let na = $.trim(n); //转换 string
                    if (na.length == 6) {
                        var input = DOC.getElementById("userin");
                        input.blur(); //主动失焦
                    }

                    // vm.captchaArray = na.split("")
                    // 当为number类型时
                    // if ($.isNumeric(n)) {
                    //     // let na = n + '';
                    //     // vm.captchaArray = na.split("")

                    //     console.log(n)
                    // } else {
                    //     console.log(o)
                    //     vm.captchaNum = o
                    // }

                }
            },
            filters: {
                // 增加一个过滤方法
                // contrast: function(v, n) {
                //     console.log(v)
                // }

            },
            methods: {
                /**
                 * @desc LostFocus 输入框失去焦点后再进行一次验证
                 */
                disposeIn: function() {
                    console.log('验证数据')

                },
                /**
                 * @desc 提交验真数据
                 */
                doCheck: function() {
                    let _this = this;


                    // console.log(this.captchaNum)
                    // let tit = `<span class='color1'>验真为正品</span>`;
                    // ext.popup(`${tit}`, function() {
                    //         console.log("sure")
                    //     })
                    // 过滤验证码有问题的
                    if (!$.isNumeric(this.captchaNum) || this.captchaNum.length != 6) {
                        dialog.tipDialog("请输入的验证码");
                        return false
                    }
                    // 请求前清理数据
                    _this.isErrmsg = false;
                    _this.errmsg = "";

                    ext.bannedClick(() => {
                        // 验真码
                        api.doCheck(barData.barcode,
                            vm.captchaNum,
                            barData.appId,
                            barData.id,
                            barData.province,
                            barData.city,
                            barData.area,
                            barData.town,
                            wxLogin.userToken,
                            barData.product_id,
                            barData.comId,
                            barData.ip).done(
                            data => {
                                let type = data.code,
                                    edata = data.data;
                                let hTitle, hBody;
                                ext.doClick(true)
                                switch (data.code) {
                                    case 200:


                                        // 存储 giftID
                                        app.storeValue("giftId", edata.cq_gift_id, "local");

                                        if (edata.isFirst || edata.count == 1) {
                                            hTitle = `<h2 class="color1">验真为正品</h2>`;

                                        } else {
                                            hTitle = `<h2 class="color1">第${edata.count}次验真</h2>`;
                                        }

                                        if (!edata.msgInfo && edata.notice) {
                                            hBody = hTitle + "<br/>" + edata.notice
                                        } else if (!edata.notice && edata.msgInfo) {
                                            hBody = hTitle + edata.msgInfo
                                        } else if (!edata.notice && !edata.msgInfo) {
                                            hBody = hTitle
                                        } else {
                                            hBody = hTitle + edata.msgInfo + "<br/>" + edata.notice
                                        }


                                        // 活动未开始
                                        if (edata.actState == "0") {
                                            ext.popup(hBody, function() {
                                                // app.linkTo('ucenter')
                                            })
                                            return false
                                        }


                                        if (edata.actState == "1") {
                                            // 活动结束 跳转到我的礼品
                                            ext.popup(hBody, function() {
                                                app.linkTo('ucenter')
                                            }, 3)
                                        } else {
                                            //活动过程中. 去翻牌
                                            ext.popup(hBody, function() {
                                                app.linkTo('ucenter')
                                            }, 3)
                                        }

                                        break
                                    case 807:
                                        _this.isErrmsg = true;
                                        _this.errmsg = data.msg;
                                        break
                                    case 204:
                                        // 错误过多

                                        ext.popup(data.msg, function() {
                                            console.log("确认")
                                        })
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


                    // this.showAddress = !this.showAddress
                    // this.showMask = !this.showMask
                    // app.setMainHeight("bind-phone")

                    // ext.linkTo("noscan", { "ss": 1123 })

                    // let n = app.d.Compile("123456")
                    // ext.replaceURL('a', n)

                },

                /**
                 * 获取扫码奖励提示
                 */
                getPromptInfo: function() {
                    api.getPromptInfo(wxLogin.userToken, barData.province, barData.city, barData.barcode).done(
                        data => {
                            let type = data.code,
                                edata = data.data;
                            switch (data.code) {
                                case 200:
                                    if (edata.promptInfo) {
                                        vm.isShowTip = true;
                                        vm.showTipTxt = edata.promptInfo;
                                    }
                                    break
                                default:
                                    // data.msg && dialog.tipDialog(data.msg);
                                    break
                            }
                        }
                    )
                },
                /**
                 * @desc 隐藏弹窗
                 */
                hidePopup: function() {
                    this.showAddress = false
                    this.showMask = false
                },
                /**
                 * 兑换福利按钮
                 */
                doSubmitPopup: function() {
                    this.showAddress = false
                    this.showMask = false
                },
                /**
                 * @desc 获取验证码
                 */
                getCode: function() {
                    console.log(0)
                        /**
                         * 倒计时
                         */
                    var Time = new Timeouter({
                        time: 10,
                        dom: '#getCode',
                    })
                    Time.start();
                }


            },
            computed: {


            }

        });
        // end Vue



    });
    // end wxIntercept








});