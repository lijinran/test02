/**
 * Created by Diogo on 2017年6月6日16:42:22.
 */

require(['vue', 'common', 'extend', 'apiData', 'dialog'], function (Vue, app, ext, api, dialog) {

    ext.wxIntercept(function (barData, wxLogin) {
        let wxcode = app.getValue('code');

        console.log(barData)
        // 无扫码数据。提示扫码
        if (!barData) {
            dialog.tipDialog("请重新扫码");
            return false;
        }

        let vm = new Vue({
            el: '#app',
            data: {
                title: '微信登录'
            }
        });
        if (wxcode) {
            api.wxuserInfo(wxcode).done(data => {
                if (data.code == 200) {
                    // console.log(data)
                    // 用户微信信息
                    app.storeValue('wxInfo', JSON.stringify(data.data), 'local');
                    data.data ? wxDologin(data.data) : dialog.tipDialog('没有用户信息');
                } else {
                    data.msg && dialog.tipDialog(data.msg);
                }
            });
        } else {
            dialog.tipDialog('微信授权参数不正确');
        }

        /**
         * 
         * 微信登录方法
         * @param {any} data 
         */
        function wxDologin(data) {
            // console.log('21')
            api.wxLogin(
                data.openid,
                barData.comId,
                data.nickname,
                data.sex,
                data.access_token,
                data.refresh_token,
                data.headimgurl,
                data.province,
                data.city,
                data.unionid,
                barData.product_id,
                barData.province,
                barData.city,
                barData.barcode
            ).done(edata => {
                if (edata.code == 200) {
                    app.storeValue('wxLogin', JSON.stringify(edata.data), 'local');
                    // 跳转返回地址
                    let gourl = app.getValue("url", "session");

                    gourl && (window.location.href = gourl)
                    return false
                } else {

                    dialog.tipDialog('微信授权参数不正确');
                }

            })


        }


    }, 2)



})