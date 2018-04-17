/**
 * Created by pdc on 2016/10/18.
 */
require("$");
const URL = _LINK_, //框架自动生成页路径对应表
    dialog = require("dialog"),
    rword = /[, ]+/g,
    WIN = window,
    DOC = document;
__inline("host-config"); //插入host配置
/**
 * @desc 加密方法 
 */
__inline("encrypt");

let Loading = (function() {
    let count = 0,
        div,
        html = `<div class='ui-loading-bg'></div>
                <div class='ui-loading-box'>
                    <div class='ui-loading'>
                        <div class='ui-loading-icon ui-loading-icon-0'></div>
                        <div class='ui-loading-icon ui-loading-icon-1'></div>
                        <div class='ui-loading-icon ui-loading-icon-2'></div>
                        <div class='ui-loading-icon ui-loading-icon-3'></div>
                        <div class='ui-loading-icon ui-loading-icon-4'></div>
                        <div class='ui-loading-icon ui-loading-icon-5'></div>
                        <div class='ui-loading-icon ui-loading-icon-6'></div>
                        <div class='ui-loading-icon ui-loading-icon-7'></div>
                        <div class='ui-loading-icon ui-loading-icon-8'></div>
                        <div class='ui-loading-icon ui-loading-icon-9'></div>
                        <div class='ui-loading-icon ui-loading-icon-10'></div>
                        <div class='ui-loading-icon ui-loading-icon-11'></div>
                    </div>
                    <p class='ui-loading-p'>数据加载中</p>
            </div>`;
    //页面内容显示LOADIN
    let Content = {
        show: function() {
            if (count < 1) {
                if (!div) {
                    div = DOC.createElement("div");
                    div.className = "ui-loading-wrap";
                    div.innerHTML = html
                }
                DOC.body.appendChild(div);
            }
            count++;
            // debugger
        },
        hide: function() {
            if (count <= 1) {
                div && DOC.body.removeChild(div)
            }
            count--;
        }
    }
    return {
        show: function(type = "content") {
            if (type == "content") {
                Content.show()
            }
        },
        hide: function(type = "content") {
            if (type == "content") {
                Content.hide()
            }
        }
    }
})();

/**
 * 设置cookie
 *
 * @param {any} c_name
 * @param {any} value
 * @param {any} expiredays
 */
function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    DOC.cookie = c_name + "=" + decodeURI(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

/**
 * 获取cookie
 *
 * @param {any} cookieName
 * @returns
 */
function getCookie(cookieName) {
    var start = DOC.cookie.indexOf(cookieName + "=");
    if (start == -1) { return ""; }
    start = start + cookieName.length + 1;
    var end = DOC.cookie.indexOf(";", start);
    if (end == -1) { end = DOC.cookie.length; }
    return decodeURIComponent(DOC.cookie.substring(start, end));
}

/**
 * 存储键值对
 *
 * @param {any} key
 * @param {any} value
 * @param {string} [type="url"]
 * @param {string} [expiredays=""]
 * @returns
 */
function storeValue(key, value, type = "url", expiredays = "") {
    switch (type) {
        case "url":
            return "&" + encodeURIComponent(key) + "=" + encodeURIComponent(value);
        case "local":
            window.localStorage && localStorage.setItem(HOST.prefix + key, value);
            break;
        case "session":
            window.sessionStorage && sessionStorage.setItem(HOST.prefix + key, value);
            break;
        case "cookie":
            setCookie(HOST.prefix + key, value, expiredays);
            break;

    }
};

/**
 * 提取值
 * 默认是从URL中提取
 * @param {any} key
 * @param {string} [type="url"]
 * @returns
 */
function getValue(key, type = "url") {
    switch (type) {
        case "url":
            return getParamValue(key);
            break;
        case "local":
            return localStorage.getItem(HOST.prefix + key);
            break;
        case "session":
            return sessionStorage.getItem(HOST.prefix + key);
            break;
        case "cookie":
            return getCookie(HOST.prefix + key);
            break;
    }
};

/**
 * 删除 localStorage cookie 与 sessionStorage 中的值
 *
 * @param {any} key
 * @param {any} type
 * @returns
 */
function deleteValue(key, type) {
    var type = type || "all";
    if (!key) {
        localStorage.clear();
        sessionStorage.clear();
        return;
    }
    switch (type) {
        case "all":
            localStorage.removeItem(HOST.prefix + key);
            sessionStorage.removeItem(HOST.prefix + key);
            setCookie(HOST.prefix + key, "", -1);
            break;
        case "local":
            localStorage.removeItem(HOST.prefix + key);
            break;
        case "session":
            sessionStorage.removeItem(HOST.prefix + key);
            break;
        case "cookie":
            setCookie(HOST.prefix + key, "", -1);
            break;
    }
};

/**
 * url中提取值辅助函数
 *
 * @returns
 */
function getUrlparams() {
    var src = window.location.search,
        arr = src.substr(1, src.length - 1).split("&"),
        returnObj = {};
    if (arr !== null) {
        for (var i = 0, l = arr.length; i < l; i++) {
            var value = arr[i].split("=");
            if (value && value.length > 1) { returnObj[decodeURIComponent(value[0])] = decodeURIComponent(value[1]) }
        }
    }
    return returnObj;
};
/**
 * url中提取值
 *
 * @param {any} name
 * @returns
 */
function getParamValue(name) {
    var param = getUrlparams();
    if (param[name]) {
        return param[name];
    }
    return null;
}



/**
 * 转换obj类型
 *
 * @param {any} obj
 * @returns
 */
function type(obj) {
    var t;
    if (obj == null) {
        t = String(obj);
    } else {
        t = Object.prototype.toString.call(obj).toLowerCase();
        t = t.substring(8, t.length - 1);
    }
    return t;
}

/**
 * 常规页面跳转
 *
 * @param {any} name html名称
 * @param {any} obj  后面的参数
 * @param {any} location
 */
function linkTo(name, obj, location) {
    if (URL[name]) {

        let Url = URL[name];
        if (obj) {
            Url += "?";
            let _type = type(obj);
            switch (_type) {
                case "string":
                    Url += encodeURIComponent(obj);
                    break;
                case "object":
                    for (var _name in obj) {
                        Url += "&" + encodeURIComponent(_name) + "=" + encodeURIComponent(obj[_name]);
                    }
                    break;
            }
            //增加一个时间戳
            Url = Url + "&" + getTimestamp();
        }

        window.location.href = location ? location + Url : Url;
        return false
    }
}


/**
 * 接口调用控制
 *
 * @param {any} apiName 接口名称
 * @param {any} apiSource  接口地址
 * @returns
 */
function useApi(apiName, apiSource) {
    var source = apiSource || {},
        apiObj = source[apiName];
    if (!apiObj) {
        console.log("未找到" + apiName + "接口相关数据");
        return false;
    }
    return {
        url: HOST.port + apiObj.url,
        data: function() {
            var str = apiObj.param,
                _data = {};
            if (str) {
                str = str.split(rword);
                var len = str.length,
                    pop = Array.prototype.pop;
                while (str[len - 1]) {
                    var name = str[len - 1],
                        value = pop.apply(arguments);
                    _data[name] = value == "undefined" ? "" : value;
                    len--;
                }
            }
            return _data;
        },
        type: apiObj.type || "get",
        async: apiObj.async || true
    }
}


/**
 * 封装带有loading图标的ajax请求
 *
 * @param {any} param
 * @param {boolean} [showLoading=true]
 * @returns
 */
function loadAjax(param, showLoading = true) {
    showLoading && Loading.show();
    let dtd = $.Deferred();
    return $.ajax({
        type: param.type || "post",
        url: param.url,
        data: param.data,
        async: param.async || true
    }).done(
        function(data) {
            if (data.code == -1) {
                let callBackUrl = window.location.href;
                linkTo("login", { callBackUrl: callBackUrl })
            }
        }
    ).fail(
        function(data) {
            if (data.msg) {
                dialog.tipDialog(data.msg)
            }
        }
    ).always(
        function(date) {
            showLoading && Loading.hide();
            param.complete && param.complete(date);
        }
    )
}

/**
 * MODULE生成对应返回接口工厂函数
 *
 * @param {any} data
 * @returns obj 包含接口地址的对像
 */
function moduleFactory(data) {
    var obj = {};
    $.each(data, function(name, value) {
        obj[name] = function() {
            var api = useApi(name, data);
            if (data[name].fn) {
                return data[name].fn.call(this, api.url, api.data.apply(this, arguments))
            } else {
                return loadAjax({
                    url: api.url,
                    data: api.data.apply(this, arguments),
                    type: api.type,
                    async: api.async
                })
            }
        }
    })
    return obj;
}

/**
 * 预加载图片
 *
 * @param {any} array
 * @param {any} suc
 * @param {any} fai
 */
function loadImage(array, suc, fai) {
    var l = array.length,
        i = 0,
        j = 0; //j----加载图片的总数（包括成功和失败的）；i----加载成功的图片张数
    while (l) {
        const image = new Image();
        image.src = array[l - 1];
        const fn = (function(l) {
            return function() {
                i += 1;
                j += 1;
                suc && suc.call(this, j, image, array[l - 1], l)
            }
        })(l);
        if (image.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            fn();
        } else {
            image.onload = fn;
            image.onerror = (function(l) {
                return function() {
                    j += 1;
                    console.log("资源 " + array[l] + " 未能加载成功，请检查网络或者是否加载正确地址")
                    fai && fai.call(this, j, i, array[l - 1], l)
                }
            })(l);
        }
        l--
    }
}

/**
 * 对数字进行分割
 *
 * @param {any} str
 * @param {any} section 位数
 * @param {any} separator 分割字符
 * @returns
 */
function divisionNum(str, section, separator) {
    var section = section || 3,
        separator = separator || ",",
        reg = new RegExp('(\\d)(?=(?:\\d{' + section + '})+$)', 'g');
    str = (str + "").replace(reg, '$1' + separator)
    return str;
}

/**
 * 对不足位数进行填充
 *
 * @param {any} str
 * @param {any} section
 * @param {any} separator
 * @returns
 */
function intercept(str, section, separator) {
    var section = section || 3,
        separator = separator || "0",
        l = (str + "").length,
        ary = new Array(section - 0 + 1).join(separator);
    if (l >= section) {
        return (str + "").substr(l - section)
    } else {
        return ary.substr(0, section - l) + str;
    }
}

/**
 * 替换原字符中的指定元素
 *
 * @param {any} str
 * @param {any} separator
 * @returns
 */
function digita(str, separator) {
    var separator = separator || ",",
        reg = new RegExp(separator, 'g')
    return (str + "").replace(reg, "")
}
var num = {
    division: divisionNum,
    intercept: intercept,
    digita: digita
};
/**
 * 日期处理 扩展 日期处理函数
 */
Date.prototype.format = function(str) {
    var week = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        time = {
            "y+": this.getFullYear(),
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "w": this.getDay(),
            "W": week[this.getDay()]
        },
        str = str || "yyyy-MM-dd HH:mm:ss";
    for (var i in time) {
        var reg = new RegExp('(' + i + ')', 'g');
        str = str.replace(reg, function() { return intercept(time[i], (i == "w" || i == "W") ? time[i].length : arguments[1].length) })
    }
    return str;
}

/**
 * 通用处理创建树形结构数据
 *
 * @param {any} data
 * @param {any} idName
 * @param {any} parentName
 * @param {any} startValue
 * @param {any} cb
 * @returns
 */
function creatTree(data, idName, parentName, startValue, cb) {
    var array = [],
        temp;
    for (var i = 0, l = data.length; i < l; i++) {
        if (data[i][parentName] == startValue) {
            array.push(data[i]);
            temp = creatTree(data, idName, parentName, data[i][idName], cb);
            data[i].children = temp.length > 0 ? temp : [];
            cb && cb.call(this, data[i])
        }
    }
    return array;
}

// JSON.
function strTojson(str) {
    return JSON.parse(str)
}

/**
 * 
 * 返回当前的一个时间搓
 * @returns 
 */
function getTimestamp() {
    let timestamp = Date.parse(new Date());
    return timestamp
}

/**
 *  设置弹窗的高度
 *  @param {id} id  最外层 id
 */
function setMainHeight(id) {
    let bodyH = DOC.body.clientHeight,
        winH = WIN.innerHeight;
    let el = `#${id} >.main-wrap`;
    let outEl = DOC.querySelector(`#${id}`);
    let dialogWrap = DOC.querySelector(el),
        elHeight,
        scrollHeight = DOC.body.scrollTop;
    outEl.style.display = "block";
    elHeight = dialogWrap.clientHeight;
    if (elHeight <= winH) { //弹出层高度小于等于窗口高度时
        dialogWrap.style.top = (scrollHeight + (winH - elHeight) / 2) + "px";
    } else if (winH < elHeight && winH >= bodyH) { //弹出层高度大于窗口高度并且文档高度小于窗口高度时
        dialogWrap.style.height = winH - 40 + "px";
        dialogWrap.style.top = "20px";
    } else if (winH < elHeight && elHeight < bodyH - scrollHeight) { //弹出层高度大于窗口高度并且小于剩余文档高度
        dialogWrap.style.top = scrollHeight + Math.min((bodyH - scrollHeight - elHeight) / 2, 20) + "px";
    } else if (winH < elHeight && elHeight >= bodyH - scrollHeight) { //弹出层高度大于窗口高度并且大于剩余文档高度
        dialogWrap.style.height = (bodyH - scrollHeight - 40) + "px";
        dialogWrap.style.top = (scrollHeight + Math.min((winH - bodyH + scrollHeight + 40) / 2, 20)) + "px";
    }

}


// exports 方法
module.exports = {
    URL: URL,
    host: HOST,
    storeValue: storeValue,
    getValue: getValue,
    deleteValue: deleteValue,
    useApi: useApi,
    linkTo: linkTo,
    moduleFactory: moduleFactory,
    num: num,
    creatTree: creatTree,
    loadImage: loadImage,
    strTojson: strTojson,
    Loading: Loading,
    getTimestamp: getTimestamp,
    setMainHeight: setMainHeight,
    d: dioE // encrypt
        // ext: extend // 扩展

}