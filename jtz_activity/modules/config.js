/**
 * Created by Dio on 2017-3-29 10:52:23.
 * @desc 默认配置文件
 */

let app = require("common");
let $barData = app.getValue('barcodeData', 'session'),
    actCity,
    barData = $barData && JSON.parse($barData);
let commonImg = "static/" + __uri("../views/draw/demo-ico.png"),
    sichuan = "static/" + __uri("../views/draw/sichuan-ico.png"),
    ankang = "static/" + __uri("../views/draw/ankang-ico.png"),
    dalian = "static/" + __uri("../views/draw/dalian-ico.png"),
    datong = "static/" + __uri("../views/draw/datong-ico.png"),
    eerduosi = "static/" + __uri("../views/draw/eerduosi-ico.png"),
    guiyang = "static/" + __uri("../views/draw/guiyang-ico.png"),
    guilin = "static/" + __uri("../views/draw/guilin-ico.png"),
    haerbin = "static/" + __uri("../views/draw/haerbin-ico.png"),
    hanzhong = "static/" + __uri("../views/draw/hanzhong-ico.png"),
    jinzhong = "static/" + __uri("../views/draw/jinzhong-ico.png"),
    linfen = "static/" + __uri("../views/draw/linfen-ico.png"),
    liuzhou = "static/" + __uri("../views/draw/liuzhou-ico.png"),
    qingdao = "static/" + __uri("../views/draw/qingdao-ico.png"),
    shenyang = "static/" + __uri("../views/draw/shenyang-ico.png"),
    xian = "static/" + __uri("../views/draw/xian-ico.png"),
    xingtai = "static/" + __uri("../views/draw/xingtai-ico.png"),
    changchun = "static/" + __uri("../views/draw/changchun-ico.png"),
    zhengzhou = "static/" + __uri("../views/draw/zhengzhou-ico.png"),
    zunyi = "static/" + __uri("../views/draw/zunyi-ico.png"),
    chengde = "static/" + __uri("../views/draw/chengde-ico.png");




let config = {
    cityImg: commonImg
}
actCity = barData.actCity;

if (barData.actProvince == "四川省") {
    actCity = "四川省"
}
console.log(actCity);

switch (actCity) {
    case "四川省":
        config.cityImg = sichuan;
        break;
    case "安康市":
        config.cityImg = ankang;
        break;
    case "承德市":
        config.cityImg = chengde;
        break;
    case "大连市":
        config.cityImg = dalian;
        break;
    case "大同市":
        config.cityImg = datong;
        break;
    case "鄂尔多斯市":
        config.cityImg = eerduosi;
        break;
    case "贵阳市":
        config.cityImg = guiyang;
        break;
    case "桂林市":
        config.cityImg = guilin;
        break;
    case "哈尔滨市":
        config.cityImg = haerbin;
        break;
    case "汉中市":
        config.cityImg = hanzhong;
        break;
    case "晋中市":
        config.cityImg = jinzhong;
        break;
    case "临汾市":
        config.cityImg = linfen;
        break;
    case "柳州市":
        config.cityImg = liuzhou;
        break;
    case "青岛市":
        config.cityImg = qingdao;
        break;
    case "沈阳市":
        config.cityImg = shenyang;
        break;
    case "西安市":
        config.cityImg = xian;
        break;
    case "邢台市":
        config.cityImg = xingtai;
        break;
    case "长春市":
        config.cityImg = changchun;
        break;
    case "郑州市":
        config.cityImg = zhengzhou;
        break;
    case "遵义市":
        config.cityImg = zunyi;
        break;
    default:
        config.cityImg = commonImg;
        break;
}

module.exports = config;