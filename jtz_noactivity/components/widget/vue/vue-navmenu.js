/**
 * Created by lijinran on 2017年6月2日.
 */
let app = require("common");
const Vue = require("vue");
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

                { 'img': './static/images/' + __uri('fuli@hui.png'), activeImg: './static/images/' + __uri('fuli@active.png'), 'name': '兑换福利', 'url': 'exchange-welfare' },
                { 'img': './static/images/' + __uri('lipin@hui.png'), activeImg: './static/images/' + __uri('lipin@active.png'), 'name': '我的礼品', 'url': 'ucenter' },
                { 'img': './static/images/' + __uri('bang@hui.png'), activeImg: './static/images/' + __uri('bang@active.png'), 'name': '排行榜', 'url': 'ranking-list' }
            ],
            flag: this.isFlag
        };
    },

    methods: {
        isActive: function(index, url) {
            this.flag = index;
            console.log(index)
            app.linkTo(url)
        },
    }
})