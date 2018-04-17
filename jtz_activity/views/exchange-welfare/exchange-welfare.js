/**
 * Created by ljr on 2017/5/31.
 */
require(["vue", "common", "apiData", "dialog", "extend", "timeouter", "vue-marquee", 'vue-navmenu'], function(Vue, app, api, dialog, ext, timeouter) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;
    let giftId = app.getValue("giftId", "local");
    let vapp;
    let srcollList = app.getValue('srcollList', 'local') || 0;

    let headPortrait = "static/" + __uri("../../components/common/images/headPortrait.png");
    ext.wxIntercept((barData, wxLogin) => {
        // 无扫码数据。与wx登录数据。 则去登录
        // (!barData || !wxLogin) && ext.wxWarranty();

        let vm = new Vue({
            el: "#app",
            data: {
                screenH: HEIGTH,
                scrollWin: [],
                timeText: 1,
                isflag: 1, //底部菜单的索引index传值
                userpic: headPortrait,
                nickname: '', //昵称
                userphone: '',
                cqJnkpValue: 0, //福利卡片
                phone: '',
                code: '',
                showMask: false,
                showPhone: false,
                cqJnkptList: [], // 卡片兑换列表
                isShowgetMore: false,
                total: '', // 总数量
                nextPage: 1, //下一页
                pageSize: 10, // 页面数量
                pageNum: 1, // 当前页面
                isShowNoPoint: false, // 是否显示公共 错误弹窗
                isShowNoPointTxt: '', //  错误弹窗文字
                isGetTicket: false, //领奖的时候没绑定手机则绑定后直接跳转兑换卡券
            },
            mounted: function() {
                vapp = this;

                //当有跑马灯数据的时候
                if (srcollList) {
                    let lsList = JSON.parse(srcollList);
                    setTimeout(function() {
                        scroll(lsList)
                    }, 200)
                }

                //活动详情
                // api.queryActivityInfo(barData.barcode, barData.province, barData.city).done(
                //     data => {
                //         let edata = data.data;
                //         switch (data.code) {
                //             case 200:
                //                 // 存储活动信息
                //                 app.storeValue('ActivityInfo', JSON.stringify(edata.activity), 'session')
                //                 //跑马灯
                //                 api.querySrcollList(edata.activity.id,barData.province, barData.city).done(
                //                     data => {
                //                         switch (data.code) {
                //                             case 200:
                //                                 scroll(data.data);
                //                                 break;
                //                             default:
                //                                 break;
                //                         }
                //                     });
                //                 //end
                //                 break;
                //                  case 3101:
                //                  case 3103:
                //                  case 3104:
                //                  window.location.href = "http://qt.cncqti.com/formal/update.html";
                //                   break
                //             case 601:
                //                 //重新登录
                //                 ext.wxWarranty();
                //                 break;
                //             default:
                //                 data.msg && dialog.tipDialog(data.msg);
                //                 break;
                //         }
                //     });




                //end
                //个人信息
                getUserInfo();
                //end

                //获取兑换列表
                this.getExchangeList()



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
                code: function(n, o) {
                    //限制用户输入数字
                    let Reg = /^\d+$/
                    if (Reg.test(n)) {

                    } else if (n != '') {
                        vm.code = o;
                    } else if (n == '') {
                        vm.code = '';
                    }

                },

            },
            methods: {
                //弹绑定手机号码
                doBindPhone: function() {
                    let _this = this;
                    _this.showMask = true;
                    _this.showPhone = true;
                    app.setMainHeight("bind-phone")
                },
                /**
                 * @desc 获取验证码
                 */
                getCode: function() {
                    const rtel = /^1[345678]\d{9}$/;
                    if (vm.phone == '') {
                        dialog.tipDialog('请输入手机号码！');
                    } else if (!rtel.test(vm.phone)) {
                        dialog.tipDialog('请输入正确的手机号码！');
                    } else {
                        api.sendMessage(vm.phone, 'yz').done(
                            data => {
                                // 提示信息
                                data.msg && dialog.tipDialog(data.msg);
                            }
                        );

                        var Time = new Timeouter({
                            time: 60,
                            dom: '#getCode',
                        })
                        Time.start();
                    }
                },
                bindPhoneFun: function(e) { //绑定手机号
                    const rtel = /^1[345678]\d{9}$/;
                    if (vm.phone == '') {
                        dialog.tipDialog('请输入手机号码！');
                    } else if (!rtel.test(vm.phone)) {
                        dialog.tipDialog('请输入正确的手机号码！');
                    } else if (vm.code == '') {
                        dialog.tipDialog('请输入验证码！');
                    } else {
                        api.bindPhone(vm.phone, vm.code, 'yz', wxLogin.userToken).done(
                            data => {
                                switch (data.code) {
                                    case 200:
                                        if (e) {
                                            const $GiftId = app.getValue('ticGiftId', 'session'),
                                                $PrizeId = app.getValue('ticPrizeId', 'session');
                                            ext.linkTo("exchange-ticket", {
                                                prizeId: $PrizeId,
                                                giftId: $GiftId
                                            });
                                        } else {
                                            getUserInfo();
                                            window.location.reload();
                                        }

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
                        )
                    }
                },
                /**
                 * @desc 隐藏弹窗
                 */
                hidePopup: function() {
                    this.showPhone = false;
                    this.showMask = false;
                    this.isShowNoPoint = false;
                },
                /**
                 * 兑换卡劵
                 */
                doExchangeCard: function(el) {
                    app.storeValue('ticPrizeId', el.id, 'session');
                    app.storeValue('ticGiftId', el.giftId, 'session');
                    let _this = this;
                    !el && dialog.tipDialog("[1002]兑换信息错误")

                    // 当cardNum ==0 时
                    el.cardNum = el.cardNum == 0 ? 1 : el.cardNum;




                    if (!_this.cqJnkpValue || _this.cqJnkpValue < el.cardNum) {
                        //用户积分不足, 无法兑换
                        this.isShowNoPoint = true;
                        this.isShowNoPointTxt = '福利卡片数量不足,无法兑换';
                        this.showMask = true;
                        app.setMainHeight("noPoint");
                        return false;

                    } else if (!_this.userphone) {
                        //没绑定手机就去绑定
                        _this.showMask = true;
                        _this.showPhone = true;
                        app.setMainHeight("bind-phone");
                        vm.isGetTicket = true;
                        return false;
                    }



                    //话费 
                    if (el.type == 130301) {

                        // 当总库存不够的时候
                        if (el.residue < 1) {
                            this.isShowNoPoint = true;
                            this.isShowNoPointTxt = '该礼品已兑换完<br/>请选择其他礼品';
                            this.showMask = true;
                            app.setMainHeight("noPoint");
                            return false;

                        } else if (el.dayResidue < 1) {
                            this.isShowNoPoint = true;
                            this.isShowNoPointTxt = '今日可兑换份数已领完<br/>请明天再来';
                            this.showMask = true;
                            app.setMainHeight("noPoint");
                            return false;
                        }

                        // 所有都正常
                        try {
                            ext.linkTo("exchange-call", {
                                prizeId: el.id,
                                cardNum: el.cardNum,
                                giftId: el.giftId
                            });
                        } catch (error) {
                            console.log(error);
                        }


                    } else {
                        ext.linkTo("exchange-ticket", {
                            prizeId: el.id,
                            giftId: el.giftId
                        });
                    }





                    /*api.exchangeCard(el.giftId, el.id, wxLogin.userToken, barData.province, barData.city, barData.area,barData.town, 1).done(
                        data => {
                            let type = data.code,
                                edata = data.data;
                            switch (type) {
                                case 200:
                                    // 更新用户数据
                                    getUserInfo();
                                    let obj = new Object();
                                    obj = edata;
                                    obj.logoUrl = edata.prizePic;

                                    // 兑换成功后  跳转到兑换成功
                                    ext.linkTo("exchange-result", obj);
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
                                    //data.msg && dialog.tipDialog(data.msg);
                                    break

                            }
                        }
                    )*/
                },
                /**
                 * 获取兑换列表
                 */
                getExchangeList: () => {

                    //卡券列表
                    api.queryGifList(giftId, vapp.nextPage, vapp.pageSize, barData.barcode, barData.province, barData.city).done(
                        data => {
                            let edata = data.data;
                            switch (data.code) {
                                case 200:

                                    if (vm.nextPage == 1) {
                                        vm.cqJnkptList = edata.list;
                                    } else {
                                        vm.cqJnkptList = vm.cqJnkptList.concat(edata.list)
                                            // console.log(_vm.exchangeList)
                                    }
                                    // 是否显示更多
                                    if (edata.pages == edata.pageNum) {
                                        vm.isShowgetMore = false;
                                        vm.nextPage = 1;
                                    } else {
                                        vm.nextPage = edata.nextPage;
                                        vm.isShowgetMore = true;
                                    }
                                    break
                                case 601:
                                    //重新登录
                                    ext.wxWarranty()
                                    break
                                default:
                                    data.msg && dialog.tipDialog(data.msg);
                                    break

                            }
                        })

                },
                /**
                 * 获取更新信息
                 */
                getMore: () => {
                    vapp.getExchangeList()

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
        //获取用户信息
        function getUserInfo() {
            api.getUserInfo(wxLogin.userToken).done(
                data => {
                    switch (data.code) {
                        case 200:
                            vm.userpic = data.data.headImgUrl || headPortrait;
                            vm.nickname = data.data.nickname;
                            vm.userphone = data.data.phone || '';
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