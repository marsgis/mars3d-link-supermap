(function (window, mars3d) {
    //创建widget类，需要继承BaseWidget
    class MyWidget extends mars3d.widget.BaseWidget {


        //弹窗配置
        get view() {
            return {
                type: "window",
                url: "view.html",
                windowOptions: {
                    width: 280,
                    height: 300
                }
            }
        }


        //初始化[仅执行1次]
        create() {
            var viewer = this.viewer;

            var that = this;
            this.pointHandler = new Cesium.PointHandler(viewer);
            this.pointHandler.drawCompletedEvent.addEventListener(function (result) {
                var point = result.object;
                if (that.lastPoint) {
                    viewer.entities.remove(that.lastPoint);
                }
                that.lastPoint = point;

                that.startFX(point.position);
            });
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
            this.clearFX();
        }
        clearFX() {
            if (this.lastPoint) {
                viewer.entities.remove(this.lastPoint);
                this.lastPoint = null;
            }
            if (this.viewshed3D) {
                this.viewshed3D.destroy();
                this.viewshed3D = null;
            }
        }
        drawPoint() {
            //激活绘制点类
            this.pointHandler.activate();
        }
        updateViewshed3D(key, newValue) {
            this.viewshed3D[key] = parseFloat(newValue);
        }
        updateViewshed3DColor(key, newValue) {
            this.viewshed3D[key] = Cesium.Color.fromCssColorString(newValue);
        }
        startFX(position) {
            this.viewPosition = position;

            //将获取的点的位置转化成经纬度
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;


            //创建可视域分析对象
            if (this.viewshed3D == null) {
                this.viewshed3D = new Cesium.ViewShed3D(viewer.scene);
                this.viewshed3D.distance = 0.1;
                this.viewshed3D.visibleAreaColor = Cesium.Color.fromCssColorString(this.viewWindow.getVisibleAreaColor());
                this.viewshed3D.hiddenAreaColor = Cesium.Color.fromCssColorString(this.viewWindow.getHiddenAreaColor());
            }
            this.viewshed3D.viewPosition = [longitude, latitude, height];
            this.viewshed3D.build();


            var that = this;
            var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
            handler.setInputAction(function (e) {//鼠标移动时间回调
                //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
                var position = e.endPosition;
                var last = that.viewer.scene.pickPosition(position);

                //计算该点与视口位置点坐标的距离
                var distance = Cesium.Cartesian3.distance(that.viewPosition, last);

                if (distance > 0) {
                    //将鼠标当前点坐标转化成经纬度
                    var cartographic = Cesium.Cartographic.fromCartesian(last);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    var height = cartographic.height;

                    //通过该点设置可视域分析对象的距离及方向
                    that.viewshed3D.setDistDirByPoint([longitude, latitude, height]);
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            handler.setInputAction(function (e) {
                handler.destroy();
                that.viewWindow.updateVal(that.viewshed3D);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }


    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)



