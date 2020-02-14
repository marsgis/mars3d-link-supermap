/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 280,
                height: 300
            }
        },
    },
    pointHandler: null,
    lastPoint: null, //最后一次视域点（方便清除）
    //初始化[仅执行1次]
    create: function () {
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
        this.clearFX();
    },
    clearFX: function () {
        if (this.lastPoint) {
            viewer.entities.remove(this.lastPoint);
            this.lastPoint = null;
        }
        if (this.viewshed3D) {
            this.viewshed3D.destroy();
            this.viewshed3D = null;
        }
    },
    drawPoint: function () {
        //激活绘制点类
        this.pointHandler.activate();
    },
    viewPosition: null,//视域点
    viewshed3D: null,
    updateViewshed3D: function (key, newValue) {
        this.viewshed3D[key] = parseFloat(newValue);
    },
    updateViewshed3DColor: function (key, newValue) {
        this.viewshed3D[key] = Cesium.Color.fromCssColorString(newValue);
    },
    startFX: function (position) { 
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





}));

