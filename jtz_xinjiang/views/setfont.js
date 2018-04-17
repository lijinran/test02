/**
 * Created by pdc on 2016/12/30.
 */
//隐藏微信右上角的分享 禁止[会员中心]
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    //通过下面这个API显示右上角按钮
    WeixinJSBridge.call('hideOptionMenu');
});


// 在 Android 下，需要通过 WeixinJSBridge 对象将网页的字体大小设置为默认大小
(function () {
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        handleFontSize();
    } else {
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
        } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", handleFontSize);
            document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
        }
    }

    function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', {
            'fontSize': 0
        });
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function () {
            WeixinJSBridge.invoke('setFontSizeCallback', {
                'fontSize': 0
            });
        });
    }
})();
// 百度统计
/*var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?9640473c3b4f60c203346c9df3ef4164";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();*/

window.innerWidth < 768 ? document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 375 * 20 + 'px' : document.getElementsByTagName('html')[0].style.fontSize = 16 / 1.4 + 'px';