/* 2017-9-28 16:04:24 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 500,
                height: 200
            }
        },
    },
    //初始化[仅执行1次]
    create: function () {

    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    data: null,
    //打开激活
    activate: function () {
        if (this.viewWindow)
            this.viewWindow.setEchartsData(this.config.data);
    },
    //内置方法，不重启方式刷新页面
    update: function () {
        if (this.viewWindow)
            this.viewWindow.setEchartsData(this.config.data);
    },
    //关闭释放
    disable: function () {
        this.viewWindow = null;
        this.hideTipMarker();
    },

    showTipMarker: function (point, z, inthtml) {
        var _position_show = Cesium.Cartesian3.fromDegrees(point.x, point.y, z)

        if (!this.tipMarker) {
            this.tipMarker = viewer.entities.add({
                name: "当前点",
                position: new Cesium.CallbackProperty(time => {
                    return this.tipMarker._position_show || _position_show;
                }, false),
                billboard: {
                    image: 'img/marker/mark3.png',
                    scale: 1,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.2)
                },
                tooltip: {
                    html: inthtml,
                    anchor: [0, -20],//左右、上下的偏移像素值。
                }
            });
        }
        this.tipMarker._position_show = _position_show
        this.tipMarker.tooltip.html = inthtml
        //   this.viewer.mars.tooltip.show(tipMarker);
    },

    hideTipMarker: function () {
        if (!this.tipMarker) return;
        this.viewer.entities.remove(this.tipMarker);
        this.tipMarker = null;
    }



}));

