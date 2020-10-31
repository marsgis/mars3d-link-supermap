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
                    height: 500
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

        //绑定自定义的非配置图层到图层控制控件中
        addOverlay(item) {

            if (!item.name)
                item.name = "未命名";
            if (!item.id)
                item.id = viewer.mars.getNextId();
            if (!item.pid)
                item.pid = -1;

            //计算层次顺序
            var order = Number(item.order);
            if (isNaN(order))
                order = this._layers.length + 1;
            item.order = order;

            //主键，用于存储取图层用，防止有重复
            item._key = this._layers.length + "_" + item.id + "_" + item.name;

            this._layers.push(item);

            if (this.isActivate && this.viewWindow) {
                this.viewWindow.addNode(item);
            }
        }



        //从图层控制控件中删除指定的图层
        removeLayer(name) {
            for (var i = 0; i < this._layers.length; i++) {
                var item = this._layers[i];

                if (item.name == name) {
                    this._layers.splice(i, 1);

                    if (this.isActivate && this.viewWindow) {
                        this.viewWindow.removeNode(item);
                    }
                    break;
                }
            }
        }

        get hasManagerBaseMaps() { return true }
        getLayers() {
            if (this._layers == null) {
                var layers = [];
                var basemapsCfg = this.hasManagerBaseMaps ? this.viewer.mars.config.basemaps : [];
                var operationallayersCfg = this.viewer.mars.config.operationallayers;


                //构建集合，预处理相关数据  
                for (var i = 0; i < basemapsCfg.length; i++) {
                    var item = basemapsCfg[i];
                    layers.push(item);

                    // if (item.type == "group" && item.layers) { //group是否打开控制子图层，是的话取消注释
                    //     for (var idx = 0; idx < item.layers.length; idx++) {
                    //         var childitem = item.layers[idx];

                    //         if (!childitem.name)
                    //             childitem.name = item.name + '-' + (idx + 1);

                    //         childitem._parent = item;
                    //         layers.push(childitem);
                    //     }
                    // }
                }

                for (var i = 0; i < operationallayersCfg.length; i++) {
                    var item = operationallayersCfg[i];
                    layers.push(item);

                    // if (item.type == "group" && item.layers) {//group是否打开控制子图层，是的话取消注释
                    //     for (var idx = 0; idx < item.layers.length; idx++) {
                    //         var childitem = item.layers[idx];

                    //         if (!childitem.name)
                    //             childitem.name = item.name + '-' + (idx + 1);

                    //         childitem._parent = item;
                    //         layers.push(childitem);
                    //     }
                    // }
                }

                //初始化顺序字段,
                for (var i = 0; i < layers.length; i++) {
                    var item = layers[i];

                    //主键，用于存储取图层用，防止有重复
                    item._key = i + "_" + item.id + "_" + item.name;
                }
                this._layers = layers;
            }
            return this._layers;
        }
        //定位
        getLayar(item) {
            return this.viewer.mars.getLayer(item);
        }
        centerAt(item) {
            var model = this.getLayar(item);
            model && model.centerAt();
        }
        getLayerVisible(item) {
            var model = this.getLayar(item);
            return model && model.visible;
        }
        //更新图层:显示隐藏状态
        updateLayerVisible(item, visible) {
            var model = this.getLayar(item);
            model.visible = visible

            if (visible && this.config.autoCenter && !model.config.noCenter) {//在对应config.json图层节点配置noCenter:true 可以不定位
                model.centerAt();
            }

            //存在关联widget时 
            if (item.onWidget) {
                if (visible) {
                    mars3d.widget.activate({
                        uri: item.onWidget,
                        layerItem: item,
                        disableOther: false
                    });
                } else {
                    mars3d.widget.disable(item.onWidget);
                }
            }

            //更新到分屏对比
            // var mapCompare = mars3d.widget.getClass('widgets/mapCompare/widget.js');
            // if (mapCompare) {
            //     mapCompare.updateLayerVisible(model.config, visible);
            // } 
        }
        //更新图层:透明度
        udpateLayerOpacity(item, opacity) {
            var model = this.getLayar(item);
            model.setOpacity(opacity);
        }
        //更新图层:顺序
        udpateLayerZIndex(item, order) {
            var model = this.getLayar(item);
            model.setZIndex(order);
        }


    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)

