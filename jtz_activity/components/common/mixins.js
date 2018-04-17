/**
 * @desc 一些公共方法
 * Created Dio 2017-6-1 9:40:47
 */

var mixins = {
    // 版本号
    version: "0.0.1",
    // 返回
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
    popup: function(msg, sureFunction, type) {
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
            footer: [
                { name: `${btnMsg}`, className: `${btnClass}` }
            ],
            blindEvent: [{
                ele: `${btnClassEle}`,
                type: "click",
                fn: function() {
                    _popup.close(sureFunction);
                }
            }]
        });
        _popup.open()
    }
}