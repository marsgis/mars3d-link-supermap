/* 2017-9-28 16:04:24 | 修改 木遥（QQ：346819890） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 220,
                height: 110
            }
        },
    },
    handlerPolygon: null, 
    //初始化[仅执行1次]
    create: function () {
        var that = this;

        var handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
        handlerPolygon.drawEvt.addEventListener(function (result) {
            var polygon = result.object;
            if (!polygon) {
                return;
            }
            var positions = polygon.positions;

            var flatPoints = [];
            for (var i = 0, j = positions.length; i < j; i++) {
                var position = positions[i];
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                var lon = Cesium.Math.toDegrees(cartographic.longitude);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                var height = cartographic.height;
                flatPoints.push(lon);
                flatPoints.push(lat);
                flatPoints.push(height);
            }
            that.addRegion(flatPoints);
        });
        this.handlerPolygon = handlerPolygon;
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {

    },
    //关闭释放
    disable: function () {
        this.handlerPolygon.deactivate();
        //this.clear();
    },
    clear: function () {
        if (this.handlerPolygon.polygon)
            this.handlerPolygon.polygon.show = false;
        if (this.handlerPolygon.polyline)
            this.handlerPolygon.polyline.show = false;

        var layers = this.viewer.scene.layers.layerQueue;
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            layer.removeAllFlattenRegion();
        };
    },
    drawPolygon: function (height) {
        this.digHeight = height;
        haoutil.msg('请在图上绘制区域，单击开始，右击结束！');

        this.handlerPolygon.deactivate();
        this.handlerPolygon.clear();
        this.handlerPolygon.activate();
    }, 
    addRegion: function (positions) {
        if (this.handlerPolygon.polygon)
            this.handlerPolygon.polygon.show = false;
        if (this.handlerPolygon.polyline)
            this.handlerPolygon.polyline.show = false;

        var layers = this.viewer.scene.layers.layerQueue;
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            layer.addFlattenRegion({
                position: positions,
                name: 'flatten' + Math.random()
            }); 
        }; 
    }



}));

