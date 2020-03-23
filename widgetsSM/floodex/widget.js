/* 2017-9-28 16:04:24 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 250,
                height: 240
            }
        },
    },
    hyp: null,
    //handlerPolygon: null,
    //positions: null,
    //初始化[仅执行1次]
    create: function () {
        var that = this;

        //创建分层设色对象
        var hyp = new Cesium.HypsometricSetting();
        //设置显示模式
        hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
        //设置线颜色为红色
        hyp._lineColor = new Cesium.Color(1.0, 0.0, 0.0, 1.0);
        //设置最大/最小可见高度
        hyp.MinVisibleValue = 0;
        //设置颜色表的最大/最小key值,表示高度
        hyp.ColorTableMinKey = 1;
        hyp.ColorTableMaxKey = 9000;
        //新建颜色表
        var colorTable = new Cesium.ColorTable();
        var height = 1;
        //每隔200m向颜色表插入一个随机色
        for (var i = 0; i < 90; i++) {
            height += 200;
            colorTable.insert(height, getRandomColor());
        }
        //返回随机颜色
        function getRandomColor() {
            return new Cesium.Color(Math.random(), Math.random(), Math.random());
        }
        hyp.ColorTable = colorTable;
        hyp.Opacity = 0.8;
        //等高线间隔为200m
        hyp.LineInterval = 200.0;
        this.hyp = hyp;

        //var handlerPolygon = new Cesium.DrawHandler(this.viewer, Cesium.DrawMode.Polygon, Cesium.ClampMode.Ground);
        //handlerPolygon.drawEvt.addEventListener(function (result) {
        //    var polygon = result.object;
        //    if (!polygon) {
        //        return;
        //    }
        //    var min = 0;
        //    var max = 0;

        //    var array = [].concat(polygon.positions);
        //    var positions = [];
        //    for (var i = 0, len = array.length; i < len; i++) {

        //        var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
        //        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        //        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        //        var h = cartographic.height;
        //        if (h < 0) h = 0;
        //        if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
        //            positions.push(longitude);
        //            positions.push(latitude);
        //            positions.push(h);

        //            if (h > min) min = h;
        //            if (h < max) max = h;
        //        }
        //    }
        //    that.positions = positions;
        //    if (max > 0)
        //        that.viewWindow.updateHeight(min, max);
        //});
        //this.handlerPolygon = handlerPolygon;
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        ////设置相机视角
        this.viewer.mars.centerAt({ "y": 40.936107, "x": 116.818626, "z": 192616.1, "heading": 57.3, "pitch": -73.5, "roll": 0 });
    },
    //关闭释放
    disable: function () {
        this.clear();
    },
    clear: function () {
        //this.handlerPolygon.deactivate();
        //this.handlerPolygon.clear();
        //if (this.handlerPolygon.polygon)
        //    this.handlerPolygon.polygon.show = false;
        //if (this.handlerPolygon.polyline)
        //    this.handlerPolygon.polyline.show = false;
         
        this.hyp.MaxVisibleValue = 0;
        this.updateShadowType();
    },
    showMsg: function (msg) {
        haoutil.msg(msg);
    },
    //drawPolygon: function () {
    //    haoutil.msg('请在图上绘制区域，单击开始，右击结束！');

    //    this.handlerPolygon.deactivate();
    //    this.handlerPolygon.clear();
    //    this.handlerPolygon.activate();
    //},
    start: function () {
        var point = mars3d.point.getCenter(this.viewer);
        
    },
    updateShadowType: function () {
        this.viewer.scene.globe.HypsometricSetting = {
            hypsometricSetting: this.hyp,
            analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
        }
    },
    updateColor: function (params) {
        //if (this.handlerPolygon.polygon)
        //    this.handlerPolygon.polygon.show = false;
        //if (this.handlerPolygon.polyline)
        //    this.handlerPolygon.polyline.show = false;
         
        this.hyp.MaxVisibleValue = params.currentHeight;
        this.hyp.MinVisibleValue = params.minValue;
        this.hyp.CoverageArea = this.positions;

        //设置图层分层设色属性
        this.updateShadowType();
    }



}));

