(function (window, mars3d) {
    //创建widget类，需要继承BaseWidget
    class MyWidget extends mars3d.widget.BaseWidget {


        //弹窗配置
        get view() {
            return {
                type: "window",
                url: "view.html",
                windowOptions: {
                    width: 300,
                    height: 100
                }
            }
        }


        //初始化[仅执行1次]
        create() {

            this.pointType = 0 //start:0,end:1
            this.arrPointEnd = []


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
        }
        //每个窗口创建完成后调用
        winCreateOK(opt, result) {
            this.viewWindow = result;
        }
        //打开激活
        activate() {

            //创建天际线分析对象 
            var sightline = new Cesium.Sightline(this.viewer.scene);
            sightline.couldRemove = false;
            this.sightline = sightline;
        }
        //关闭释放
        disable() {
            this.clear();
            if (this.pointStart) {
                this.viewer.entities.remove(this.pointStart);
                this.pointStart = null;
            }
            if (this.sightline) {
                this.sightline.destroy();
                this.sightline = undefined;
            }
        }
        clear() {
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
        }
        //添加观察点
        addStartPoint() {
            this.pointType = 0;
            this.pointHandler.activate();
        }
        addStartPointOK(jwd, point) {
            if (this.pointStart) {
                this.viewer.entities.remove(this.pointStart);
                this.pointStart = null;
            }
            this.pointStart = point;

            this.sightline.build();
            this.sightline.viewPosition = jwd;
        }
        //添加目标点
        addEndPoint() {
            this.pointType = 1;
            this.pointHandler.activate();
        }
        addEndPointOK(jwd, point) {
            this.arrPointEnd.push(point);

            this.sightline.addTargetPoint({
                position: jwd,
                name: "point" + new Date()
            });
            this.sightline.couldRemove = true;
        }


    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)

