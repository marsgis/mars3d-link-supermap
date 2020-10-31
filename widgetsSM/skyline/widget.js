(function (window, mars3d) {
    //创建widget类，需要继承BaseWidget
    class MyWidget extends mars3d.widget.BaseWidget {


        //弹窗配置
        get view() {
            return {
                type: "window",
                url: "view.html",
                windowOptions: {
                    width: 250,
                    height: 320
                }
            }
        }


        //初始化[仅执行1次]
        create() {

        }
        //每个窗口创建完成后调用
        winCreateOK(opt, result) {
            this.viewWindow = result;
        }
        //打开激活
        activate() {

            //创建天际线分析对象
            var skyline = new Cesium.Skyline(this.viewer.scene);
            this.skyline = skyline;
        }
        //关闭释放
        disable() {
            this.clear();
            if (this.skyline) {
                this.skyline.destroy();
                this.skyline = undefined;
            }
        }
        clear() {
            this.skyline.clear();
        }
        getSkyline() {
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
                that.viewer.mars.centerAt(bookmark, 0);

                var result = that.skyline.getSkyline2D();
                that.viewWindow.updateEchars(result);
            }, 1000);
        }

    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)


