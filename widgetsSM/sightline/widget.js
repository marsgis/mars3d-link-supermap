/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 300,
                height: 100
            }
        },
    },
    pointHandler: null,
    //初始化[仅执行1次]
    create: function () {
        var that = this;
        var pointHandler = new Cesium.PointHandler(viewer);
        pointHandler.drawCompletedEvent.addEventListener(function (result) {
            var point = result.object;
            var position = point.position;

            //将获取的点的位置转化成经纬度
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;

            point.label = mars3d.draw.attr.label.style2Entity({
                "font_size": 16,
                "color": "#ffffff",
                "border": true,
                "border_color": "#000000",
                "pixelOffset": [0, -10],
                "distanceDisplayConditionFar": 20000
            });

            var jwd = [longitude, latitude, height];
            if (that.pointType == 0) {
                point.label.text = '观察位置';
                point.color = Cesium.Color.fromCssColorString("#3388ff");

                that.addStartPointOK(jwd, point);
            }
            else {
                point.label.text = '目标点';
                point.color = Cesium.Color.fromCssColorString("#0000ff");

                that.addEndPointOK(jwd, point);
            }
        });
        this.pointHandler = pointHandler;
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    sightline: null,
    //打开激活
    activate: function () {

        //创建天际线分析对象 
        var sightline = new Cesium.Sightline(this.viewer.scene);
        sightline.couldRemove = false;
        this.sightline = sightline;
    },
    //关闭释放
    disable: function () {
        this.clear();
        if (this.pointStart) {
            this.viewer.entities.remove(this.pointStart);
            this.pointStart = null;
        }
        if (this.sightline) {
            this.sightline.destroy();
            this.sightline = undefined;
        }
    },
    clear: function () {
        if (this.arrPointEnd && this.arrPointEnd.length > 0) {
            for (var i in this.arrPointEnd) {
                this.viewer.entities.remove(this.arrPointEnd[i]);
            }
            this.arrPointEnd = [];
        }
        if (this.sightline) {
            this.sightline.removeAllTargetPoint();
            this.sightline.couldRemove = false;
        }
    },
    pointType: 0,//start:0,end:1
    //添加观察点
    addStartPoint: function () {
        this.pointType = 0;
        this.pointHandler.activate();
    },
    pointStart: null,
    addStartPointOK: function (jwd, point) {
        if (this.pointStart) {
            this.viewer.entities.remove(this.pointStart);
            this.pointStart = null;
        }
        this.pointStart = point;

        this.sightline.build();
        this.sightline.viewPosition = jwd;
    },
    //添加目标点
    addEndPoint: function () {
        this.pointType = 1;
        this.pointHandler.activate();
    },
    arrPointEnd: [],
    addEndPointOK: function (jwd, point) {
        this.arrPointEnd.push(point);

        this.sightline.addTargetPoint({
            position: jwd,
            name: "point" + new Date()
        });
        this.sightline.couldRemove = true;
    },


}));

