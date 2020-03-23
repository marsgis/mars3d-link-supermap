/* 2017-9-28 16:04:24 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 270,
                height: 300
            }
        },
    },
    slope: null,
    analysisMode: null,
    handlerPolygon: null, 
    //初始化[仅执行1次]
    create: function () {
        var that = this;
        
        var colorTable = new Cesium.ColorTable();
        colorTable.insert(0, new Cesium.Color(255 / 255, 0 / 255, 0 / 255));
        colorTable.insert(20, new Cesium.Color(221 / 255, 224 / 255, 7 / 255));
        colorTable.insert(30, new Cesium.Color(20 / 255, 187 / 255, 18 / 255));
        colorTable.insert(50, new Cesium.Color(0, 161 / 255, 1));
        colorTable.insert(80, new Cesium.Color(9 / 255, 9 / 255, 255 / 255));

        var slope = new Cesium.SlopeSetting();
        slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
        slope.MinVisibleValue = 0;//document.getElementById("widemin").value;
        slope.MaxVisibleValue = 78;//document.getElementById("widemax").value;
        slope.ColorTable = colorTable;
        slope.Opacity = 0.5;
        this.slope = slope;
        this.analysisMode = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;

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
                if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
                    positions.push(longitude);
                    positions.push(latitude);
                    positions.push(h);
                }
            } 
            that.slopeAnalysis(positions);
        });
        this.handlerPolygon = handlerPolygon;
        if (!viewer.scene.pickPositionSupported) {
            haoutil.alert('不支持深度纹理,无法绘制多边形，根据多边形显示分析区域功能无法使用！');
        }
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        //viewer.scene.camera.setView({
        //    destination: Cesium.Cartesian3.fromDegrees(87.1, 27.8, 8000.0),
        //    orientation: {
        //        heading: 6.10547067016156,
        //        pitch: -0.8475077031996778,
        //        roll: 6.2831853016686185
        //    }
        //});
    },
    //关闭释放
    disable: function () {
        this.handlerPolygon.deactivate();
        this.clear();
    },
    clear: function () {
        if (this.handlerPolygon.polygon)
            this.handlerPolygon.polygon.show = false;
        if (this.handlerPolygon.polyline)
            this.handlerPolygon.polyline.show = false;

        this.viewer.scene.globe.SlopeSetting = {
            slopeSetting: this.slope,
            analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE
        };
    },
    drawPolygon: function (height) {
        this.digHeight = height;
        haoutil.msg('请在图上绘制区域，单击开始，右击结束！');

        this.handlerPolygon.deactivate();
        this.handlerPolygon.clear();
        this.handlerPolygon.activate();

        this.analysisMode = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
    },
    digHeight: 500,
    slopeAnalysis: function (positions) {
        
        if (this.handlerPolygon.polygon)
            this.handlerPolygon.polygon.show = false;
        if (this.handlerPolygon.polyline)
            this.handlerPolygon.polyline.show = false;

        this.slope.CoverageArea = positions;
        this.viewer.scene.globe.SlopeSetting = {
            slopeSetting: this.slope,
            analysisMode: this.analysisMode
        };
    }, 
    updateMode: function (index) {
        
        var wide;
        switch (index) {
            default:
            case 0://指定多边形区域
                wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
                break;
            case 1://全部区域参与分析
                wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL;
                break;
            case 2://全部区域不参与分析
                wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
                break;
        }
        this.analysisMode = wide;
         
        this.viewer.scene.globe.SlopeSetting = {
            slopeSetting: this.slope,
            analysisMode: this.analysisMode
        };
    },
    updateSlope: function (key, value) {
        if (key = "DisplayMode") {
            switch (value) {
                case 'FACE': 
                    value = Cesium.SlopeSettingEnum.DisplayMode.FACE;
                    break;
                case 'ARROW':
                    value = Cesium.SlopeSettingEnum.DisplayMode.ARROW;
                    break;
                default:
                case 'FACE_AND_ARROW':
                    value = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
                    break;
            }
        }
        this.slope[key] = value;  
        this.viewer.scene.globe.SlopeSetting = {
            slopeSetting: this.slope,
            analysisMode: this.analysisMode
        };
    }



}));

