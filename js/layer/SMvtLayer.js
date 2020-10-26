//如果需要在config.json中type定义非类库内置类型时，可以按下面示例进行扩展，主要是重写add、remove等方法。
//该类内部主要使用的的2个属性：this.config是config.json中配置的对应节点参数，this.viewer是地球对象

//超图MVT 矢量瓦片图层加载
class SMvtLayer extends mars3d.layer.BaseLayer {
    constructor(cfg, viewer) {
        super(cfg, viewer);

        this.hasOpacity = true;
    }
    //添加 
    add() {
        if (this.mvtMap) {
            this.mvtMap.show = true;
            this.mvtMap.refresh();
        }
        else {
            this.initData();
        }
    }
    //移除
    remove() {
        if (this.mvtMap) {
            this.mvtMap.show = false;
        }
    }
    //定位至数据区域
    centerAt(duration) {
        if (this.config.extent || this.config.center) {
            this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
        }
        else if (this.mvtMap) {
            this.viewer.camera.flyTo({
                destination: this.mvtMap.rectangle,
                duration: duration,
            });
        }
    }
    //设置透明度
    setOpacity(value) {
        if (this.mvtMap) {
            this.mvtMap.alpha = parseFloat(value);
        }
    }
    initData() {
        var that = this;

        //场景添加mvt图层服务
        this.config.parameters.url = this.config.url;
        //mvtMap 参考API文档：http://support.supermap.com.cn:8090/webgl/Build/Documentation/VectorTilesMap.html
        this.mvtMap = this.viewer.scene.addVectorTilesMap(this.config.parameters);
        var layerReadyPromise = this.mvtMap.readyPromise;
        Cesium.when(layerReadyPromise, function (data) {
            //setPaintProperty(layerId, name, value, options)
            // for(var layerId in that.config.style){
            //     that.mvtMap.setPaintProperty(layerId, "fill-color", "rgba(255,0,0,0.8)"); 
            // }  

        }, function (e) {
            showError('渲染时发生错误，已停止渲染。', e);
        });


        var scene = this.viewer.scene;
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(event => {
            if (!that._visible) return;

            var position = mars3d.point.getCurrentMousePosition(viewer.scene, event.position);

            //查询出相交图层的feature
            var features = that.mvtMap.queryRenderedFeatures([position], {
                // layers: [selectLayer.id]
            });
            var filter = features.reduce(function (memo, result) {
                var attr = result.feature.properties
                if (!attr) { return; }

                debugger
                var item = {
                    id: result.feature.id,
                    popup: mars3d.util.getPopupForConfig(that.config, attr),
                    data: attr
                }
                this.viewer.mars.popup.show(item, position, event.position);
            }, ["in", "$id"]);


        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.handler = handler
    }
    onSelectedEntityChanged(entity) {
        var selectedEntity = this.viewer.selectedEntity;
        if (!Cesium.defined(selectedEntity) || !Cesium.defined(selectedEntity.pickResult)) {
            return;
        }
        var pickResult = selectedEntity.pickResult;
        var properties = null;
        for (var obj in pickResult) {
            var pickFeature = pickResult[obj][0].feature;
            properties = pickFeature.properties;
            break;
        }

        if (!properties) { return; }

        selectedEntity.popup = mars3d.util.getPopupForConfig(this.config, properties)

        this.viewer.mars.popup.show(selectedEntity);
    }


}



//注册到mars3d内部图层管理中：type为supermap_mvt时，实例化SMvtLayer
mars3d.layer.regLayerForConfig("supermap_mvt", SMvtLayer);

