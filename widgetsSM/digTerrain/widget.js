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
                height: 150
            }
        },
    },
    handlerPolygon: null,
    positions: null,
    //初始化[仅执行1次]
    create: function () {
        var that = this;

        var handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
        handlerPolygon.drawEvt.addEventListener(function (result) {
            var polygon = result.object;
            if (!polygon) {
                return;
            }

            var array = [].concat(polygon.positions);
            var positions = [];
            for (var i = 0, len = array.length; i < len; i++) {

                var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var h = cartographic.height;
                if (h < 0) h = 0;
                if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
                    positions.push(longitude);
                    positions.push(latitude);
                    positions.push(h);
                }
            }
            that.positions = positions;
            that.digTerrain(positions);
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

        this.viewer.scene.globe.removeAllExcavationRegion();
    },
    drawPolygon: function (height) {
        this.digHeight = height;
        haoutil.msg('请在图上绘制区域，单击开始，右击结束！');

        this.handlerPolygon.deactivate();
        this.handlerPolygon.clear();
        this.handlerPolygon.activate();
    },
    digHeight: 500,
    digTerrain: function (positions) {
        if (this.handlerPolygon.polygon)
            this.handlerPolygon.polygon.show = false;
        if (this.handlerPolygon.polyline)
            this.handlerPolygon.polyline.show = false;

        this.viewer.scene.globe.removeAllExcavationRegion();
        this.viewer.scene.globe.addExcavationRegion({
            name: 'digTerrain' + new Date(),
            position: positions,
            height: this.digHeight,
            transparent: false
        });
    }



}));

