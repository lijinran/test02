/**
 * Created by lijinran on 2017年6月2日.
 */
const Vue = require("vue");
let app = require('common');
let nav0 = __uri("../../common/images/fanpai@hui.png");
let nav0on = __uri("../../common/images/fanpai@active.png");
let nav1 = __uri("../../common/images/fuli@hui.png");
let nav1on = __uri("../../common/images/fuli@active.png");
let nav2 = __uri("../../common/images/lipin@hui.png");
let nav2on = __uri("../../common/images/lipin@active.png");
let nav3 = __uri("../../common/images/bang@hui.png");
let nav3on = __uri("../../common/images/bang@active.png");
let nav4 = __uri("../../common/images/ranking@hui.png");
let nav4on = __uri("../../common/images/ranking@active.png");
let dialog = require("dialog");

//2017年9月28日23:56:2
let ext = require("extend");
Vue.component('vue-navmenu', { //注意大小写
    template: `<div class="navMenu-div">
            <ul>
                <li v-for='(el,index) in navMenu' @click="isActive(index,el.url)">
                    <img v-if="flag==index" :src="el.activeImg" alt="" />
                    <img v-else :src="el.img" alt="" />
                    <p :class="{isActive:flag==index}">{{el.name}}</p>
                </li>
            </ul>
        </div>`,
    props: {
        isFlag: { //接收值
            type: Number
        }
    },
    created() {
        // this.point = {};
    },
    mounted() {

    },
    data() {
        return {
            navMenu: [
                // {
                //     'img': `static/${nav0}`,
                //     'activeImg': `static/${nav0on}`,
                //     'name': '翻牌',
                //     'url': 'draw'
                // },
                {
                    'img': `static/${nav1}`,
                    'activeImg': `static/${nav1on}`,
                    'name': '兑换福利',
                    'url': 'exchange-welfare'
                },
                {
                    'img': `static/${nav2}`,
                    'activeImg': `static/${nav2on}`,
                    'name': '我的礼品',
                    'url': 'ucenter'
                }
                // {
                //     'img': `static/${nav3}`,
                //     'activeImg': `static/${nav3on}`,
                //     'name': '排行榜',
                //     'url': 'ranking-list'
                // },
                // {
                //     'img': `static/${nav4}`,
                //     'activeImg': `static/${nav4on}`,
                //     'name': '周冠军',
                //     'url': 'week-ranking'
                // }
            ],
            flag: this.isFlag
        };
    },

    methods: {
        isActive: function (index, url) {
            this.flag = index;

            //限制点击一欠
            ext.bannedClick(function () {
                app.linkTo(url, {
                    v: '20171001'
                })
            })

        },
    }
})