(function (window, mars3d) {
    //创建widget类，需要继承BaseWidget
    class MyWidget extends mars3d.widget.BaseWidget {


        //弹窗配置
        get view() {
            return {
                type: "window",
                url: "view.html",
                windowOptions: {
                    width: 220,
                    height: 110
                }
            }
        }


        //初始化[仅执行1次]
        create() {
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
        }
        //每个窗口创建完成后调用
        winCreateOK(opt, result) {
            this.viewWindow = result;
        }
        //打开激活
        activate() {

        }
        //关闭释放
        disable() {
            this.handlerPolygon.deactivate();
            //this.clear();
        }
        clear() {
            if (this.handlerPolygon.polygon)
                this.handlerPolygon.polygon.show = false;
            if (this.handlerPolygon.polyline)
                this.handlerPolygon.polyline.show = false;

            var layers = this.viewer.scene.layers.layerQueue;
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];

                layer.removeAllFlattenRegion();
            };
        }
        drawPolygon(height) {
            this.digHeight = height;
            haoutil.msg('请在图上绘制区域，单击开始，右击结束！');

            this.handlerPolygon.deactivate();
            this.handlerPolygon.clear();
            this.handlerPolygon.activate();
        }
        addRegion(positions) {
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



    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)

