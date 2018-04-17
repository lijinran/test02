/*
 *@author diogo 2017-4-12 19:33:19
 *
 *功能：对url加密算法（只针对window.location.href跳转，不针对post表单提交及ajax方式）
 *算法：对于暴露在浏览器地址栏中的属性值进行加密，如一个属性为agentID=1，
 *     若对1加密后为k230101io934jksd32r4，说明如下：
 *     前三位为随机数；
 *     第四到第五位为要加密字符转换成16进制的位数，
 *       如：要加密字符为15转换成16进制为f，位数为1，则第四、五位为01；
 *     第六位标识要加密字符为何种字符，0：纯数字，1：字符
 *       若是字符和数字的混合，则不加密；
 *     从第七位开始为16进制转换后的字符（字母和非数字先转换成asc码）；
 *     若加密后的字符总位数不足20位，则用随机数补齐到20位，若超出20位，则不加随机数。
 *     即加密后总位数至少为20位。
 */
function encode16(str) {
    str = str.toLowerCase();
    if (str.match(/^[-+]?\d*$/) == null) { //非整数字符，对每一个字符都转换成16进制，然后拼接
        var s = str.split("");
        var temp = "";
        for (var i = 0; i < s.length; i++) {
            s[i] = s[i].charCodeAt(); //先转换成Unicode编码
            s[i] = s[i].toString(16);
            temp = temp + s[i];
        }
        return temp + "{" + 1; //1代表字符
    } else { //数字直接转换成16进制
        str = parseInt(str).toString(16);
    }
    return str + "{" + 0; //0代表纯数字
}

/**
 * @desc 生成随机数
 * 
 * @param {any} n 
 * @returns 
 */
function produceRandom(n) {
    var num = "";
    for (var i = 0; i < n; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
}



/**
 * 支持:"abc"与数字
 * 不支持:中文
 * 
 * @param {any} str 
 * @returns 
 */
//主加密函数
function encrypt(str) {
    var encryptStr = ""; //最终返回的加密后的字符串
    encryptStr += produceRandom(3); //产生3位随机数

    var temp = encode16(str).split("{"); //对要加密的字符转换成16进制
    var numLength = temp[0].length; //转换后的字符长度
    numLength = numLength.toString(16); //字符长度换算成16进制
    if (numLength.length == 1) { //如果是1，补一个0
        numLength = "0" + numLength;
    } else if (numLength.length > 2) { //转换后的16进制字符长度如果大于2位数，则返回，不支持
        return "";
    }
    encryptStr += numLength;

    if (temp[1] == "0") {
        encryptStr += 0;
    } else if (temp[1] == "1") {
        encryptStr += 1;
    }

    encryptStr += temp[0];

    if (encryptStr.length < 20) { //如果小于20位，补上随机数
        let ran = produceRandom(20 - encryptStr.length);
        encryptStr += ran;
    }
    return encryptStr;
}

// 主解密函数
function unEncrypt(str) {
    let charLength = str.substring(3, 5); //加密后的字符有多少位
    let charLen = parseInt(charLength, 16); //转换成10进制
    let type = parseInt(str.substring(5, 6)); //加密字符的类型（0：数字，1：字符串）
    let valueEnc = str.substring(6, 6 + charLen);

    if (type == 0) {
        let trueValue = parseInt(valueEnc, 16);
        return trueValue
    } else {

        let sb = [],
            valueEncArray = valueEnc.split("");
        console.log(valueEncArray)
        for (let i = 0; i < valueEncArray.length; i += 2) {
            let n = parseInt(valueEncArray[i] + valueEncArray[i + 1], 16); //转换成10进制的asc码
            sb.push(String.fromCharCode(n))
        }
        return sb.join('');
    }

}

/**
 * @desc 这个可用于混编加中文的密码 
 * 
 * @param {any} code  
 * @returns 
 */
function compile(code) {
    code = code + ''
    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return escape(c)
}

// console.log(compile(123))   ==> 4ce

/**
 * @desc 解密码
 * 
 * @param {any} code 
 * @returns 
 */
function uncompile(code) {
    code = unescape(code);
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
}



// part B
/**
 * @desc 另类随机值
 */
var char = 'diogoxiang20170413'; //KEY
var pre = '0x' //固定两个字符串

function getRandom(n) {
    var res = "";
    var chars = [];
    chars = char.split("")
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * (char.length - 1));
        res += pre + chars[id];
    }
    return res;
}
/**
 * @desc nEncode16
 * 
 * @param {any} str 
 * @returns 
 */
function nEncode16(str) {
    str = str.toLowerCase();
    if (str.match(/^[-+]?\d*$/) == null) { //非整数字符，对每一个字符都转换成16进制，然后拼接
        var s = str.split("");
        var temp = "";
        for (var i = 0; i < s.length; i++) {
            s[i] = s[i].charCodeAt(); //先转换成Unicode编码
            s[i] = s[i].toString(16);
            temp = temp + pre + s[i];
        }
        return temp + "{" + 1; //1代表字符
    } else { //数字直接转换成16进制
        str = parseInt(str).toString(16);
    }
    return str + "{" + 0; //0代表纯数字
}

/**
 * 
 * @desc new 加密 
 * @param {any} str 
 * @returns 
 */
function nEncrypt(str) {
    var encryptStr = ""; //最终返回的加密后的字符串
    encryptStr += getRandom(2); //产生3位随机数

    var temp = nEncode16(str).split("{"); //对要加密的字符转换成16进制
    var numLength = temp[0].length; //转换后的字符长度
    numLength = numLength.toString(16); //字符长度换算成16进制
    if (numLength.length == 1) { //如果是1，补一个0
        numLength = "0" + numLength;
    } else if (numLength.length > 2) { //转换后的16进制字符长度如果大于2位数，则返回，不支持
        return "";
    }
    encryptStr += numLength;

    if (temp[1] == "0") {
        encryptStr += 0;
    } else if (temp[1] == "1") {
        encryptStr += 1;
    }

    encryptStr += temp[0];

    if (encryptStr.length < 20) { //如果小于20位，补上随机数
        let ran = getRandom(20 - encryptStr.length);
        encryptStr += ran;
    }
    return encryptStr;
}


function uNencrypt(str) {
    let charLength = str.substring(6, 8); //加密后的字符有多少位
    let charLen = parseInt(charLength, 16); //转换成10进制
    let type = parseInt(str.substring(8, 9)); //加密字符的类型（0：数字，1：字符串）
    let valueEnc = str.substring(9, 9 + charLen);
    if (type == 0) {
        let trueValue = parseInt(valueEnc, 16);
        return trueValue
    } else {

        let sb = [],
            valueEncArray = valueEnc.split(pre);
        console.log(valueEncArray)
        for (let i = 1; i < valueEncArray.length; i++) {
            let n = parseInt(valueEncArray[i], 16); //转换成10进制的asc码
            sb.push(String.fromCharCode(n))
        }
        return sb.join('');
    }

}


let dioE = {
    Encrypt: encrypt,
    unEncrypt: unEncrypt,
    Compile: compile,
    unCompile: uncompile,
    nEncrypt: nEncrypt,
    uNencrypt: uNencrypt
}