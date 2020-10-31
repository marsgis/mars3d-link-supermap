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
                    height: 150
                }
            }
        }


        //初始化[仅执行1次]
        create() {
            this.digHeight = 500

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

            this.viewer.scene.globe.removeAllExcavationRegion();
        }
        drawPolygon(height) {
            this.digHeight = height;
            haoutil.msg('请在图上绘制区域，单击开始，右击结束！');

            this.handlerPolygon.deactivate();
            this.handlerPolygon.clear();
            this.handlerPolygon.activate();
        }
        digTerrain(positions) {
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



    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d) 