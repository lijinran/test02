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
    // 获取微信SDK权限
    getWXSDK: {
        url: "cloud2.member.api/wx/jsSignature.do",
        param: "url",
        type: "POST"
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

    /*查询当前活动对应奖项列表接口（四川、区外）
     * activityId		活动ID
     * province		省
     * city		市
     */
    queryActivityAwards: {
        url: "cloud2.activity.api/v5/drwaLottery/queryActivityAwards.do",
        param: "activityId,province,city",
        type: "POST"
    },
    /** 四川、区外翻牌抽奖接口
     *userToken	 用户token
     *province 	 省
     *city	 	 市
     *area	 	 区县
     *relationId	 物资ID
     *barcode	 码值
     */
    doFpDrwaLottery: {
        url: "cloud2.activity.api/v5/drwaLottery/doFpDrwaLottery.do",
        param: "userToken,province,city,area,town,relationId,barcode",
        type: "POST"
    },
    /**查询抽奖机会
     * */
    queryDrawLotteryChance: {
        url: "cloud2.activity.api/v5/drwaLottery/queryDrawLotteryChance.do",
        param: "userToken",
        type: "POST"
    },
    /*中奖列表
     *未领取
     * */
    queryScDrowRecords: {
        url: "cloud2.activity.api/v5/drwaLottery/queryScDrowRecords.do",
        param: "userToken,pageNum,pageSize,activityId",
        type: "POST"
    },
    /**
     * 获取用户信息
     * **/
    getUserInfo: {
        url: "cloud2.member.api/member/userInfo/getCurLoginUser.do",
        param: "userToken",
        type: "POST"
    },
    /** 领奖接口
     *id   中奖纪录ID
     *userToken   用户token
     *contacts  收货人（实物时传）
     *contactsPhone   收货人电话（实物时传）
     *province  省（用户定位）
     *city     市（用户定位）
     *area     区（用户定位）
     *address   详细地址（实物时传）
     *deliveryProvince   省（实物时传）
     *deliveryCity  市（实物时传）
     *deliveryArea   区（实物时传）
     */
    award: {
        url: "cloud2.activity.api/v5/drwaLottery/award.do",
        param: "id,userToken,contacts,contactsPhone,address,deliveryProvince,deliveryCity,deliveryArea",
        type: "POST"
    },

    /***领取礼包奖品接口
     * winId   中奖纪录ID 中奖纪录ID
     *prePrizeId   礼包ID 礼包奖品ID
     *prizeId   奖品ID 所选择的奖品ID
     *userToken     token
     *
     */
    choosePrize: {
        url: "cloud2.activity.api/v5/drwaLottery/choosePrize.do",
        param: "winId,prePrizeId,prizeId,userToken",
    },

    /*绑定手机号码
     phone  需绑定手机号码
     code  短信验证码
     channel  渠道 默认为 yz
     userToken  用户token值
     */
    bindPhone: {
        url: "cloud2.member.api/member/userInfo/bindPhone.do",
        param: "phone,code,channel,userToken"
    },
    /***发送验证码接口
     * mobile   手机号码
     channel   渠道 默认为 yz
     *
     */
    sendMessage: {
        url: "cloud2.public.service/sms/sendMessage.do",
        param: "mobile,channel"
    },
    /**
     * 卡券列表
     *  giftId 礼包奖品ID
     */
    queryPrizeGiftByGiftId: {
        url: "cloud2.activity.api/market/prize/queryPrizeGiftByGiftId.do",
        param: "giftId,pageNum,pageSize,barcode,province,city"
    },
    // 兑换卡劵
    exchangeCard: {
        url: "cloud2.activity.api/v5/drwaLottery/choosePrize.do",
        param: "prePrizeId,prizeId,userToken,province,city,area,town,barcode,relationId,phone",
        type: "post"
    },
    //不再提醒 noticeFlag  为1不提醒，为空提醒
    noPrompt: {
        url: "cloud2.member.api/member/userInfo/updateUserInfo.do",
        param: "noticeFlag,userToken"
    },
    //活动详情
    queryActivityInfo: {
        url: "cloud2.activity.api/v5/drwaLottery/queryActivityInfo.do",
        param: "barcode,province,city"
    },
    // 卡劵兑换列表
    queryGifList: {
        url: "cloud2.activity.api/market/prize/queryPrizeGiftByGiftId.do",
        param: "giftId,pageNum,pageSize,barcode,province,city",
        type: "post"
    },
    //领奖记录
    queryUserGainList: {
        url: "cloud2.activity.api/v5/drwaLottery/queryUserGainList.do",
        param: "userToken,pageNum,pageSize,activityId",
        type: "post"
    },
    //跑马灯
    querySrcollList: {
        url: "cloud2.activity.api//v5/drwaLottery/querySrcollList.do",
        param: "activityId,province,city"
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
        param: "userToken,openId,rankProvince,rankCity,contacts,phone,province,city,area,address,barcode,rankType,turnNum",
        type: "post"
    },
    //查询奖品详情
    queryPrizeDetailInfo: {
        url: "cloud2.activity.api/v5/drwaLottery/queryPrizeDetailInfo.do",
        param: "prizeId,userToken,orderNo"
    },
    // 验真页中奖综合提示信息
    getPromptInfo: {
        url: "cloud2.activity.api/v5/rewardPrompt/getPromptInfo.do",
        param: "userToken,province,city,barcode"
    },
    /**
     * 新的排行榜接口
     *  userToken true string 用户token
        openId true string 用户微信openID
        province true string 省
        city false string 市
        barcode false string
        rankType true string 1、查总排行榜 2、查周排行榜 3、周排行榜往期回顾
     */
    queryMarketRankList: {
        url: "cloud2.activity.api/v5/drwaLottery/queryMarketRankList.do",
        param: "userToken,openId,province,city,barcode,rankType"
    },
    /**
     * 分享成功增加抽奖机会
     */
    doAddShare: {
        url: 'cloud2.activity.api/v5/drwaLottery/shareAddFpChange.do',
        param: "userToken,barcode,province,city"
    },
    /**
     * 查询总排行榜第三名变化情况
     */
    queryThirdChange: {
        url: 'cloud2.activity.api/v5/drwaLottery/queryThirdChange.do',
        param: "userToken,barcode,province,city"
    },
    /**
     * 热点消息记录创建接口
     *  msgId true string 消息ID
        msgTitle true string 消息标题
        userToken false string 用户令牌
        province false string 省份
        city false string 城市
        area false string 区县
     */
    addHotMsgRecord: {
        url: "cloud2.activity.api/v5/drwaLottery/addHotMsgRecord.do",
        param: "msgId,msgTitle,userToken,province,city,area"
    }




};



module.exports = app.moduleFactory(date);