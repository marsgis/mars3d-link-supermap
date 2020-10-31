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
                type: "window",
                url: "view.html",
                windowOptions: {
                    width: 500,
                    height: 200
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
            if (this.viewWindow)
                this.viewWindow.setEchartsData(this.config.data);
        }
        //内置方法，不重启方式刷新页面
        update() {
            if (this.viewWindow)
                this.viewWindow.setEchartsData(this.config.data);
        }
        //关闭释放
        disable() {
            this.viewWindow = null;
            this.hideTipMarker();
        }

        showTipMarker(point, z, inthtml) {
            var _position_show = Cesium.Cartesian3.fromDegrees(point.x, point.y, z)

            if (!this.tipMarker) {
                this.tipMarker = viewer.entities.add({
                    name: "当前点",
                    position: new Cesium.CallbackProperty(time => {
                        return this.tipMarker._position_show || _position_show;
                    }, false),
                    billboard: {
                        image: 'img/marker/mark3.png',
                        scale: 1,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.2)
                    },
                    tooltip: {
                        html: inthtml,
                        anchor: [0, -20],//左右、上下的偏移像素值。
                    }
                });
            }
            this.tipMarker._position_show = _position_show
            this.tipMarker.tooltip.html = inthtml
            //   this.viewer.mars.tooltip.show(tipMarker);
        }

        hideTipMarker() {
            if (!this.tipMarker) return;
            this.viewer.entities.remove(this.tipMarker);
            this.tipMarker = null;
        }

    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d) 