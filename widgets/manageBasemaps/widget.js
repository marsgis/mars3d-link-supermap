(function (window, mars3d) {
    //创建widget类，需要继承BaseWidget
    class MyWidget extends mars3d.widget.BaseWidget {
        //弹窗配置
        get view() {
            var index = 0;
            var basemapsCfg = this.getBasemaps();
            for (var i = 0; i < basemapsCfg.length; i++) {
                var item = basemapsCfg[i];
                if (!item.hasLayer || item.hide) continue;
                index++;
            }

            var width, height
            if (index <= 4) {
                width = 190
                height = Math.ceil(index / 2) * 100 + 70
            }
            else if (index > 4 && index <= 6) {
                width = 270
                height = Math.ceil(index / 3) * 100 + 70
            } else {
                width = 360
                height = Math.ceil(index / 4) * 105 + 70
            }

            return {
                type: "window",
                url: "view.html",
                windowOptions: {
                    width: width,
                    height: height
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

        }
        //关闭释放
        disable() {
            this.viewWindow = null;

        }
        hasTerrain() {
            return this.viewer.mars.hasTerrain();
        }
        getBasemaps() {
            return this.viewer.mars.config.basemaps;
        }
        getLayerVisible(item) {
            var layer = this.viewer.mars.getLayer(item);
            return layer && layer.visible;
        }
        updateLayerVisible(item, visible) {
            var layer = this.viewer.mars.getLayer(item);
            if (layer) layer.visible = visible;
        }
        updateTerrainVisible(isStkTerrain) {
            this.viewer.mars.updateTerrainProvider(isStkTerrain);
        }


    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)

