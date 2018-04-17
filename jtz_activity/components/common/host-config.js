/**
 * 配置文件
 * @param {
 *  wappId: 微信授权ID
 *  Domain: 微信回调域名
 *  callPage: 微信回调页面
 *  cardId: 341 // 福利卡ID  上线要改
 * }
 */
window.th = {
    wappId: (window.location.host.indexOf("cncqti") > -1) ? "wx5f63763b545926ce" : 'wx8b2379e6e1bf2d3d', // wappId: 微信授权ID 开发wx8b2379e6e1bf2d3d  正式 wx5f63763b545926ce
    Domain: 'http://qt.cncqti.com/jump.html', // Domain: 微信回调域名
    shareTitle: "天子礼 惠全城", //分享标题
    shareDesc: '标杆金天子，感恩一路行。100%中奖率，液晶平板电视机、微信红包、礼券等你来！', // 分享的描述只有分享给朋友才有
    shareUrl: '/sichuan/jtz201804/share.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致 相对地址
    shareImg: '/sichuan/jtz201804/shareimg.jpg', // 分享的图片地址
    callPage: '/sichuan/jtz201804/jtz_activity/wxLogin.html' // callPage: 微信回调页面
        // cardId: 341 // 福利卡ID  上线要改
};
// 配置信息 
const HOST = {
  port: "/",
    //port: "http://yz2-m-stg.taiheiot.com/",
    //port: "http://192.168.1.178:8087/", // 傅锦松
    // port: "http://demo2.taiheiot.com/sz-api-webapp/",
    prefix: window.localStorage.getItem("project") || "__jtz201804__"
};

/**
 *                             _ooOoo_
 *                            o8888888o
 *                            88" . "88
 *                            (| -_- |)
 *                            O\  =  /O
 *                         ____/`---'\____
 *                       .'  \\|     |//  `.
 *                      /  \\|||  :  |||//  \
 *                     /  _||||| -:- |||||-  \
 *                     |   | \\\  -  /// |   |
 *                     | \_|  ''\---/''  |   |
 *                     \  .-\__  `-`  ___/-. /
 *                   ___`. .'  /--.--\  `. . __
 *                ."" '<  `.___\_<|>_/___.'  >'"".
 *               | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *               \  \ `-.   \_ __\ /__ _/   .-` /  /
 *          ======`-.____`-.___\_____/___.-`____.-'======
 *                             `=---='
 *          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                     佛祖保佑        永无BUG
 *            佛曰:
 *                   写字楼里写字间，写字间里程序员；
 *                   程序人员写程序，又拿程序换酒钱。
 *                   酒醒只在网上坐，酒醉还来网下眠；
 *                   酒醉酒醒日复日，网上网下年复年。
 *                   但愿老死电脑间，不愿鞠躬老板前；
 *                   奔驰宝马贵者趣，公交自行程序员。
 *                   别人笑我忒疯癫，我笑自己命太贱；
 *                   不见满街漂亮妹，哪个归得程序员？
 */