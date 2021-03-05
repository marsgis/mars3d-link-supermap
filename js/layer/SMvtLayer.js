//超图MVT 矢量瓦片图层加载
class SMvtLayer extends mars3d.layer.BaseLayer {
    get layer () {
        return this._mvtLayer
    }

    /**
     * 创建图层对象的方法
     */
    _mountedHook () {
        var that = this;

        //场景添加mvt图层服务
        this.options.parameters.url = this.options.url;

        //参考API文档：http://support.supermap.com.cn:8090/webgl/Build/Documentation/VectorTilesMap.html
        this._mvtLayer = this._map.scene.addVectorTilesMap(this.options.parameters);
        var layerReadyPromise = this._mvtLayer.readyPromise;

        Cesium.when(layerReadyPromise, (data) => {
            //setPaintProperty(layerId, name, value, options)
            // for(var layerId in that.options.style){
            //     that._mvtLayer.setPaintProperty(layerId, "fill-color", "rgba(255,0,0,0.8)");
            // }

        }, function (e) {
            showError('渲染时发生错误，已停止渲染。', e);
        });


        var scene = this._map.scene;
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(event => {
            if (!that._visible) return;

            var position = mars3d.PointUtil.getCurrentMousePosition(scene, event.position);

            //查询出相交图层的feature
            var features = that._mvtLayer.queryRenderedFeatures([position], {
                // layers: [selectLayer.id]
            });

            var filter = features.reduce(function (memo, result) {
                var attr = result.feature.properties
                if (!attr) { return; }

                var item = {
                    id: result.feature.id,
                    popup: mars3d.Util.getPopupForConfig(that.options, attr),
                    data: attr
                }
                this._map.openPopup(position, item, event);
            }, ["in", "$id"]);


        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.handler = handler
    }

    /**
     * 添加时
     */
    _addedHook () {
        this._mvtLayer.show = true;
        this._mvtLayer.refresh();
    }

    /**
     * 移除时
     */
    _removedHook () {
        if (this._mvtLayer) {
            this._mvtLayer.show = false;
        }
    }

    //设置透明度
    setOpacity (value) {
        if (this._mvtLayer) {
            this._mvtLayer.alpha = parseFloat(value);
        }
    }

    //定位至数据区域
    centerAt (duration) {
        if (this.options.extent || this.options.center) {
            this._map.centerAt(this.options.extent || this.options.center, { duration: duration, isWgs84: true });
        }
        else if (this._mvtLayer) {
            this._map.camera.flyTo({
                destination: this._mvtLayer.rectangle,
                duration: duration,
            });
        }
    }

}

//注册下
mars3d.layer.register("supermap_mvt", SMvtLayer);

