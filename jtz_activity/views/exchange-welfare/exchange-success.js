/**
 * Created by ljr on 2017/5/31.
 */
require(["vue", "common", "extend", "apiData", "dialog", "validate", "area"], function(Vue, app, ext, api, dialog, val) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;
    ext.wxIntercept((barData, wxLogin, wxinfo) => {
        // 无扫码数据。与wx登录数据。 则去登录
        // (!barData || !wxLogin) && ext.wxWarranty();

        // 从URL上面取奖品信息
        let nPrizeName = ext.getValue('prizeName') || 0,
            nPrizePic = ext.getValue('logoUrl') || 0,
            nWinId = ext.getValue('winId') || 0,
            nPrizeType = ext.getValue('prizeType') || 0;

        !nWinId && ext.backOut();

        // 默认是实物
        let styleBg = 1;
        nPrizeType != 1301 ? styleBg = 2 : '';

        // 卡劵
        let nComment = ext.getValue('comment') || 0, // 说明
            nCouponCode = ext.getValue('couponCode') || 0,
            nExt = ext.getValue('ext') || 0;

        let nPrizeId = ext.getValue('prizeId') || 0;

        let nOrderNo = ext.getValue('orderNo') || "";


        // 从排行榜过来领取空调
        let nForm = ext.getValue('form') || 0; // 重排行榜过来的


        let vm = new Vue({
            el: "#app",
            data: {
                screenH: HEIGTH,
                isflag: 5, //底部菜单的索引index传值
                styleBg: styleBg, //  1.实物，2.卡券 的背景
                ticketResult: 'ticketResult',
                kindResult: 'kindResult',
                redpacketResult: 'redpacketResult',
                jiantou: true,
                contacts: '', // 联系人名称
                contactsPhone: '', // 联系手机号码
                province: '', // 省份
                city: '', //城市
                area: '', //区域
                address: '', // 详细地址
                prizeName: nPrizeName, // 奖品名称
                prizePic: nPrizePic, // 奖品图片
                prizeType: nPrizeType, // 奖品类型
                comment: nComment, // 卡劵说明
                couponCode: nCouponCode, // 劵码
                orderNo: nOrderNo, // 订单
                dateValidFrom: '', // 有效期 从
                dateValidTo: '', //有效期 至
                extUrl: nExt, // 卡劵跳转地址
                form: nForm, // 来源地址
                activityId: '',
                isExchangeOK: false, // 默认没有兑换成功
                isShowComment: true,
                isSubmit: true
            },
            mounted: function() {
                // 获取奖品信息
                this.getPrizeInfo()
            },
            watch: {

                /**
                 * 监听用户输入的手机号
                 * @param n 是新输入
                 * @param o 旧数据
                 */
                contactsPhone: function(n, o) {
                    //限制用户输入数字
                    let Reg = /^\d+$/
                    if (Reg.test(n)) {

                    } else if (n != '') {
                        vm.contactsPhone = o;
                    } else if (n == '') {
                        vm.contactsPhone = '';
                    }

                }
            },

            methods: {

                /**
                 * 
                 * 获取奖品信息
                 */
                getPrizeInfo: function() {
                    console.log(this.orderNo);

                    api.queryPrizeDetailInfo(nPrizeId, wxLogin.userToken, this.orderNo).done(
                        data => {
                            let type = data.code,
                                edata = data.data;
                            switch (type) {
                                case 200:
                                    console.log(edata)
                                    vm.prizeName = edata.prizeName;
                                    vm.prizeType = edata.prizeType;
                                    vm.prizePic = edata.logoUrl;
                                    vm.couponCode = edata.couponCode;
                                    vm.dateValidTo = edata.dateValidTo;
                                    vm.dateValidFrom = edata.dateValidFrom;
                                    vm.comment = edata.comment;
                                    vm.extUrl = edata.couponUrl;
                                    if (!edata.couponUrl) {
                                        vm.extUrl = 0;
                                        dialog.tipDialog("[1001]网络异常");
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
                        }
                    )


                },

                /**
                 * 
                 * 验证手机号是否合法 
                 */
                checkPhone() {
                    checkInput()
                },

                showComment() {
                    this.isShowComment = !this.isShowComment
                },

                /**
                 * 页面跳转
                 * 
                 * @param {any} url 
                 */
                goto(url) {
                    app.linkTo(url)
                },
                /**
                 * 跳转到卡片使用
                 * 
                 */
                gotoExt() {
                    if (vm.extUrl) {
                        window.location.href = vm.extUrl;
                        return false
                    } else {
                        dialog.tipDialog("[1001]网络错误");
                    }

                },
                /**
                 * 
                 * @desc 地址选择 
                 * @param {any} obj 
                 */
                change(obj) {
                    this.province = obj.province;
                    this.city = obj.city;
                    this.area = obj.county;
                },
                toggleFun: function() {
                    this.jiantou = !this.jiantou
                },


                /**
                 * 提交保存地址
                 */
                doSubmit: function() {
                    let _this = this;
                    // 检测数据是否为空
                    !_this.contacts && returnFalse("请输入联系人名称");

                    _this.contacts.length > 20 && dialog.tipDialog("请不要输入太长的名称");

                    !_this.contactsPhone && returnFalse("请输入联系手机号码");
                    !_this.province && returnFalse("请输入省份");
                    !_this.city && returnFalse("请输入城市");
                    !_this.address && returnFalse("请输入详细地址");

                    // 过滤特殊字符
                    if (ext.checkStr(_this.contacts) || ext.checkStr(_this.address)) {
                        dialog.tipDialog("提交的信息中不能包含标点符号，请重新检查");
                        return false
                    }


                    if (!_this.isSubmit) {
                        _this.isSubmit = true
                        return false
                    }

                    // 默认只能点击一次
                    ext.bannedClick(
                        () => {
                            if (_this.form == 'rank') {

                                api.getRankAward(wxLogin.userToken, wxinfo.openid, barData.province, barData.city, _this.contacts, _this.contactsPhone, _this.province, _this.city, _this.area, _this.address, barData.barcode, '', '').done(
                                    data => {
                                        let type = data.code,
                                            edata = data.data;
                                        switch (type) {
                                            case 200:
                                                console.log(edata)
                                                _this.isExchangeOK = true;
                                                break
                                            case 601:
                                                //重新登录  
                                                ext.wxWarranty()
                                                break
                                            default:
                                                data.msg && dialog.tipDialog(data.msg);
                                                break

                                        }

                                        // 有数据回来可开放点击
                                        ext.doClick(true)

                                    }
                                )

                            } else {
                                api.saveAddress(wxLogin.userToken, nWinId, _this.contacts, _this.contactsPhone, _this.address, _this.province, _this.city, _this.area).done(
                                    data => {
                                        let type = data.code,
                                            edata = data.data;
                                        switch (type) {
                                            case 200:
                                                console.log(edata)
                                                _this.isExchangeOK = true;
                                                break
                                            case 601:
                                                //重新登录  
                                                ext.wxWarranty()
                                                break
                                            default:
                                                data.msg && dialog.tipDialog(data.msg);
                                                break

                                        }

                                        // 有数据回来可开放点击
                                        ext.doClick(true)

                                    }
                                )
                            }




                        }
                    )


                }

            },
            computed: {}

        });
        // 返回
        function returnFalse(str) {
            vm.isSubmit = false;
            dialog.tipDialog(str);


        }

    });


    //一些验证的方法
    function checkInput(callback) {
        let inputItem = new val([{
            name: 'contactsPhone',
            type: ['required', 'tel'],
            message: {
                required: '请输入手机号码'
            }
        }], function() {
            return callback && callback();
        })
        inputItem.checkAll();
    }


});