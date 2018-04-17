/**
 * Created by pdc on 2016/8/5.
 */
'use strict';
(function(root, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory); //Register as a module.
    } else {
        root.slide = factory();
    }
})(this, function(){
    /**
     * pictureCarousel
     * 移动端图片轮播组件
     * @param el  目标元素，目标元素里面放置一个div
     * @param options  配置项，可配参数为：
     *				auto:true||false-----是否自动播放，目前函数设定是只在轮播时此参数才有效
     *				loop:true||false------是否循环播放
     *				pageIndex:true||false-------是否显示图片索引（小圆点）和文字
     *				imgUrl--------配置图片地址，链接地址，文字说明
     *							  [["图片地址","图片链接网址","图片对应文字"],["图片地址","图片链接网址","图片对应文字"]]
     * @return
     */
    let doc=document;
    function pictureCarousel(el,options){
        this.el=typeof el=="string"?doc.querySelector(el):el;
        this.scroller=this.el.children[0];
        this.width=this.scroller.clientWidth;
        this.moveStatu=false;
        this.num=null;
        this.time=null;
        this.index=0;
        this.startX=0;
        this.startY=0;
        this.directionX=0;
        this.directionY=0;
        this.options={
            auto:true,
            loop:true,
            pageIndex:true,
            imgUrl:[]
        }
        for(var i in options){this.options[i]=options[i]}
        this.init()
    }
    pictureCarousel.prototype={
        init:function(){
            var l=this.options.imgUrl.length,Html=[],L=l;
            if(!this.el||l<0){return}
            for(var i=0;i<l;i++){
                Html[i]="<li style='width:"+this.width+"px'><a href='"+(this.options.imgUrl[i][1]||"javascript:void(0)")+"'><img src='"+this.options.imgUrl[i][0]+"'>";
                Html[i]+=this.options.imgUrl[i][2]?"<div class='banner-word'>"+this.options.imgUrl[i][2]+"</div></a></li>":"</a></li>";
            }
            if(l>1){
                var touchstart,touchmove,touchend,touchcancel;
                "ontouchstart" in document?(touchstart="touchstart",touchmove="touchmove",touchcancel="touchcancel",touchend="touchend",this.el.addEventListener(touchmove,this,false)):(touchstart="mousedown",touchmove="mousemove",touchcancel="mouseout",touchend="mouseup")
                this.el.addEventListener(touchstart,this,false);
                this.el.addEventListener(touchcancel,this,false);
                this.el.addEventListener(touchend,this,false);
                if(this.options.loop){
                    var first=Html[0],L=L+2;this.index=1;
                    Html.unshift(Html[l-1]);Html.push(first);
                }
            }
            this.scroller.style.width=this.width*L+"px";
            this.scroller.style.webkitTransitionDuration=0;
            this.scroller.style.transitionDuration=0;
            this.scroller.style.webkitTransform="translate3d("+(-this.index*this.width)+"px,0,0)";
            this.scroller.style.transform="translate3d("+(-this.index*this.width)+"px,0,0)";
            this.scroller.innerHTML=Html.join("");
            if(this.options.pageIndex){
                var fragment=doc.createDocumentFragment(),
                    div=document.createElement("div");
                div.className="banner-num"
                for(var i=0;i<l;i++){
                    var a=doc.createElement("a")
                    div.appendChild(a)
                }
                fragment.appendChild(div)
                this.el.appendChild(fragment)
                this.num=this.el.querySelector(".banner-num").children;
                this.num[0].classList.add("active");
            }
            this.options.auto&&this._auto()
        },
        _start:function(e){
            this.options.auto&&clearInterval(this.time)
            var toucher=e.touches ? e.touches[0] : e;
            this.startX=toucher.pageX;
            this.startY=toucher.pageY;
            this.directionX=0;
            this.directionY=0;
            this.moveStatu=false;
            if(e.type==="mousedown"){this.el.addEventListener("mousemove",this,false);this.el.addEventListener("mousecancle",this,false)}
        },
        _move:function(e){
            var toucher=e.touches ? e.touches[0] : e,l=this.options.imgUrl.length;
            e.preventDefault();
            this.directionX=parseInt(toucher.pageX-this.startX,10);
            this.directionY=parseInt(toucher.pageY-this.startY,10);
            var direction=Math.abs(this.directionX)/this.directionX;
            if(Math.abs(this.directionX)>10){
                if(this.options.loop){
                    direction>0?((this.index==0)&&(this.index=l)):((this.index==l+1)&&(this.index=1))
                    this.moveStatu=true;
                }else{
                    ((this.index>0&&this.index<l-1)||((this.index==0)&&direction<0)||((this.index==l-1)&&direction>0))&&(this.moveStatu=true)
                }
            }
            if(this.moveStatu){
                this.scroller.style.webkitTransitionDuration=0;
                this.scroller.style.transitionDuration=0;
                this.scroller.style.webkitTransform="translate3d("+(-this.index*this.width+this.directionX)+"px,0,0)";
                this.scroller.style.transform="translate3d("+(-this.index*this.width+this.directionX)+"px,0,0)";
            }
        },
        _end:function(e){
            if((e.type==="mouseup"||e.type==="mousecancle")){this.el.removeEventListener("mousemove",this,false);this.el.removeEventListener("mousecancle",this,false)}
            if(this.moveStatu){
                this.index=this.index-Math.abs(this.directionX)/this.directionX;
                this._translate(this.index,300)
                this.moveStatu=false;
            }
            if(this.options.auto){
                var _this=this,l=this.options.imgUrl.length;
                this.time=setInterval(function(){
                    _this.index++;if(_this.index>l){_this.index=_this.index-l;}
                    _this._translate(_this.index,300);


                },2500)
            }
        },
        _auto:function(){
            var _this=this,l=this.options.imgUrl.length;
            if(!this.options.loop||l<2){return}
            this.time=setInterval(function(){
                _this.index++;if(_this.index>l){_this.index=_this.index-l;}
                _this._translate(_this.index,300);

            },2500)
        },
        _translate:function(index,speed){
            this.scroller.style.webkitTransitionDuration=this.scroller.style.transitionDuration=speed+"ms";
            this.scroller.style.transitionDuration=this.scroller.style.transitionDuration=speed+"ms";
            this.scroller.style.webkitTransform="translate3d("+(-index*this.width)+"px,0,0)";
            this.scroller.style.transform="translate3d("+(-index*this.width)+"px,0,0)";
            if(this.options.pageIndex){
                var l=this.options.imgUrl.length,_index=index;
                if(this.options.loop){
                    if(index>0&&index<l+1){_index=index-1}else{index==0?(_index=l-1):(_index=0)}
                }
                for(var i=0;i<l;i++){this.num[i].classList.remove("active")}
                this.num[_index].classList.add("active");
            }
        },
        handleEvent:function(e){
            switch(e.type){
                case 'touchstart':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'touchcancel':
                case 'mouseup':
                    this._end(e);
                    break;
            }
        }
    };
    return pictureCarousel;
})