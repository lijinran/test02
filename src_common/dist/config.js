/**
 * 一些公用的配置文件变更
 * 
 */
window.config = {
    wappId: (window.location.host.indexOf("cncqti") > -1) ? "wx5f63763b545926ce" : 'wx8b2379e6e1bf2d3d', // wappId: 微信授权ID 开发wx8b2379e6e1bf2d3d  正式 wx5f63763b545926ce
    Domain: 'http://qt.cncqti.com/jump.html', // Domain: 微信回调域名
    callPage: '/sichuan/jtz201804/wxLogin.html', // callPage: 微信回调页面
    fixCallpage: '/sichuan/jtz201804/wxLogin_lg.html',
    HOST: (location.origin || (location.protocol + '//' + location.hostname)),
    //HOST: 'http://192.168.1.178:8087',
    publicCode: (window.location.host.indexOf("cncqti") > -1) ? "peBbYkENMFZCH249" : "g46lEVMc3zRNC273", //"开发 g46lEVMc3zRNC273", 正式 peBbYkENMFZCH249
    pwd: (window.location.host.indexOf("cncqti") > -1) ? "590979" : "550254", //"开发550254  ", 正式 590979 // 公码
    // cardId: 341 // 纪念卡ID  上线要改
}