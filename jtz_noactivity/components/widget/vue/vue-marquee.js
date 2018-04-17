/**
 * Created by dio on 2017年4月13日19:15:13.
 */
const Vue = require("vue");
let dMarquee = require("dMarquee");
let hornName = __uri('../../common/images/horn.png');
Vue.component('vue-marquee', {
    template: `<div class="m-tipRollDiv g-con">
                <div class="m-ScrollAround">
                    <div class="u-right">
                        <div v-if="timeText==0"> 活动未开启！</div>
                        <div v-else-if="timeText==2" style="width: 100%;margin-right:0">活动已结束！</div>
                        <ul id="marquee" v-else="timeText==1" >
                                  <li v-for="el in scrollWin" v-html="el" style="width: 100%;margin-right:0"></li> 
                        </ul>
                    </div>
                    <div class="clearfix"></div>
                </div>
               
                </div>`,
    props: {
        scrollWin: {
            type: Array,
            default: Array
        },
        /*scrollPrize: {
            type: Array,
            default: Array
        },*/
        timeText: {
            type: Number,
            default: 0
        }
    },
    created() {
        // this.point = {};
    },
    mounted() {

    },
    data() {
        return {
            index: 0

        };
    },
    updated: function() {
        dMarquee.init({
            id: "#marquee",
            direction: "left", //滚动方向，"left","right","up","down"
            scrollDelay: 2000 //时长
        });
        /*dMarquee.init({
            id: "#marqueeUp",
            direction: "up", //滚动方向，"left","right","up","down"
            scrollDelay: 3000, //时长 marqueeUp
            liH: 22
        })*/
    },
    methods: {
        start() {},
        move() {},
        end() {}
    }
})