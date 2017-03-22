/**
 * Created by Administrator on 2016/12/12 0012.
 */
// 判断某个对象是否有指定的className
function hasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

// 给指定对象添加className
function addClass(ele,cls) {
    if (!this.hasClass(ele,cls)) ele.className += " "+cls;
}

// 删除className
function removeClass(ele,cls) {
    if (hasClass(ele,cls)) {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        ele.className=ele.className.replace(reg,' ');
    }
}
/* 获取url参数
 // demo:
 parseUrl("www.xuanfengge.com/js?name=xuanfeng&age=21&page=2")
 // 结果
 {name: "xuanfeng", age: "21", page: "2"}*/
function parseUrl(url) {
    // 找到url中的第一个?号
    var parse = url.substring(url.indexOf("?") + 1),
        params = parse.split("&"),
        len = params.length,
        item = [],
        param = {};

    for (var i = 0; i < len; i++) {
        item = params[i].split("=");
        param[item[0]] = item[1];
    }

    return param;
}
/** URL参数拼接
 * @description 将传入的url参数对象解析组装成字符串做为queryString中的一部分
 * @param {Object} params 请求参数的数组
 * @param {string} cgi 请求串
 * @return {String} queryString部分字符串
 * @example ： param1=value1&param2=value2&param3=value3......
 *
 *
 * console.log(convert_params({"param": "value1", "param2": "value2"}, "/cgi-bin/"));
 // ?param=value1&param2=value2
 console.log(convert_params({"param": "value1", "param2": "value2"}, "/cgi-bin/?page=1"));
 // &param=value1&param2=value2
 */
function convert_params(params, cgi){
    var paramsArray = [];
    for (var name in params) {
        if (paramsArray.length == 0) {
            cgi && cgi.indexOf('?') != -1 ? paramsArray.push("&") : paramsArray.push("?");
        }
        else {
            paramsArray.push("&");
        }
        paramsArray.push(name);
        paramsArray.push("=");
        paramsArray.push(params[name]);
    }
    return paramsArray.join("");
}
/* 判断一个对象是否为空对象
console.log(isEmptyObj({}));                //true
 console.log(isEmptyObj({name: "ivan"}));    //false*/
function isEmptyObj(obj){
    for(var name in obj) {
        return false;
    }
    return true;
}
//Event兼容 阻止冒泡，封装stopPropagation函数
function  stopPropagation(e) {
    e=window.event || e;
    if(document.all){
        e.cancelBubble=true;
    }else{
        e.stopPropagation();
    }
}
/*事件监听兼容函数
*demo:
    var btn = document.getElementById("btn");
on(btn,"click",function(){
    console.log(1);
});
* */
function on(node,eventType,handler) {
    node=typeof node=="string"?document.getElementById(node):node;
    if(document.all){
        node.attachEvent("on"+eventType,handler);
    }else{
        node.addEventListenter(eventType,handler,false);
    }
}
//增强函数
//IE下this指向window,其他浏览器指向当前元素
on=function (node,eventType,handler,scope) {
    node=typeof node=="string"?document.getElementById(node):node;
    scope=scope||node;
    if(document.all){
        node.attachEvent("on"+eventType,function () { handler.apply(scope,arguments) });
    }else{
        node.addEventListener(eventType,function () {
            handler.apply(scope,arguments)
        },false);
    }
}





