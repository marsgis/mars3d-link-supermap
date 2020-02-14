/* 2017-9-28 16:04:24 | 修改 木遥（QQ：346819890） */
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
    //初始化[仅执行1次]
    create: function () {

    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        var layer = this.viewer.mars.getLayer('香港科技园');
        if (layer == null) return;

        layer.setVisible(true);
        layer.centerAt();
    },
    //关闭释放
    disable: function () {
        this.clear();
    },
    clear: function () {
        //var hyp = new Cesium.HypsometricSetting(); 
        //hyp.MaxVisibleValue = 0;
        //hyp.MinVisibleValue = 0;

        this.updateColor();
    },
    updateShadowType: function (hyp) {
        var layers = this.viewer.scene.layers.layerQueue;
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer == null) continue;
            layer.hypsometricSetting = {
                hypsometricSetting: hyp,
                analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
            };
        };
    },
    updateColor: function (params) {
        params = params || {};

        var hyp = new Cesium.HypsometricSetting();
        hyp.MaxVisibleValue = params.currentHeight || 0;
        hyp.MinVisibleValue = params.minValue || 0;

        //创建分层设色对象   设置最大/最小可见高度   颜色表  显示模式   透明度及线宽
        var colorTable = new Cesium.ColorTable();
        colorTable.insert(71, new Cesium.Color(0, 39 / 255, 148 / 255));
        colorTable.insert(0, new Cesium.Color(149 / 255, 232 / 255, 249 / 255));

        hyp.ColorTable = colorTable;
        hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
        hyp.Opacity = 0.5;
        hyp.LineInterval = 10.0;

        //设置图层分层设色属性
        this.updateShadowType(hyp);
    }



}));

