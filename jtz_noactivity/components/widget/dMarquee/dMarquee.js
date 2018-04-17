/**
 * @classDescription 模拟Marquee，无间断滚动内容
 * @author diogo
 * @DOM
 *  	<div id="marquee">
 *  		<ul>
 *   			<li></li>
 *   			<li></li>
 *  		</ul>
 *  	</div>
 * @CSS
 *  	#marquee {overflow:hidden;width:200px;height:50px;}
 * @Usage
 *  	$("#marquee").Marquee(options);
 * @options
 *		isEqual:true,		//所有滚动的元素长宽是否相等,true,false
 *  	loop:0,				//循环滚动次数，0时无限
 *		direction:"left",	//滚动方向，"left","right","up","down"
 *		scrollAmount:1,		//步长
 *		scrollDelay:20		//时长
 */


var $ = require('$')
var DOC = document;
var WIN = window;


function __dMarquee(options) {
    this.options = {
        bgSwitch: true
    };
    for (var name in options) {
        this.options[name] = options[name];
    }

}

__dMarquee.prototype = {
    constructor: __dMarquee
}

var dMarquee = (function() {

    return {

        init: function(opts) {
            var $items = $(opts.id),
                $element = $(opts.id).children(),
                // $kids = $element.children(),
                lastTime = 0,
                nextFrame = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    var currTime = +new Date,
                        delay = Math.max(1000 / 60, 1000 / 60 - (currTime - lastTime));
                    lastTime = currTime + delay;
                    return setTimeout(callback, delay);
                },
                cancelFrame = window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout,

                scrollX = 0, // 横向
                scrollY = 0, // 竖向
                itemW = $items.children().eq(0).width(),
                itemH = $items.children().eq(0).height(),
                targetX = 0,
                targetY = 0,
                timer = null;

            targetX = itemW * $items.children().length;
            targetY = itemH * $items.children().length;




            $items.append($element.clone());


            function ainit() {

                timer = nextFrame(function() {
                    scrollX += 1;
                    scrollX >= targetX && (scrollX = 0);
                    $items.scrollLeft(scrollX);
                    ainit();
                });
            }


            if (opts.direction == 'up') {
                autoScroll($items)
            } else {
                ainit();

            }



            function autoScroll(obj) {
                var liH = $(obj).find("li").height() || opts.liH;
                var $parent = $(obj)
                var $first = $(obj).find('li:first');

                setInterval(function() {
                    $first = $(obj).find('li:first');
                    $parent.animate({
                        marginTop: -liH //或者改成： marginTop: -height + 'px'
                    }, 500, function() { // 动画结束后，把它插到最后，形成无缝
                        $parent.css('marginTop', 0);
                        $first.appendTo($parent);
                    });
                }, opts.scrollDelay);
            }


        },





    }

})();


module.exports = dMarquee