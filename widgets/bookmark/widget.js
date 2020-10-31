(function (window, mars3d) {
    //创建widget类，需要继承BaseWidget
    class MyWidget extends mars3d.widget.BaseWidget {
        //弹窗配置
        get view() {
            return {
                type: "window",
                url: "view.html",
                windowOptions: {
                    width: 210,
                    height: 400
                }
            }
        }
        //每个窗口创建完成后调用
        winCreateOK(opt, result) {
            this.viewWindow = result;
        }
        //激活插件
        activate() {

        }
        //释放插件
        disable() {
            this.viewWindow = null;

        }
        showExtent(cfg) {
            console.log('书签定位：' + JSON.stringify(cfg));

            this.viewer.mars.centerAt(cfg, { isWgs84: true });
        }
        getDefaultExtent() {
            return this.viewer.mars.config.center;
        }
        getThisExtent(callback) {
            var bookmark = mars3d.point.getCameraView(this.viewer, true);

            haoutil.loading.show();

            viewer.mars.expImage({
                download: false,
                width: 300, //指定 高  或 宽
                callback: function (base64, size) {//回调
                    haoutil.loading.close();

                    if (callback) callback(bookmark, base64);
                }
            });

            return bookmark;
        }

    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
