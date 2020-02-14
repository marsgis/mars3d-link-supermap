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
                height: 320
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
    skyline:null,
    //打开激活
    activate: function () {
 
        //创建天际线分析对象
        var skyline = new Cesium.Skyline(this.viewer.scene); 
        this.skyline = skyline;
    },
    //关闭释放
    disable: function () {
        this.clear();
        if (this.skyline) {
            this.skyline.destroy();
            this.skyline = undefined;
        }
    },
    clear: function () {
        this.skyline.clear();
    },
    getSkyline: function () {
        this.clear();

        var scene = this.viewer.scene;

        var bookmark = mars3d.point.getCameraView(this.viewer);
        
        var cartographic = scene.camera.positionCartographic;
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var height = cartographic.height;

        //天际线分析的视口位置设置成当前相机位置
        this.skyline.viewPosition = [longitude, latitude, height];
  
        //设置俯仰和方向
        this.skyline.pitch = Cesium.Math.toDegrees(scene.camera.pitch);
        this.skyline.direction = Cesium.Math.toDegrees(scene.camera.heading);
        this.skyline.build();
         

        //获取二维天际线对象
        var that = this;
        setTimeout(function () {
            that.viewer.mars.centerAt(bookmark,0);

            var result = that.skyline.getSkyline2D();
            that.viewWindow.updateEchars(result);
        },1000);
    },


}));

