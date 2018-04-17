/**
 * @desc 一些公共方法
 * Created Dio 2017-6-1 9:40:47
 */
// 变量申明
let app = require('common'),
    dialog = require('dialog'),
    // api = require('api'),
    logintimes = 0,
    tiptimes = 0,
    off = false; // 用来控制点击事件

let debug = true; // 是否开启调试

/**
 * @desc 一些过滤方法
 * Created Dio 2017年9月15日14:13:57
 * 
 */
let Vue = require('vue')

//格式时间
Vue.filter('gettime', function (str) {
    var date = new Date(parseInt(str));
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return date.getFullYear() + '年' + month + "月" + day + "日";
});

// 格式化时间2
Vue.filter('format', function (str) {
    if (str) {
        return new Date(str).format()
    }
});
Vue.filter('newformat', function (str) {
    if (str) {
        return new Date(str * 1000).format("yyyy-MM-dd HH:mm:ss")
    }
})
// 格式化活动时间 
Vue.filter('actTime', function (str) {
    if (str) {
        return new Date(str).format("MM月dd日")
    }
})

// ---end

/**
 * WSJS SDK
 * 
 */
let api = require('apiData');
let wxs = require('WX');
let doWX = {
    // 微信的初始化方法
    init: () => {
        let url = window.location.href; // 当前页的面url
        api.getWXSDK(url).done(
            res => {
                wxs.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.data.appId, // 必填，公众号的唯一标识
                    timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
                    signature: res.data.signature, // 必填，签名，见附录1
                    jsApiList: ["getLocation", "showMenuItems", "hideMenuItems", "onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wxs.ready(function () {
                    // 先显示可分享的按钮
                    wxs.showMenuItems({
                        menuList: ["menuItem:share:timeline", "menuItem:share:appMessage"] // 要显示的菜单项，所有menu项见附录3
                    });

                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    wxs.hideMenuItems({
                        menuList: ["menuItem:share:brand", "menuItem:share:email", "menuItem:openWithSafari", "menuItem:openWithQQBrowser", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:QZone", "menuItem:editTag", "menuItem:delete", "menuItem:originPage", "menuItem:readMode"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });



                });


                wxs.error(function (res) {
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    console.log("config error");
                });
            }
        )
    },
    // 微信的一些方法
    wxs: wxs
}



//扩展方法
let extend = {
    /**
     * 版本号
     */
    version: "0.0.3",
    WX: doWX, // 一些微信的接口操作
    // gnote: { lng: "", lat: "" },
    /**
     * HTML5 浏览器的定位
     */
    geolocation: function () {
        let _this = this
        // let obj = navigator.geolocation.getCurrentPosition(showPosition);

        function showPosition(position) {
            let lng = position.coords.longitude;
            let lat = position.coords.latitude;
            console.log(_this)
            _this.gnote = {
                lng: lng,
                lat: lat
            }

            // var url = `http://api.map.baidu.com/geocoder/v2/?ak=mGaWIHAYzolxcE6hCNwDM4K6mFpyzyaf&location=${lat},${lng}&output=json&pois=1`;
            // $.getJSON(url, function(res) {
            //     // $("#msg").html(url);
            //     // alert(res.result.addressComponent.city);
            //     console.log(res)
            //     alert(11)
            // });
        }
        // return true;
        // var map = new BMap.Map("allmap");
        // var point = new BMap.Point(116.331398, 39.897445);
        // map.centerAndZoom(point, 12);
        var geolocation = new BMap.Geolocation();

        var geocoder = new BMap.Geocoder();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                // var mk = new BMap.Marker(r.point);
                // map.addOverlay(mk);
                // map.panTo(r.point);
                console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
                geocoder.getLocation(r.point, function (res) {
                    console.log(res)
                }, 1)
            } else {
                alert('failed' + this.getStatus());
            }
        }, {
            enableHighAccuracy: true
        })

    },
    /**
     * 左上角返回按钮
     */
    backOut: () => {
        window.history.back();
        return false;
    },
    /**
     * 弹窗提示框
     * @param {string} msg  内容
     * @param {function} sureFunction 点击确定 function
     * @param {number} type 类型
     */
    popup: function (msg, sureFunction, type) {
        let btnMsg, btnClass, btnClassEle;
        // 类型
        switch (type) {
            case 1:
                btnMsg = "去翻牌";
                btnClass = 'ui-btnDialogGo';
                btnClassEle = `.${btnClass}`;
                break;
            case 2:
                btnMsg = "兑换福利";
                btnClass = 'ui-btnDialogGo';
                btnClassEle = `.${btnClass}`;
                break;
            case 3:
                btnMsg = "查看礼品";
                btnClass = 'ui-btnDialogGo';
                btnClassEle = `.${btnClass}`;
                break;
            default:
                btnMsg = "确定";
                btnClass = 'ui-btnDialogSureBtn';
                btnClassEle = `.${btnClass}`;
        }
        // 弹窗
        let _popup = dialog.dialog({
            id: "btnDialog",
            className: "ui-btnDialog",
            bgSwitch: true,
            closeSwitch: false,
            bgFn: false,
            content: `<div class='ui-btnDialog-con'>${msg}</div>`,
            footer: [{
                name: `${btnMsg}`,
                className: `${btnClass}`
            }],
            blindEvent: [{
                ele: `${btnClassEle}`,
                type: "click",
                fn: function () {
                    _popup.close(sureFunction);
                }
            }]
        });
        _popup.open()
    },
    /**
     *  微信浏览器检测与登录数据回调
     * @param {type}    用来是否重新授权
     * @param {callback} 回调函数  带 二维码数据与 微信登录数据
     */
    wxIntercept: function (callback, type = 1) {
        let ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            let barData = app.getValue('barcodeData', 'session'),
                wxInfo = app.getValue('wxInfo', 'local'),
                wxLogin = app.getValue('wxLogin', 'local');
            barData = barData && JSON.parse(barData);
            wxLogin = wxLogin && JSON.parse(wxLogin);
            wxInfo = wxInfo && JSON.parse(wxInfo);

            // 统一限制
            if ((!barData || !wxLogin) && type == 1) {
                this.wxWarranty()
            } else {
                return callback && callback(barData, wxLogin, wxInfo);
            }

        } else {
            app.linkTo('noscan');
            return false;
        }
    },
    /**
     * 微信回调地址
     * @param {appid} 项目微信的APPID
     * @param {redirectUri} 回调地址
     */
    wxWarranty: function (appId, redirectUri) {
        // 存储返回路径
        app.storeValue("url", window.location.pathname, "session");
        let wappId = appId || window.th.wappId,
            hosturl = (location.origin || (location.protocol + '//' + location.hostname)),
            wredirectUri = redirectUri || `${window.th.Domain}?${hosturl}${window.th.callPage}`;
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wappId}&redirect_uri=${wredirectUri}&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect`;
        return false;
    },
    /**
     * 不支持 170 与171 号码的充值
     */
    getCheckout: (phone, callback) => {
        let rel = /^(170|171)\d{8}$/;
        if (rel.test(phone)) {
            dialog.tipDialog('该号段暂不支持充值，请重新填写');
            off = false;
            return false;
        }
        return callback && callback();
    },
    /**
     * 辅助改变url
     *
     * @param {any} url 目标url
     * @param {any} arg 需要替换的参数名称
     * @param {any} arg_val  替换后的参数的值
     * @returns url 参数替换后的url
     */
    changeURLArg: function (url, arg, arg_val) {
        var pattern = arg + '=([^&]*)';
        var replaceText = arg + '=' + arg_val;
        if (url.match(pattern)) {
            var tmp = '/(' + arg + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp), replaceText);
            return tmp;
        } else {
            if (url.match('[\?]')) {
                return url + '&' + replaceText;
            } else {
                return url + '?' + replaceText;
            }
        }
        return url + '\n' + arg + '\n' + arg_val;
    },
    /**
     * 变更当前URL中的参数,并改变 history里的记录值
     */
    replaceURL: function (key, val) {
        let oURL = window.location.href;
        let nURL = this.changeURLArg(oURL, key, val)
        window.history.replaceState(null, null, nURL)
    },

    /**
     * @desc  提取URL 中加密的参数
     * @param {any} key
     * @param {string} [type='url']
     */
    getValue: function (key, type = 'url') {
        return this.getParamValue(key);
    },
    /**
     * url中提取值辅助函数
     *
     * @returns
     */
    getUrlparams: function () {
        var src = window.location.search,
            arr = src.substr(1, src.length - 1).split("&"),
            returnObj = {};
        if (arr !== null) {
            for (var i = 0, l = arr.length; i < l; i++) {
                var value = arr[i].split("=");
                if (value && value.length > 1) {
                    returnObj[decodeURIComponent(value[0])] = value[1]
                }
            }
        }
        return returnObj;
    },
    /**
     * url中提取值
     *
     * @param {any} name
     * @returns
     */
    getParamValue: function (name) {
        var param = this.getUrlparams();
        if (param[name]) {
            return app.d.unCompile(param[name]);
        }
        return null;
    },
    /**
     * 辅助函数
     *
     * @param {any} obj
     * @returns
     */
    typeName: function (obj) {
        var t;
        if (obj == null) {
            t = String(obj);
        } else {
            t = Object.prototype.toString.call(obj).toLowerCase();
            t = t.substring(8, t.length - 1);
        }
        return t;
    },

    /**
     * 加密参数页面跳转
     *
     * @param {any} name html名称
     * @param {any} obj  后面的参数
     * @param {any} location
     */
    linkTo: function (name, obj, location) {
        if (app.URL[name]) {
            let Url = app.URL[name];
            if (obj) {
                Url += "?";
                let _type = this.typeName(obj);
                switch (_type) {
                    case "string":
                        Url += encodeURIComponent(obj);
                        break;
                    case "object":
                        for (var _name in obj) {
                            Url += "&" + encodeURIComponent(_name) + "=" + app.d.Compile(obj[_name]);
                        }
                        break;
                }
                //增加一个时间戳
                // Url = Url + "&" + getTimestamp();
            }
            window.location.href = location ? location + Url : Url;
            return false
        }
    },
    /**
     * 阻止按钮提交方法
     * @param callback
     * @returns {*}
     */
    bannedClick: function (callback) {
        let that = this;
        let en = off;
        if (en) {
            return;
        } else {
            off = true;
            return callback && callback();
        }
    },
    /**
     * 启动按钮提交方法
     * @param of  true or false
     * @param callback 回调fn
     * @returns {*}
     */
    doClick: function ( of , callback) {

        if ( of ) {
            off = false;
            return callback && callback();
        }
    },

    /**
     * 正则匹配特殊字符
     * 
     * @param {any} s 
     */
    checkStr: function (s) {
        let reg = /[`~!@#$^&*()=|{}':;',\[\].<>\/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/gi;
        if (reg.test(s)) {
            return true
        } else {
            return false
        }
    }




}
module.exports = extend