/* 2017-11-30 16:56:24 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 310,
                height: 530
            }
        },
    },
    measure: null,
    //初始化[仅执行1次]
    create: function () {
        this.measure = new mars3d.analysi.Measure({
            viewer: this.viewer,
            label: {//可设置文本样式 
                "background": false,
            }
        })
        this.measure.on(mars3d.analysi.Measure.event.change, (e) => {
            this.viewWindow.onMeasureChange(e);
        });
        this.measure.on(mars3d.analysi.Measure.event.start, (e) => {//开始分析前回调(异步)
            haoutil.loading.show();
        });
        this.measure.on(mars3d.analysi.Measure.event.end, (e) => {//分析完成后回调(异步)
            haoutil.loading.hide();
            if (e.mtype == "section") {
                this.showSectionChars(e);
            }
            this.viewWindow.onMeasureEnd(e);
        });
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //激活插件
    activate: function () {

    },
    //释放插件
    disable: function () {
        this.viewWindow = null;
        this.clearDraw();
    },
    clearDraw: function () {
        this.measure.clear();
        mars3d.widget.disable(this.jkWidgetUri);
    },
    jkWidgetUri: 'widgets/measureChars/widget.js',
    showSectionChars: function (data) {
        mars3d.widget.activate({
            uri: this.jkWidgetUri,
            data: data
        });
    },
    changeOnlyPickModel: function (value) {
        //控制鼠标只取模型上的点，忽略地形上的点的拾取
        viewer.mars.onlyPickModelPosition = value
    }

}));