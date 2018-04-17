/**
 * validate
 * 表单验证组件，主要功能：
 *      1.内置常用几种验证功能，可扩展
 *      2.每个验证元素都有成功和错误处理回调接口
 *      3.可动态添加或者删除验证元素。
 * @param 参数说明
 *      options array,验证元素及配置集合，每个子元素为对象，详尽参数如下：
 *          name:string 要验证元素的name值，
 *          type:array 验证类型，可以多个同时使用，默认验证及使用方式如下：
 *              required    不能为空；
 *              number	数字验证;
 *              tel 验证手机号码；
 *              email   验证邮箱；
 *              password    验证密码强度，目前为不能全为数字或者全为字母的8-16位；
 *              compare|target  比较与target的值是否相等，target可以为多个元素，用逗号或者空格分开；
 *              lengthLimi|min max  比较值是否大于等于min且小于等于max；只有一个参数时表示值要大于等于这个参数；
 *          userDefined: Object 自定义验证及添加实时验证参数，参数如下；
 *              type:string 可选，绑定事件类型，理论上click,hover等都可以，设计之初主要是针对input,blur,focus这类事件;
 *              fn:function 可选，用户自定义添加的验证函数，返回值需要设定为boolean；
 *          message:Object  可选，用来覆盖默认定义的错误提示语，对应相应的类型，如：
 *              required:"重新定义的不能为空"
 *          success:function    可选，此元素验证通过后执行的函数；
 *          error:function  可选，此元素未通过验证执行的函数；
 *      success:function    可选，不过一般应该都不会不写吧。。所有元素通过验证后执行的函数；
 *      error:function  可选，有元素没有通过验证后执行的函数,默认的有错误信息提示；
 * @param   功能函数说明
 *      add:添加一个验证元素，格式和上面的单个验证元素一样；
 *      remove：移除一个验证元素的验证规则，格式和添加时格式一样，格式里写了多少type就移除对应的验证规则；
 *      checkOne：验证某个元素；
 *      checkAll:验证所有元素
 * Created by pdc on 2015/10/6.
 */
'use strict';
(function(root,factory){
	if(typeof define ==="function"){
		define('validate',factory);
	}else{
		root.app=root.app||{};
		root.app.validate=factory();
	}
})(this,function(){
	var rword = /[, ]+/g,
    rtel=/^1[345678]\d{9}$/,
    remail=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
	rnum=/^\d+(\.\d+)?$/,
    rpassword=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
    arrayProty=Array.prototype,
	inputEvents={};

	var valiFn={
		required: function (str) {
			return typeof str !== "undefined" && str !== "";
		},
		tel: function (num) {
			return rtel.test(num);
		},
		number:function(num){
			return rnum.test(num);
		},
		email: function (str) {
			return remail.test(str);
		},
		password: function (str) {
			return rpassword.test(str);
		},
		compare: function () {
			var v1=arrayProty.shift.call(arguments),
				arg=arrayProty.slice.call(arguments,0);
			var bool=true;
			each(arg,function(name){
				bool=$name(name) && v1 == getValue(name);
				return bool;
			},true);
			return valiFn.required(v1)&&bool;
		},
		lengthLimi: function (value, min, max) {
			if (typeof value == "undefined") {
				return false
			}
			var num = value.length;
			return max ? (num >= min && num <= max) : num >= min;
		}
	};
	//默认错误信息
	var Message={
		required:"此元素不能为空",
		tel:"请输入正确的手机号码",
		email:"请输入正确格式的邮箱",
		password:"密码为8-16位字母与数字组合",
		compare:"二次输入不一致",
		lengthLimi:"请输入指定范围内",
		number:"请输入数字类型"
	};
	//错误提示元素池
	var elementPool=(function(){
        var index= 0,
            pool=[];
        return {
            getEle:function(){
                if(index>pool.length-1){
                    pool[index]=document.createElement("span");
					pool[index].className="err-msg";
                }
                var ele=pool[index];
                index++;
                return ele;
            },
            reset:function(){
                index=0;
            },
			append:function(value,name,message){
				var names=$name(name),
					parent=names[0].parentNode,
				span=parent.querySelector(".err-msg");
				if(!message){return}
				if(!span){
					span=elementPool.getEle();
					parent.appendChild(span)
				}
				span.innerText=message;
			},
			remove:function(){
				for(var i=0;i<index;i++){
					pool[i].parentNode&&pool[i].parentNode.removeChild(pool[i]);
				}
				elementPool.reset();	
			}
        }
    })()
	
	//事件订阅，取消订阅，发布
	var Event=function(nameSpace){
		var listenList={};
		return (function(){
			listenList[nameSpace]=listenList[nameSpace]||{};
			var Listen=listenList[nameSpace];
			return {
				listen:function(name,obj){
					Listen[name]=Listen[name]||[];
					var bool=true;
					each(Listen[name],function(date){
						if(date.type==obj.type){
							bool=false;
							each(obj,function(value,i){
								date[i]=value;
							});
						}
						return bool;
					},true);
					bool&&Listen[name].push(obj);
				},
				remove:function(name,type){
					var fns=Listen[name];
					if(!fns){
						return;
					}
					if(type){
						each(fns,function(Fn,i){
							if(Fn.type==type){
								fns.splice(i,1);
								return false;
							}
							return true;
						},true);
					}else{
					   fns=null;
						delete Listen[name]
					}
				},
				getAll:function(){
					return Listen;
				},
				trigger:function(){
					var name=arrayProty.shift.apply(arguments),
						fns=Listen[name],
						result=true,
						success,
						Arg=arguments,
						value=arrayProty.slice.call(arguments,0,1)[0],
						reg=new RegExp("/^"+name+"\w+"),
						node;
					each(fns,function(obj){
						if(obj.param){
							arrayProty.push.apply(Arg,obj.param);
						}
						var bool=obj.fn.apply(this,Arg);
						if(bool=="undefined"){
							console.log(obj.fn+" 此函数未正确返回boolean值")
						}
						if(!bool){
							var error=obj.error||elementPool.append;
							error.call(this,value,name,obj.message,node);
						}else{
                            var parent=$name(name)[0].parentNode,
                                span=parent.querySelector(".err-msg");
                            span&&(span.innerText="");
                        }
						obj.success&&!success&&(success=obj.success);
						if(result&&!bool){
							result=false;
						}
						return bool;	
					},true);
					result&&success&&success.call(this,value,name);
					return result;
				}
			}
		})();
	}
	//创建唯一的事件管理列表
	var manageEvent=(function(){
		var count=0;
		return function(){
			count++;
			return Event(count);
		}
	})();
	
	//验证构造函数
	function validate(options,success,error){
		this.options=options;
		this.success=success;
		this.error=error;
		this.init();
	}
	validate.prototype={
		constructor:validate,
		init:function(){
			var _this=this;
			this._event=manageEvent();
			each(_this.options,function(obj){
				_this.add(obj);
			});
		},
		add:function(obj){
			var _this=this,
				name=obj.name;
			obj.type&&each(obj.type,function(type){
				var date=stripper(type),
					Fn=valiFn[date.type];
				if(Fn){
					date.fn=Fn;
					date.message=(obj.message&&obj.message[date.type])||Message[date.type];
					date.success=obj.success;
					date.error=obj.error;
					_this._event.listen(name,date);
				}
			});
			if(obj.userDefined){
				var user=obj.userDefined;
				user.fn&&(this._event.listen(name,{type:"userDefined",fn:user.fn,message:obj.message&&obj.message.userDefined,success:function(){
					var parent=$name(name)[0].parentNode,
						span=parent.querySelector(".err-msg");
					span&&(span.innerText="");
					obj.success&&obj.success()
				},error:obj.error}));
				if(user.type){
					var handle=function(){
						var value=getValue(name);
						_this._event.trigger(name,value)
					};
					inputEvents[name+user.type]=handle;
					each($name(name),function(ele){
						ele.addEventListener(user.type,inputEvents[name+user.type],false)
					})
				}
			}
		},
		remove:function(name,opts){
			var _this=this;
			if(opts){
				var types=opts.types,
					userType=opts.userType;
				types&&each(types,function(type){
					_this._event.remove(name,type)
				});
				if(userType){
					var handle=inputEvents[name+userType];
					_this._event.remove(name,"userDefined");
					each($name(name),function(ele){
						ele.removeEventListener(userType,handle,false);
					});
				}
			}else{
				_this._event.remove(name);
				var reg=new RegExp("/^"+name+"\w+"); 
				each(inputEvents,function(fn,names){
					if(reg.test(names)){
						inputEvents[names]=null;
						delete inputEvents[names];
					}
				});
			}
		},
		checkOne:function(name){
			var value=getValue(name),
				result=this._event.trigger(name,value);
			return result;
		},
		checkAll:function(){
			var _this=this,
				isPass=true;
			//清除默认的信息提示元素
			elementPool.remove();	
			each(_this._event.getAll(),function(value,name){
				var bool=_this.checkOne(name);
				if(isPass&&!bool){
					isPass=false;
				}
			});
			isPass?(this.success&&this.success()):(this.error&&this.error());
		}
	}
	//通过name名取得元素
	function $name(name){
		return document.getElementsByName(name);
	}
	
	//获得目标元素的值
	function getValue(name){
		var ele=$name(name),
			value=[];
		switch (ele[0].type){
			case "radio":
			case "select-one":
				value=ele[0].selectedIndex>=0?ele[0].options[ele[0].selectedIndex].value:""
				break;
			case "checkbox":
			case "select-multiple":
				each(ele,function(el){
					el.checked&&(value.push(el.value||0))
				});
				break;
			default :
				value=ele[0].value;
		}
		return value;
	}
	
	//用来剥离参数的type和赋的值
	function stripper(str){
		var str=str.split("|"),
			type=str.shift(),
			param;
		str.length>0&&(param=str.shift().split(rword));
		return {
			type:type,
			param:param
		}
	}
	
	//判断类型
	function returnType(obj){
		var str=Object.prototype.toString.call(obj);
		str=str.split(" ").pop();
		return str.substring(0,str.length-1).toLowerCase();
	}
	
	//判断是否是类数组元素
	function isArrayLike(obj) {
		var length = !!obj && "length" in obj && obj.length,
			type = returnType(obj);
		if ( type === "function" || (obj != null && obj === obj.window)) {
			return false;
		}
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	
	//迭代函数
	function each(ele,fn,canBreak){
		var length,result,
			i=0;
		if(isArrayLike(ele)){
			length=ele.length;
			for(;i<length;i++){
				result=fn.call(ele[i],ele[i],i);
				if(canBreak&&!result){
					return;
				}
			}
		}else{
			for(i in ele){
				result=fn.call(ele[i],ele[i],i);
				if(canBreak&&!result){
					return;
				}
			}
		}
	}
	return validate;
}); 