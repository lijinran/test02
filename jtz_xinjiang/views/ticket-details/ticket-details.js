/**
 * Created by ljr on 2017/5/31.
 */
require(["vue", "common", "apiData", "dialog"], function(Vue, app, api, dialog) {
    let WIN = window,
        DOC = document;
    const HEIGTH = WIN.innerHeight > 0 ? WIN.innerHeight : DOC.documentElement.clientHeight;

    let vm = new Vue({
        el: "#app",
        data: {
            screenH: HEIGTH,
        },
        mounted: function() {},
        filters: {},
        methods: {

        },
        computed: {}

    });

});