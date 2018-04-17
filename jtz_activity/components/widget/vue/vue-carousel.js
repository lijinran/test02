/**
 * Created by pdc on 2016/12/12.
 */
const Vue = require("vue");

Vue.component('vue-carousel', {
    template: `<div class="ui-swipe"> 
                    <ul class="ui-swipe-items-wrap" ref="wrap">
                        <li v-for="(item, $index) in items"><a><img :src="item.src"></a></li>
                    </ul>
                    <div class="ui-swipe-indicators" v-show="showIndicators">
                      <div class="ui-swipe-indicator"
                           v-for="(page, $index) in items"
                           :class="{ 'is-active': $index === index }"></div>
                    </div>
                  </div>`,
    props: {
        items: {
            type: Array,
            default: []
        },
        auto: {
            type: Boolean,
            default: true
        },
        showIndicators: {
            type: Boolean,
            default: true
        }
    },
    created() {
        this.point = {};
    },
    mounted() {},
    data() {
        return {
            index: 0,

        };
    },
    methods: {
        start() {},
        move() {},
        end() {}
    }
})