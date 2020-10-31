(function (window, mars3d) {
    //创建widget类，需要继承BaseWidget
    class MyWidget extends mars3d.widget.BaseWidget {
        //外部资源配置
        get resources() {
            return [
                'view.css'
            ]
        } 
        //弹窗配置
        get view() {
            return {
                type: "divwindow",
                url: "view.html",
                windowOptions: {
                    width: 210,
                    height: 210
                }
            }
        }
        //每个窗口创建完成后调用
        winCreateOK(opt, result) {
            var xy = this.getMapCenter();
            this.showLatlng(xy);

            var that = this;
            $("#btnCenterXY").click(function () {
                var jd = $("#point_jd").val();
                var wd = $("#point_wd").val();
                var height = $("#point_height").val();

                var val = { x: Number(jd), y: Number(wd), z: Number(height) };

                that.centerAt(val, true);
            });
        }
        //激活插件
        activate() {
            //单击地图事件
            this.viewer.mars.on(mars3d.event.click, this.onMapClick, this);
        }
        //释放插件
        disable() {
            //释放单击地图事件
            this.viewer.mars.off(mars3d.event.click, this.onMapClick, this);

            if (this.markerXY) {
                this.viewer.entities.remove(this.markerXY);
                this.markerXY = null;
            }
        }
        onMapClick(event) {
            var cartesian = mars3d.point.getCurrentMousePosition(this.viewer.scene, event.position);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

                var jd = Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
                var wd = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
                var height = Number(cartographic.height.toFixed(1));

                var val = { x: jd, y: wd, z: height };
                this.updateMarker(val);

                var wgsPoint = this.viewer.mars.point2wgs({ x: jd, y: wd }); //坐标转换为wgs
                jd = wgsPoint.x;
                wd = wgsPoint.y;

                this.showLatlng({ x: jd, y: wd, z: height });
            }
        }
        getMapCenter() {
            var point = mars3d.point.getCenter(this.viewer, true);
            return point;
        }
        centerAt(_latlng, iscenter) {
            var mpt = this.viewer.mars.point2map(_latlng); //坐标转换为map一致的坐标系 
            this.updateMarker(mpt, iscenter);
        }
        updateMarker(val, iscenter) {
            var position = Cesium.Cartesian3.fromDegrees(val.x, val.y, (val.z || 0));

            if (this.markerXY == null) {
                this.markerXY = this.viewer.entities.add({
                    name: '坐标拾取',
                    position: position,
                    billboard: {
                        image: this.path + "img/marker.png",
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
                        scale: 0.6
                    }
                });
            }
            else {
                this.markerXY.position = position;
            }

            if (iscenter) {
                this.viewer.mars.centerAt({ x: val.x, y: val.y });
            }

        }
        showLatlng(xy) {
            $("#point_jd").val(xy.x.toFixed(6));
            $("#point_wd").val(xy.y.toFixed(6));
            $("#point_height").val(xy.z.toFixed(0));
        }


    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
