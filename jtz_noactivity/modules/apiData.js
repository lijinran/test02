/**
 * Created by Diogo on 2017年2月21日10:06:20.
 * Modify by  2017年6月1日10:00:31
 * 命名规则: 驼峰式
 * 命名规范: isXXXX 是做判断  getXXX 是获取数据   doXXXX 是提交数据
 * 错误返回值:
 */
let app = require("common");

let date = {

    // 获取微信用户信息
    wxuserInfo: {
        url: "cloud2.member.api/wx/userInfoSC.do",
        param: "code"
    },
    // 微信登录 用户系统 
    wxLogin: {
        url: "cloud2.member.api/member/userInfo/wxLogin.do",
        param: "openId,comId,nickname,sex,accessToken,refreshToken,headImgUrl,province,city,unionId,materialsId,provinceUser,cityUser,barcode",
        type: 'POST'
    },

    /** 
     *  验真接口
     *  barcode	 码值
        pwd	 验证码
        appId	 应用id
        id	 扫码记录id
        province 	 省
        city	 市
        area	 区县
        userToken	 用户token
        relationId	 物资ID
        comId	 企业id
     */
    doCheck: {
        url: "cloud2.barcode.api/barcode/orderCheck/cqCheck.do",
        param: "barcode,pwd,appId,id,province,city,area,town,userToken,relationId,comId,ip",
        type: "POST"
    },
    // 获取用户信息
    getUserInfo: {
        url: "cloud2.member.api/member/userInfo/getCurLoginUser.do",
        param: "userToken",
        type: "post"
    },
    // 领取积分
    getPoint: {
        url: "cloud2.activity.api/v5/drwaLottery/doGetCqPoint.do",
        param: "userToken,barcode,province,city,area,relationId",
        type: "post"
    },
    // 获取积分兑换列表
    queryCqActivityAwards: {
        url: "cloud2.activity.api/v5/drwaLottery/queryCqActivityAwards.do",
        param: "barcode,province,city,area",
        type: "post"
    },
    // 卡劵兑换列表
    queryGifList: {
        url: "cloud2.activity.api/market/prize/queryPrizeGiftByGiftId.do",
        param: "giftId,pageNum,pageSize",
        type: "post"
    },
    // 兑换卡劵
    exchangeCard: {
        url: "cloud2.activity.api/v5/drwaLottery/choosePrize.do",
        param: "prePrizeId,prizeId,userToken,province,city,area,typeFalg",
        type: "post"
    },
    // 兑换香烟
    exchangeSmoke: {
        url: "cloud2.activity.api/v5/drwaLottery/cqPointChangeSmoke.do",
        param: "barcode,userToken,awardId,province,city,area",
        type: "post"
    },
    // 领奖记录列表
    queryGainList: {
        url: "cloud2.activity.api/v5/drwaLottery/queryUserGainList.do",
        param: "userToken,pageNum,pageSize",
        type: "post"
    },
    // 保存用户领取的地址(重庆)
    saveAddress: {
        url: "cloud2.activity.api/v5/drwaLottery/award.do",
        param: "userToken,id,contacts,contactsPhone,address,deliveryProvince,deliveryCity,deliveryArea", // id :兑换记录id
        type: "post"
    },
    // 重庆中奖列表接口
    queryRecords: {
        url: "cloud2.activity.api/v5/drwaLottery/queryQcChangeRecords.do",
        param: "userToken,pageNum,pageSize,city",
        type: "post"
    },
    // 排行榜列表接口
    queryRankList: {
        url: "cloud2.activity.api/v5/drwaLottery/queryRankList.do",
        param: "userToken,barcode,openId,province,city,area",
        type: "post"
    },
    // 活动结束后领取大奖
    getRankAward: {
        url: "cloud2.activity.api/v5/drwaLottery/rankAward.do",
        param: "userToken,openId,rankProvince,rankCity,contacts,phone,province,city,area,address",
        type: "post"
    }





};



module.exports = app.moduleFactory(date);