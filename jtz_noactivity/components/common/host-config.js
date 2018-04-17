/**
 * 配置文件
 * @param {
 *  wappId: 微信授权ID
 *  Domain: 微信回调域名
 *  callPage: 微信回调页面
 *  cardId: 341 // 纪念卡ID  上线要改
 * }
 */
// 测试用   wxc7a0b4e1711c2867
window.th = {
    wappId: (window.location.host.indexOf("cncqti") > -1) ? "wx5f63763b545926ce" : 'wx8b2379e6e1bf2d3d', // wappId: 微信授权ID 开发wx8b2379e6e1bf2d3d  正式 wx5f63763b545926ce
    Domain: 'http://qt.cncqti.com/jump.html', // Domain: 微信回调域名
    callPage: '/sichuan/jtz201804/jtz_noactivity/wxLogin.html' // callPage: 微信回调页面
        // cardId: 341 // 纪念卡ID  上线要改
};
// 配置信息 
const HOST = {
    port: "/",
    //port: "http://yz2-m-stg.taiheiot.com/",
    // port: "http://192.168.1.178:8087/",
    // port: "http://demo2.taiheiot.com/sz-api-webapp/",
    prefix: window.localStorage.getItem("project") || "__jtz201804__"
}