/**
 * Created by ljr on 2017/5/31.
 */
require(["vue", "common", "apiData", "extend", "dialog", "timeouter", "validate", "vue-marquee", 'vue-navmenu', "area"], function(Vue, app, api, ext, dialog, timeouter, validate) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;

    // 上一次获取跑马灯的时间
    let getRollTime = app.getValue('getRollTime', 'local') || 0;
    let srcollList = app.getValue('srcollList', 'local') || 0;

    ext.wxIntercept((barData, wxLogin) => {
        // 无扫码数据。与wx登录数据。 则去登录
        // (!barData || !wxLogin) && ext.wxWarranty()


        let vm = new Vue({
            el: "#app",
            data: {
                screenH: HEIGTH,
                scrollWin: [],
                timeText: 1,
                prizeMenu: [],
                tempPrizeMenu: [], //临时存储
                tempMenu: ["", "", "", "", "", "", "", "", ""],
                isflag: 0, //底部菜单的索引index传值
                isIndex: '', //翻哪张牌
                onlyOne: false, //只能点击一次
                isOpacity: false, //透明
                chance: 0, //机会次数
                animationPublic: 'animationPublic',
                prizeName: '',
                showAddress: false, //地址
                showPhone: false, // 绑定手机
                showPrize: false, //奖品
                showMask: false, // 蒙板背景
                showPrompt: false, // 不再提醒
                showRule: false, //规则
                showShare: false, // 显示分享
                showRank: false, // 显示排行的信息
                showGetRankTxt: '', // thrid 问题
                phone: '',
                code: '',
                contacts: '',
                contactsPhone: '',
                deliveryProvince: '',
                deliveryCity: '',
                deliveryArea: "",
                address: '',
                checked: false,
                comment: '',
                stime: '',
                etime: '',
                nowTime: '',
            },
            mounted: function() {
                let that = this

                //当有跑马灯数据的时候
                if (srcollList) {
                    let lsList = JSON.parse(srcollList);
                    setTimeout(function() {
                        scroll(lsList)
                    }, 200)
                }



                //抽奖机会
                chanceFun();
                //end

                //获取活动信息
                that.getActivityInfo();

                // 获取 JS SDK
                // this.getWXSDK();

                // 延迟100ms
                setTimeout(function() {
                    ext.WX.init();

                    ext.WX.wxs.ready(() => {
                        console.log("object");
                        that.registerShare()
                    })

                    that.checkThird()

                }, 400)


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
                /**
                 * 页面重新初始化
                 */
                startInit: () => {
                    vm.prizeMenu = [];
                    vm.tempPrizeMenu = []; //临时存储
                    vm.isIndex = ''; //翻哪张牌
                    vm.onlyOne = false; //只能点击一次
                    vm.isOpacity = false; //透明

                    app.Loading.show()

                    setTimeout(function() {
                        app.Loading.hide()
                        vm.getActivityInfo();
                        // 获取抽奖机会
                        chanceFun()
                    }, 500);
                    // 刷新活动

                },
                // 活动规则
                ruleFun: function() {
                    vm.showRule = !vm.showRule;
                    vm.showMask = !vm.showMask;
                    app.setMainHeight("ruleId");
                },
                // 分享
                doShare: () => {
                    vm.showShare = !vm.showShare;
                    vm.showMask = !vm.showMask;
                },
                showGetRank: () => {
                    vm.showRank = !vm.showRank;
                    vm.showMask = !vm.showMask;
                    app.setMainHeight("getRank");
                },
                cancelFun: function() {
                    vm.showMask = false;
                    vm.showPrompt = false;
                },
                change(obj) {
                    this.deliveryProvince = obj.province;
                    this.deliveryCity = obj.city;
                    this.deliveryArea = obj.county;
                },
                /**
                 * 获取活动详情
                 */
                getActivityInfo: () => {
                    //活动详情
                    api.queryActivityInfo(barData.barcode, barData.province, barData.city).done(
                        data => {
                            let edata = data.data;
                            switch (data.code) {
                                case 200:
                                    vm.comment = edata.activity.comment;
                                    vm.stime = edata.activity.stime;
                                    vm.etime = edata.activity.etime;
                                    vm.nowTime = edata.now;

                                    // 存储活动信息
                                    app.storeValue('ActivityInfo', JSON.stringify(edata.activity), 'session')

                                    // 服务器的时间大于本地时间则取数据
                                    if (((edata.now - getRollTime) > 180 * 1000) || srcollList == 0) {
                                        //跑马灯
                                        vm.getRolllist(edata);
                                    }
                                    //刷新奖列表
                                    vm.getPrizeList(edata);
                                    //end 

                                    break;
                                case 3101:
                                case 3103:
                                case 3104:
                                    window.location.href = "http://qt.cncqti.com/formal/update.html";
                                    break
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
                /**
                 * 获取奖品列表页
                 */
                getPrizeList: (edata) => {
                    //奖品列表
                    api.queryActivityAwards(edata.activity.id, barData.province, barData.city).done(
                        data => {
                            let pedata = data.data;

                            switch (data.code) {
                                case 200:

                                    vm.prizeMenu = pedata;
                                    vm.prizeMenu.splice(4, 0, {
                                        'name': ''
                                    });
                                    vm.tempPrizeMenu = vm.prizeMenu
                                        // app.storeValue('prizeMenu', JSON.stringify(pedata), 'session')

                                    break;
                                case 601:
                                    //重新登录
                                    ext.wxWarranty()
                                    break;
                                default:
                                    data.msg && dialog.tipDialog(data.msg);
                                    break;
                            }
                        });
                    //end
                },
                isClick: function(Dindex) { //点击翻牌
                    if (this.onlyOne) {
                        //抽奖
                        api.doFpDrwaLottery(wxLogin.userToken, barData.province, barData.city, barData.area, barData.town, barData.product_id, barData.barcode).done(
                                data => {
                                    let eres = data.data;
                                    app.storeValue('PrizeData', JSON.stringify(data.data), 'session');
                                    switch (data.code) {
                                        case 200:
                                            if (eres == null || eres.win == 0) {
                                                dialog.tipDialog('活动奖品库存量不足，请联系客服补充奖品');
                                            } else {
                                                console.log(vm.prizeMenu.length);
                                                console.log(vm.prizeMenu)

                                                vm.isIndex = Dindex + 1;
                                                $(".addtransform").addClass('transformText');
                                                $("#tipDialog").addClass('transformText');
                                                $("#Ulgrid").children('li').addClass('activeNow');
                                                vm.prizeMenu = vm.tempPrizeMenu;
                                                vm.prizeMenu.splice(4, 1); //先删掉按钮
                                                vm.onlyOne = false;
                                                $(vm.prizeMenu).each(function(index, item) {
                                                    if (item.id == eres.awardId) {
                                                        vm.prizeMenu.splice(index, 1); //先删掉当前选中的奖品
                                                        vm.prizeMenu.sort(randomsort); //其余的再打乱

                                                        if (vm.isIndex < 5) { //插入按钮前
                                                            vm.prizeMenu.splice(vm.isIndex - 1, 0, item); //再加进当前位置
                                                            vm.prizeMenu.splice(4, 0, {
                                                                'name': ''
                                                            });

                                                        } else {
                                                            //插入按钮后

                                                            vm.prizeMenu.splice(vm.isIndex - 2, 0, item); //再加进当前位置
                                                            vm.prizeMenu.splice(4, 0, {
                                                                'name': ''
                                                            });
                                                        }

                                                    }
                                                });
                                                //抽奖机会
                                                chanceFun();
                                                //抽奖机会
                                                setTimeout(function() {
                                                    vm.prizeName = eres.prizeName;
                                                    vm.showPrize = !vm.showPrize;
                                                    vm.showMask = !vm.showMask;
                                                    app.setMainHeight("get-prize");
                                                }, 1200)
                                            }

                                            break;
                                        case 3101:
                                        case 3103:
                                        case 3104:
                                            window.location.href = "http://qt.cncqti.com/formal/update.html";
                                            break
                                        case 601:
                                            //重新登录
                                            ext.wxWarranty();
                                            break;
                                        default:
                                            data.msg && dialog.tipDialog('网络异常，请稍候再试！');
                                            break;
                                    }
                                })
                            //end
                    } else {
                        return false;
                    }

                },
                startFun: function() { //开始翻牌
                    if (this.chance > 0) {
                        //是否显示弹窗不再提醒
                        api.getUserInfo(wxLogin.userToken).done(
                            data => {
                                switch (data.code) {
                                    case 200:
                                        if (!data.data.noticeFlag) { // 提醒
                                            vm.showPrompt = !vm.showPrompt;
                                            vm.showMask = !vm.showMask;
                                            app.setMainHeight("noPrompt");
                                        } else { //已经绑定则去领奖
                                            this.onlyOne = true;
                                            this.isOpacity = true;
                                            $('.animationPublic').css('-webkit-animation-play-state', 'running!important');
                                            setTimeout(function() {
                                                vm.prizeMenu = vm.tempMenu
                                            }, 300)

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
                        );
                        //end
                    }
                },
                PromptFun: function() { //确定不再提醒
                    if (this.checked) {
                        api.noPrompt(1, wxLogin.userToken).done(data => {
                            if (data.code == 200) {}
                        });
                    }
                    vm.showPrompt = !vm.showPrompt;
                    vm.showMask = !vm.showMask;
                    this.onlyOne = true;
                    this.isOpacity = true;
                    $('.animationPublic').css('-webkit-animation-play-state', 'running!important');

                },
                /**
                 * @desc 隐藏弹窗
                 */
                hidePopup: function() {
                    this.showAddress = false;
                    this.showPrize = false;
                    this.showPhone = false;
                    this.showMask = false;
                    this.showPrompt = false;
                    this.showRule = false;
                    this.showShare = false;
                    this.showRank = false;
                },
                hidePopupPrize: function() {
                    this.showAddress = false;
                    this.showPrize = false;
                    this.showPhone = false;
                    this.showMask = false;
                    this.showPrompt = false;
                    this.showRule = false;

                    // window.location.reload();
                    this.startInit()
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
                /**
                 * @desc 领奖
                 */
                getPrizeFun: function() {
                    //先判断有没绑定手机号码
                    api.getUserInfo(wxLogin.userToken).done(
                            data => {
                                switch (data.code) {
                                    case 200:
                                        if (!data.data.phone) { //没绑定则去绑定
                                            vm.showPrize = !vm.showPrize;
                                            vm.showPhone = !vm.showPhone;
                                            app.setMainHeight("bind-phone");
                                        } else { //已经绑定则去领奖
                                            getPrize()
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
                        //end
                },
                bindPhoneFun: function() { //绑定手机号
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
                                        getPrize(); //去领奖
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
                getKindFun: function() { //领取实物
                    let $PrizeData = app.getValue("PrizeData", "session"),
                        _PrizeData = JSON.parse($PrizeData);
                    const rtel = /^1[345678]\d{9}$/;

                    if (vm.contacts == '') {
                        dialog.tipDialog('请输入收货人！');
                    } else if (vm.contactsPhone == '') {
                        dialog.tipDialog('请输入联系电话！');
                    } else if (!rtel.test(vm.contactsPhone)) {
                        dialog.tipDialog('请输入正确的手机号码！');
                    } else if (vm.deliveryProvince == '') {
                        dialog.tipDialog('请选择省份！');
                    } else if (vm.deliveryCity == '') {
                        dialog.tipDialog('请选择城市！');
                    } else if (vm.address == '') {
                        dialog.tipDialog('请输入详细地址！');
                    } else {
                        api.award(_PrizeData.winId, wxLogin.userToken, vm.contacts, vm.contactsPhone, vm.address, vm.deliveryProvince, vm.deliveryCity, vm.deliveryArea).done(data => {
                            switch (data.code) {
                                case 200:
                                    ext.linkTo('result', {
                                        styleBg: 1,
                                        prizeName: _PrizeData.prizeName,
                                        logoUrl: _PrizeData.logoUrl
                                    });
                                    break;
                                case 601:
                                    //重新登录
                                    ext.wxWarranty()
                                    break;
                                default:
                                    data.msg && dialog.tipDialog(data.msg);
                                    break;
                            }
                        })
                    }
                },
                /**
                 * 分享成功后增加抽奖的机会
                 */
                doAddFpChange: () => {
                    api.doAddShare(wxLogin.userToken, barData.barcode, barData.province, barData.city).done(
                        res => {
                            console.log(res);
                            vm.hidePopup();
                            if (res.code == 200) {
                                dialog.tipDialog("分享成功")
                                chanceFun();
                            }

                        }
                    )
                },
                /**
                 * 注册分享机会
                 */
                registerShare: () => {

                    // 分享到朋友圈
                    ext.WX.wxs.onMenuShareTimeline({
                        title: th.shareTitle, // 分享标题
                        link: th.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: th.shareImg, // 分享图标
                        success: function() {
                            // 用户确认分享后执行的回调函数
                            console.log("succ");
                            vm.doAddFpChange();
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                            dialog.tipDialog("取消分享");
                        }
                    });

                    ext.WX.wxs.onMenuShareAppMessage({
                        title: th.shareTitle, // 分享标题
                        desc: th.shareDesc, // 分享描述
                        link: th.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: th.shareImg, // 分享图标
                        type: 'link', // 分享类型,music、video或link，不填默认为link
                        success: function() {
                            // 用户确认分享后执行的回调函数
                            vm.doAddFpChange();
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                            dialog.tipDialog("取消分享");
                        }
                    });



                },
                /**
                 * 查询总排行榜第三名变化情况
                 */
                checkThird: () => {
                    api.queryThirdChange(wxLogin.userToken, barData.barcode, barData.province, barData.city).done(
                        res => {
                            console.log(res);
                            if (res.code == 200) {
                                console.log("ss");
                                if (res.data.openMsg) {
                                    vm.showGetRankTxt = res.data.openMsg;
                                    vm.showGetRank();
                                }


                            }
                        }
                    )

                },
                /**
                 * 跑马灯的效果
                 */
                getRolllist: (edata) => {
                    //跑马灯
                    api.querySrcollList(edata.activity.id, barData.province, barData.city).done(
                        data => {
                            switch (data.code) {
                                case 200:
                                    scroll(data.data);
                                    // 存储数组
                                    app.storeValue('srcollList', JSON.stringify(data.data), 'local')
                                        // 存储请求的时间
                                    app.storeValue('getRollTime', edata.now, 'local')
                                    break;
                                default:
                                    break;
                            }
                        });
                    //end
                }

            },

            computed: {}

        });
        // end Vue
        //打乱数组
        function randomsort(a, b) {
            return Math.random() > .5 ? -1 : 1; //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
        }
        //抽奖机会
        function chanceFun() {
            api.queryDrawLotteryChance(wxLogin.userToken).done(
                data => {
                    switch (data.code) {
                        case 200:
                            vm.chance = data.data;
                            break;
                        case 601:
                            //重新登录
                            ext.wxWarranty()
                            break;
                        default:
                            data.msg && dialog.tipDialog(data.msg);
                            break;
                    }
                })
        }
        //头部滚动
        function scroll(arr) {
            if ($.isArray(arr) && arr.length > 0) {
                var Winlist = arr.map(function(item, index) {
                    if (!item['phone']) {
                        let obj = "未知";
                        return "恭喜" + "<span class='colorfff'>" + obj + "</span>" + "获得" + "<span class='colorfff'>" + item["prizeName"] + "</span>";
                    } else {
                        var phone = item['phone'].substring(0, 3) + "****" + item['phone'].substring(7, 11);
                        return "恭喜" + "<span class='colorfff'>" + phone + "</span>" + "获得" + "<span class='colorfff'>" + item["prizeName"] + "</span>";
                    }
                });
                vm.scrollWin = Winlist;
            } else if (arr == 1) {
                vm.scrollWin = ['活动已结束'];
            } else {
                vm.scrollWin = ['暂无中奖数据'];
            }
        }
        //领奖
        function getPrize() {
            let $PrizeData = app.getValue("PrizeData", "session"),
                _PrizeData = JSON.parse($PrizeData);
            if (_PrizeData.prizeType == 1301) { //实物
                vm.showAddress = !vm.showAddress;
                vm.showPhone = false;
                vm.showPrize = false;
                app.setMainHeight("bind-address");
            } else if (_PrizeData.prizeType == 1314) { //红包
                api.award(_PrizeData.winId, wxLogin.userToken, '', '', '', '', '', '').done(data => {
                    switch (data.code) {
                        case 200:
                            ext.linkTo('result', {
                                styleBg: 2,
                                prizeName: _PrizeData.prizeName,
                                prizeValue: _PrizeData.prizeValue
                            });
                            break;
                        case 601:
                            //重新登录
                            ext.wxWarranty()
                            break;
                        default:
                            data.msg && dialog.tipDialog(data.msg);
                            break;
                    }
                })

            } else if (_PrizeData.prizeType == 1311) { //礼包
                ext.linkTo('result', {
                    styleBg: 3,
                    prizeName: _PrizeData.prizeName,
                    prePrizeId: _PrizeData.prizeId
                });
            }
        }
    });
    // end wxIntercept

});