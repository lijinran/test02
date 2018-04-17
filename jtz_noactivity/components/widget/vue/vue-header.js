/**
 * VUE 组件 头部组件
 * @description 主要用于共用的头部.并传相应的值
 *
 */
let app = require('common')
let Vue = require('vue');
let Api = require('apiData')
let dialog = require('dialog')

// 注册
Vue.component('my-header', {
    template: `
        <div class="tiphead">
            <header class="header">
                <div class="header-l" @click="goBack" v-show="left"><i class="font-icon andLeft-icon"></i></div>
                <div class="menu-btn" v-if="menu" @click="showSide" :class="{menuactive:isSide}"><p></p><p></p><p></p></div>
                <div class="header-title">{{title}}</div>
                <div class="header-r" v-if="desc" @click="goLinkto('activity-description')">活动规则</div>
                <div class="header-r" v-if="right" @click="Logout">退出登录</div>
            </header>

             <transition name="slide-fade">
                  <div class="side-bar" v-if="isSide">
                         <ul>
                            <li @click="scanQcode"><a class='yanzhen' href="javascript:void(0);"><i class='font-icon liwu-icon'></i><p>扫码验真</p></a></li>
                           <!-- <li><a onclick="javascript:toProductCenter(4);" href="javascript:void(0);"><i class='font-icon productcenter-icon'></i><p>产品风采</p></a></li> -->
                            <li @click="goLinkToCenter"><a class='center' href="javascript:void(0);"><i class='font-icon member-icon'></i><p>个人中心</p></a></li>
                            <li><a @click="goLinkto('weixin')" href="javascript:void(0);"><i class='font-icon weixinx-icon'></i><p>更多关注</p></a></li>
                        </ul>
                    </div>
             </transition>

             <transition name="fade">
                <div v-if="isSide" class="mask" @click="showSide"> </div>
             </transition>

         </div>
        `,
    props: {
        title: String, // 标题
        // 只检测类型
        left: String,
        right: String,
        menu: String,
        desc: String,
        // 检测类型 + 其他验证
        age: {
            type: Number,
            default: 0,
            required: false,
            validator: function(value) {
                return value >= 0
            }
        }
    },
    data: function() {
        return {
            author: "diogo",
            isSide: false
        }
    },
    methods: {
        goBack: function() {
            window.history.back()
        },
        Logout: function() {
            console.log("退出登录")
            let usertoken = app.getValue("userToken", 'local')
            Api.doLoginOut(usertoken).done(
                data => {
                    console.log(data)
                    if (data.code == 200) {
                        app.deleteValue("userToken", 'local')
                        app.linkTo("memberLogin", 1)
                    }

                }
            ).fail(
                data => {
                    console.log(data)
                }
            )
        },
        showSide: function() {
            let vm = this
            vm.isSide = !vm.isSide;
            // console.log(event.currentTarget)


            if (vm.isSide) {
                $(document).bind("touchmove", function(e) {
                    e.preventDefault();
                });
            } else {
                $(document).unbind("touchmove");
            }

        },
        goLinkto: function(str) {
            app.linkTo(str, 1);
        },
        goLinkToCenter: function(str) {
            let userToken = app.getValue("userToken", 'local');
            if (userToken != null) {
                app.linkTo("memberCenter", 1)
            } else {
                app.linkTo("memberLogin", 1)
            }
        },
        /**
         * @desc 扫码验证
         */
        scanQcode: function() {
            let barcode = app.getValue("barcode", 'session');
            // app.linkTo('loading', { barcode: barcode });

            Api.ScanCode(barcode).done(
                data => {
                    let edata = data.data
                    if (data.code == 200) {
                        console.log(data)
                            //存储一些数据
                        app.storeValue("barcodeInfo", JSON.stringify(edata), 'session')
                        app.storeValue("resource", edata.resource, 'session')

                        /**
                         * @desc isCheck ==0 未验真过的
                         */
                        if (edata.isCheck == 0) {
                            if (edata.existPwd == 1) {
                                /**
                                 * @desc 并需要验证码
                                 */
                                app.linkTo("lotteryBefore", { barcode: barcode })
                            } else {
                                /**
                                 * @desc 不需要验正码直接验证
                                 */
                                Api.checkQcode(edata.barcode, null, edata.appId).done(
                                    data => {

                                        if (data.code == 200) {
                                            console.log(data)

                                            app.linkTo("lottery", { barcode: edata.barcode, isFirst: data.data.isFirst })


                                        } else {
                                            dialog.tipDialog(data.msg)
                                        }

                                    }
                                ).fail(
                                    data => {
                                        dialog.tipDialog(data.msg)
                                    }
                                )

                            }

                        } else {

                            console.log("已经验真过,再看看是否已抽奖")
                            Api.checkActivity(barcode, edata.province, edata.city).done(
                                data => {

                                    /**
                                         *  code ==200 活动正常,没有参抽奖
                                         *  code ==2001 有奖品..没有领取
                                         *  code ==2009 奖品已经被领取
                                         *  code ==2002,"活动未开启，敬请期待！"
	                                        code ==2003,"活动未开始，敬请期待！"
                                            code ==2004,"很遗憾，活动已结束！"
                                            code ==2005,"很遗憾，您未中奖！"
                                         */
                                    if (data.code == 200) {
                                        console.log(data)
                                        app.linkTo("lottery", { barcode: barcode, isFirst: 0 })
                                    } else if (data.code == 2001) {
                                        app.storeValue("prizeInfo", JSON.stringify(data.data), 'session')
                                        app.linkTo('yzvirtualResult', { prizeName: data.data.prizeName, prizeType: data.data.prizeType })
                                    } else if (data.code == 2009) {
                                        app.linkTo("received-prize", { integral: true }) // 跳转积分已经被领取界面
                                    } else if (data.code == 2008) {
                                        app.linkTo("received-prizetimeout", 1) // 跳转积分已经被领取界面
                                    } else {
                                        dialog.tipDialog(data.msg)
                                    }


                                }
                            ).fail(
                                data => {
                                    dialog.tipDialog(data.msg)
                                }
                            )


                        }

                    } else {

                        dialog.tipDialog(data.msg)

                    }

                }
            ).fail(
                data => {
                    dialog.tipDialog(data.msg)

                }
            )






        }


    }

})