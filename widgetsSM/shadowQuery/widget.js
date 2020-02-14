/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 250,
                height: 320
            }
        },
    },
    handlerPolygon: null,
    shadowQuery: null,
    //初始化[仅执行1次]
    create: function () {
        var that = this;

        var handlerPolygon = new Cesium.DrawHandler(this.viewer, Cesium.DrawMode.Polygon, 0);
        handlerPolygon.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                that.viewer.enableCursorStyle = false;
                that.viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else {
                that.viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        handlerPolygon.movingEvt.addEventListener(function (windowPosition) {
            // tooltip.showAt(windowPosition, '<p>绘制阴影分析区域(右键结束绘制)</p>');
        });

        handlerPolygon.drawEvt.addEventListener(function (result) {
            // tooltip.setVisible(false);

            var polygon = result.object;
            if (!polygon) {
                return;
            }
            polygon.show = false;
            handlerPolygon.polyline.show = false;
            var positions = [].concat(polygon.positions);
            positions = Cesium.arrayRemoveDuplicates(positions, Cesium.Cartesian3.equalsEpsilon);

            //遍历多边形，取出所有点
            var points = [];
            for (var i = 0, len = positions.length; i < len; i++) {
                //转化为经纬度，并加入至临时数组
                var cartographic = Cesium.Cartographic.fromCartesian(polygon.positions[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                points.push(longitude);
                points.push(latitude);
            }
            that.qureyRegion(points);
        });
        this.handlerPolygon = handlerPolygon;
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    lastshadows: false,
    //打开激活
    activate: function () {
        this.lastshadows = this.viewer.shadows;
        this.viewer.shadows = true;
        this.updateShadowType(2);

        //创建阴影查询对象
        var shadowQuery = new Cesium.ShadowQueryPoints(this.viewer.scene);
        shadowQuery.queryPointsEvent.addEventListener(function (e) {
            haoutil.loading.close();
        });
        shadowQuery.build();

        this.shadowQuery = shadowQuery;
    },
    //关闭释放
    disable: function () {
        this.clear();
        if (this.shadowQuery) {
            this.shadowQuery.destroy();
            this.shadowQuery = undefined;
        }
        this.updateShadowType(0);
        this.viewer.shadows = this.lastshadows;
    },
    clear: function () {
        this.handlerPolygon.deactivate();
        if (this.handlerPolygon.polygon)
            this.handlerPolygon.polygon.show = false;
        if (this.handlerPolygon.polyline)
            this.handlerPolygon.polyline.show = false;

        this.shadowQuery.qureyRegion({
            position: [0, 0],
            bottom: 0,
            extend: 0
        });
    },
    updateShadowType: function (shadowType) {
        var layers = this.viewer.scene.layers.layerQueue;
        for (var i = 0; i < layers.length; i++) {
            layers[i].shadowType = shadowType;
        };
    },
    //设置当前时间
    setCurrentTime: function (params) {
        var endTime = new Date(params.date);
        endTime.setHours(params.ehour);

        this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(endTime);
        this.viewer.clock.multiplier = 1;
        this.viewer.clock.shouldAnimate = true;
    },
    startFX: function () {
        haoutil.msg('请在图上绘制区域，单击开始，右击结束！');

        this.handlerPolygon.deactivate();
        this.handlerPolygon.activate();
    },
    points: [],
    qureyRegion: function (points) {
        this.points = points;
        if (this.points == null || this.points.length == 0) return;

        var params = this.viewWindow.getFxParams();
        this.setCurrentTime(params);

        var startTime = new Date(params.date);
        startTime.setHours(params.shour);

        var endTime = new Date(params.date);
        endTime.setHours(params.ehour);

        this.shadowQuery.startTime = Cesium.JulianDate.fromDate(startTime);
        this.shadowQuery.endTime = Cesium.JulianDate.fromDate(endTime);
        this.shadowQuery.spacing = 10;
        this.shadowQuery.timeInterval = 60;

        //设置分析区域、底部高程和拉伸高度 
        haoutil.loading.show('正在分析');
        this.shadowQuery.qureyRegion({
            position: points,
            bottom: params.bottom,
            extend: params.extend
        });
    },
    updateStartTime: function (params) {
        if (this.points == null || this.points.length == 0) return;
        haoutil.loading.show('正在分析');

        var startTime = new Date(params.date);
        startTime.setHours(params.shour);
        this.shadowQuery.startTime = Cesium.JulianDate.fromDate(startTime);
    },
    updateEndTime: function (params) {
        if (this.points == null || this.points.length == 0) return;
        this.setCurrentTime(params);

        haoutil.loading.show('正在分析');

        var endTime = new Date(params.date);
        endTime.setHours(params.ehour);
        this.shadowQuery.endTime = Cesium.JulianDate.fromDate(endTime);
    },
    updateRegion: function (params) {
        if (this.points == null || this.points.length == 0) return;

        haoutil.loading.show('正在分析');
        this.shadowQuery.qureyRegion({
            position: this.points,
            bottom: params.bottom,
            extend: params.extend
        });
    },
    sunlight: function () {
        this.shadowQuery.qureyRegion({
            position: [0, 0],
            bottom: 0,
            extend: 0
        });
        var params = this.viewWindow.getFxParams();
        this.setCurrentTime(params);

        var shour = params.shour;
        var ehour = params.ehour;
        var startTime = new Date(params.date);
        startTime.setHours(shour);

        var nTimer = 0.0;
        var that = this;
        var nIntervId = setInterval(function () {
            if (shour < ehour) {
                startTime.setHours(shour);
                startTime.setMinutes(nTimer);
                viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime);
                nTimer += 10.0;
                if (nTimer > 60.0) {
                    shour += 1.0;
                    nTimer = 0.0;
                }
            } else {
                clearInterval(nIntervId);

                if (this.points && this.points.length > 0) {
                    haoutil.loading.show('正在分析');
                    that.shadowQuery.qureyRegion({
                        position: that.points,
                        bottom: params.bottom,
                        extend: params.extend,
                    });
                }
            }
        }, 20);

    }



}));

