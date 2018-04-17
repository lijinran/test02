/**
 * Created by Rodey on 2015/8/10.
 *
 * use:
 *          var timeouter = new Timeouter({
                time: 10,
                dom: '#send-code-btn',
                before: function(){
                    console.log('....Before....');
                },
                doing: function(){
                    console.log('....Doing....', this.time);
                },
                complate: function(){
                    console.log('...Complate...', this);
                }
            });

            timeouter.start();
 *
 */

;(function(){

    var Timeouter = function (options){
        var options = options;
        this.init(options);

    };

    Timeouter.prototype = {
        construct: Timeouter,
        init: function(options){
            this._stin = null;
            this.time = options.time || 60;
            this.dom = document.querySelector('#' + options.dom.replace('#', ''));
            this.before = options.before;
            this.doing = options.doing;
            this.complate = options.complate;
            this.target = options.targetObject;
            this.complateText = options.complateText || '获取验证码';
        },
        start: function(){
            var self = this;
            (this.before && 'function' === typeof(this.before)) && this.before.call(this.target || this);

            this._stin = window.setInterval(function(){
                if(0 > self.time){
                    self._action(false);
                    (self.complate && 'function' === typeof(self.complate)) && self.complate.call(self.target || self);
                    self.remove();
                    return;
                }
                (self.doing && 'function' === typeof(self.doing)) && self.doing.call(self.target || self);

                self._action(true);
                self.time--;
            }, 1000);
        },
        stop: function(){
            window.clearInterval(this._stin);
        },
        remove: function(){
            window.clearInterval(this._stin);
            this._stin = null;
            this.time = 0;
            this.dom = null;
            this.cb = null;
            this.target = null;
            this.complateText = '获取验证码';
        },
        _action: function(flag){
            var self = this;
            if(true === flag){
                if(self.dom){
                    self.dom.classList.add('disabled');
                    self.dom.setAttribute('disabled', 'disabled');
                    self.dom.innerHTML = self.time + 's';
                }
            }else{
                if(self.dom){
                    self.dom.classList.remove('disabled');
                    self.dom.removeAttribute('disabled');
                    self.dom.innerHTML = self.complateText;
                }
            }
        }
    };

    window.Timeouter = Timeouter;

}).call(this);
