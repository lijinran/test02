/**
 * Created with JetBrains WebStorm.
 * User: lam
 * Time: 2016/8/1
 */

    let $=require("$");
    var dial = function(options){

        //创建默认选项
        var defaults = {
            dom:"",//要转动的图片的id或者class
            type:"dial",//转盘滚动还是扇形滚动,默认是转盘，sector扇形，dial转盘
            status:"start",//开始转动还是结束转动，start：开始赚到，end，停止转动并且指向对应的位置
            end:"",//结束时停止的位置的deg值
            left:"",//扇形到最右边的距离
            right:""//扇形到最左边的距离

        };

        if(options){
            for(var k in options){
                if(options.hasOwnProperty(k)){
                    defaults[k] = options[k];
                }
            }
        };
        //定义全局变量
        require.dialDefaults = defaults;

        //处理展示的效果
        //s判断扇形左转还是右转,表示一个状态
        var deg = 360, s,sector1,sector2;
        //转盘效果处理
        function dial(deg){
            $(defaults['dom']).animate({'-webkit-transform':'rotateZ('+deg+'deg)','transform':'rotateZ('+deg+'deg)'}, 200, 'linear',dialCheck);
        }
        function dialEnd(deg){
            $(defaults['dom']).animate({'-webkit-transform':'rotateZ('+deg+'deg)','transform':'rotateZ('+deg+'deg)'}, 1000, 'ease-out');
        }
        function dialCheck(){
            if(require.dialDefaults['status'] == "start"){
                deg += 360;
                dial(deg);
            }else{
                deg = deg + 360 + parseInt(require.dialDefaults['end']);
                dialEnd(deg);
            }
        }

        //扇形效果处理
        function sector(){
            if (require.dialDefaults['status'] == "start"){
                if(s>1){
                    sectorLeft(sector2);
                }else{
                    sectorRight(sector1);
                }
            }else{
                sectorEnd(parseInt(require.dialDefaults['end']));
            }
        }
        function sectorRight(sector1){
            s = s + 1;
            $(defaults['dom']).animate({'-webkit-transform':'rotateZ('+sector1+'deg)','transform':'rotateZ('+sector1+'deg)'}, 200, 'linear',sector);
        }
        function sectorLeft(sector2){
            s = s - 1;
            $(defaults['dom']).animate({'-webkit-transform':'rotateZ('+sector2+'deg)','transform':'rotateZ('+sector2+'deg)'}, 200, 'linear',sector);
        }
        function sectorEnd(sector){
            if(s == 1){
                $(defaults['dom']).animate({'-webkit-transform':'rotateZ('+sector1+'deg)','transform':'rotateZ('+sector1+'deg)'}, 400, 'linear',function(){
                    $(defaults['dom']).animate({'-webkit-transform':'rotateZ('+sector+'deg)','transform':'rotateZ('+sector+'deg)'}, 600, 'ease-out');
                });
            }else{
                $(defaults['dom']).animate({'-webkit-transform':'rotateZ('+sector2+'deg)','transform':'rotateZ('+sector2+'deg)'}, 400, 'linear',function(){
                    $(defaults['dom']).animate({'-webkit-transform':'rotateZ('+sector+'deg)','transform':'rotateZ('+sector+'deg)'}, 600, 'ease-out');
                });
            }
        }


        //区分转盘还是扇形，并且运行
        if(defaults['type'] == "dial"){//dial:转盘，其他的都是扇形
            //判断是否要停止转动，并指向指定的位置
            if(defaults['status'] == "start"){
                dial(deg);
            }else{
                require.dialDefaults['status'] = "end";
            }
        }else{
            //判断是否要停止转动，并指向指定的位置
            if(defaults['status'] == "start"){
                s=1;
                sector1 = defaults['right'];
                sector2 = defaults['left'];
                sectorRight(defaults['right']);
            }else{
                require.dialDefaults['status'] = "end";
            }
        }
    }
    module.exports= dial;
