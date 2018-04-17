/**
 * Created by ljr on 2017/5/31.
 */
require(["vue", "common", "apiData", "dialog", "extend", "timeouter", "vue-marquee", 'vue-navmenu', "area"], function(Vue, app, api, dialog, ext, timeouter) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;
    // 跑马灯的一些参数
    let getRollTime = app.getValue('getRollTime', 'local') || 0;
    let srcollList = app.getValue('srcollList', 'local') || 0;

    // 加载更多
    // let more = new loadmore()
    let headPortrait = "static/" + __uri("../../components/common/images/headPortrait.png");
    // console.log(more);
    ext.wxIntercept((barData, wxLogin) => {
        // 无扫码数据。与wx登录数据。 则去登录
        // (!barData || !wxLogin) && ext.wxWarranty()

        let vm = new Vue({
            el: "#app",
            data: {
                screenH: HEIGTH,
                scrollWin: [],
                timeText: 1,
                isflag: 2, //底部菜单的索引index传值
                isActive: false, //切换
                cutBtnGray: 'cutBtnGray',
                yiList: [], //已经领取
                weiList: [], // 未领取
                userpic: headPortrait,
                nickname: '', //昵称
                userphone: '',
                cqJnkpValue: 0, //福利卡片
                showPhone: false,
                showAddress: false,
                showMask: false,
                isGetPrize: false, //领奖的时候没绑定手机则绑定后直接跳转领取
                phone: '',
                code: '',
                contacts: '',
                contactsPhone: '',
                deliveryProvince: '',
                deliveryCity: '',
                deliveryArea: "",
                address: '',
                pageSize: 10, // 页面数量
                tab1nextPage: 1, // tab1下一页
                tab1pageNum: 1, // tab1当前页面
                tab1More: false, // 加载更多
                tab2nextPage: 1,
                tab2pageNum: 1,
                tab2More: false,
                activityId: ''

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

                getUserInfo()
                    //活动详情
                api.queryActivityInfo(barData.barcode, barData.province, barData.city).done(
                    data => {
                        let edata = data.data;
                        switch (data.code) {
                            case 200:
                                vm.comment = edata.activity.comment;
                                vm.stime = edata.activity.stime;
                                vm.etime = edata.activity.etime;
                                vm.activityId = edata.activity.id;
                                vm.nowTime = edata.now;
                                //获取未领取列表
                                setTimeout(that.getNoGainList, 200);
                                // 存储活动信息
                                app.storeValue('ActivityInfo', JSON.stringify(edata.activity), 'session')

                                // 服务器的时间大于本地时间则取数据 3分钟再取数据
                                if (((edata.now - getRollTime) > 3 * 60 * 1000) || srcollList == 0) {
                                    //跑马灯
                                    that.getRolllist(edata);
                                }
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
                contactsPhone: function(n, o) {
                    //限制用户输入数字
                    let Reg = /^\d+$/
                    if (Reg.test(n)) {

                    } else if (n != '') {
                        vm.contactsPhone = o;
                    } else if (n == '') {
                        vm.contactsPhone = '';
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
                 * tab 切换
                 */
                tabChange: (e) => {

                    if (e == 1) {
                        vm.isActive = false;
                        vm.getNoGainList()
                    } else {
                        vm.isActive = true;
                        vm.getGainList();
                    }
                },
                /**
                 * Async 地址
                 * @param {any} obj 
                 */
                change(obj) {
                    this.deliveryProvince = obj.province;
                    this.deliveryCity = obj.city;
                    this.deliveryArea = obj.county;
                },
                /**
                 * 查看奖品详情
                 */
                getDetails: function(el) {

                    ext.linkTo("exchange-success", {
                        prizeId: el.prize_id,
                        orderNo: el.order_no,
                        winId: 1
                    });
                },
                GetFun: function() {
                    this.isActive = true;

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
                        // 过滤特殊字符
                        if (ext.checkStr(vm.contacts) || ext.checkStr(vm.address)) {
                            dialog.tipDialog("提交的信息中不能包含标点符号，请重新检查");
                            return false
                        }

                        api.award(_PrizeData.id, wxLogin.userToken, vm.contacts, vm.contactsPhone, vm.address, vm.deliveryProvince, vm.deliveryCity, vm.deliveryArea).done(data => {
                            switch (data.code) {
                                case 200:
                                    ext.linkTo('result', {
                                        styleBg: 1,
                                        prizeName: _PrizeData.prize_name,
                                        logoUrl: _PrizeData.logo_url
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
                getPrizeFun: function(el) {
                    app.storeValue('PrizeData', JSON.stringify(el), 'session');

                    if (!vm.userphone) { //没绑定则去绑定
                        vm.showMask = true;
                        vm.showPhone = !vm.showPhone;
                        app.setMainHeight("bind-phone");
                        vm.isGetPrize = true;
                    } else { //已经绑定则去领奖
                        getPrize()
                    }



                },
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
                                            getPrize()
                                        } else {
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
                    this.showAddress = false;
                },
                /**
                 * 跑马灯的效果
                 */
                getRolllist: (edata) => {

                    // 当抽奖活动时间已经结束 
                    if (edata.activity.etime < edata.now) {
                        let e = 1;
                        app.storeValue('srcollList', e, 'local')

                        return false
                    }
                    //跑马灯
                    api.querySrcollList(edata.activity.id,barData.province, barData.city).done(
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
                },
                /**
                 * 获取已经领取记录
                 */
                getGainList: () => {
                    //领奖记录
                    api.queryUserGainList(wxLogin.userToken, vm.tab2nextPage, vm.pageSize, vm.activityId).done(
                        data => {
                            let edata = data.data;
                            switch (data.code) {
                                case 200:
                                    // vm.yiList = edata.list || '';
                                    if (vm.tab2nextPage == 1) {
                                        vm.yiList = edata.list || '';
                                    } else {
                                        vm.yiList = vm.yiList.concat(edata.list)
                                    }

                                    // 是否显示更多
                                    if (edata.pages == edata.pageNum) {
                                        vm.tab2More = false;
                                        vm.tab2nextPage = 1;
                                    } else {
                                        vm.tab2nextPage = edata.nextPage;
                                        vm.tab2More = true;
                                    }


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
                /**
                 * 获取用未领取的记录
                 */
                getNoGainList: () => {
                    //未领取
                    api.queryScDrowRecords(wxLogin.userToken, vm.tab1nextPage, vm.pageSize, vm.activityId).done(
                        data => {
                            let edata = data.data;
                            switch (data.code) {
                                case 200:
                                    // vm.weiList = edata || '';

                                    if (vm.tab1nextPage == 1) {
                                        vm.weiList = edata.list || '';
                                    } else {
                                        vm.weiList = vm.weiList.concat(edata.list)
                                    }

                                    // 是否显示更多
                                    if (edata.pages == edata.pageNum) {
                                        vm.tab1More = false;
                                        vm.tab1nextPage = 1;
                                    } else {
                                        vm.tab1nextPage = edata.nextPage;
                                        vm.tab1More = true;
                                    }


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
                /**
                 * 获取更新信息
                 */
                getTabMore: (e) => {
                    if (e == 1) {
                        vm.getNoGainList()
                    } else {
                        vm.getGainList()
                    }

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
        //领奖
        function getPrize() {
            let $PrizeData = app.getValue("PrizeData", "session"),
                _PrizeData = JSON.parse($PrizeData);

            if (_PrizeData.prize_type == 1301) { //实物
                vm.showAddress = !vm.showAddress;
                vm.showMask = true;
                vm.showPhone = false;
                app.setMainHeight("bind-address");
            } else if (_PrizeData.prize_type == 1314) { //红包
                api.award(_PrizeData.id, wxLogin.userToken, '', '', '', '', '', '').done(data => {
                    switch (data.code) {
                        case 200:
                            ext.linkTo('result', {
                                styleBg: 2,
                                prizeName: _PrizeData.prize_name,
                                prizeValue: _PrizeData.prize_value
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

            } else if (_PrizeData.prize_type == 1311) { //礼包
                ext.linkTo('result', {
                    styleBg: 3,
                    prizeName: _PrizeData.prize_name,
                    prePrizeId: _PrizeData.prize_id
                });
            }
        }

    });
});