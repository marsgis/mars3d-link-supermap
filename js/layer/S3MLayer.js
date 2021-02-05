
//超图S3M 三维模型图层加载
class S3MLayer extends mars3d.layer.BaseLayer {
    get layer () {
        return this.model
    }

    //设置s3m图层属性
    set s3mOptions (value) {
        for (var key in value) {
            var val = value[key];
            this.options.s3mOptions[key] = val

            if (key == "transparentBackColor") //去黑边，与offset互斥，注意别配置offset
                val = Cesium.Color.fromCssColorString(val);
            else if (key == "transparentBackColorTolerance")
                val = Number(val);

            for (var i = 0; i < this.model.length; i++) {
                var layer = this.model[i];
                if (layer == null) continue;
                layer[key] = val
            }
        }
    }
    get s3mOptions () {
        return this.options.s3mOptions;
    }


    /**
     * 创建图层对象的方法
     */
    _mountedHook () {
        var that = this;
debugger
        //场景添加S3M图层服务
        var promise;
        if (this.options.layername) {
            promise = this._map.scene.addS3MTilesLayerByScp(this.options.url, {
                name: this.options.layername
            });
        }
        else {
            promise = this._map.scene.open(this.options.url);
        }

        Cesium.when(promise, function (layer) {
            if (that.isArray(layer))
                that.model = layer;
            else
                that.model = [layer];

            //设置图层属性
            for (var i = 0; i < that.model.length; i++) {
                var layer = that.model[i];
                if (layer == null) continue;

                layer.isS3M = true; //标识下

                //s3mOptions
                if (that.options.s3mOptions) {
                    for (var key in that.options.s3mOptions) {
                        var val = that.options.s3mOptions[key];
                        if (key == "transparentBackColor") //去黑边，与offset互斥，注意别配置offset
                            layer[key] = Cesium.Color.fromCssColorString(val);
                        else if (key == "transparentBackColorTolerance")
                            layer[key] = Number(val);
                        else
                            layer[key] = that.options.s3mOptions[key];
                    }
                }

                //高度调整 offset.z
                if (Cesium.defined(that.options.offset) && Cesium.defined(that.options.offset.z)) {
                    layer.style3D.bottomAltitude = that.options.offset.z;
                    layer.refresh();
                }

            }


            if (!that._map.isFlyAnimation() && that.options.flyTo) {
                that.centerAt(0);
            }

            if (that.options.dataUrl) {
                for (var i = 0; i < layer.length; i++) {
                    var ql = layer[i];

                    //读取子图层信息，通过数组的方式返回子图层的名称以及子图层所包含的对象的IDs
                    ql.setQueryParameter({
                        url: that.options.dataUrl,
                        dataSourceName: ql.name.split("@")[1],
                        dataSetName: ql.name.split("@")[0],
                        isMerge: true
                    });

                    //获取图层风格
                    //Note_GJ: rgba, 1为不透明，0为全透明。已经在模型中导入材质，所以这里的颜色不特别设置
                    //var style3D = new Cesium.Style3D();
                    // var color = Cesium.Color.fromCssColorString("#919191");//混泥土颜色 RGB(145, 145,145)
                    // style3D.fillForeColor = color;
                    // ql.style3D = style3D;
                    //设置后需刷新图层
                    // ql.refresh();
                    ql.selectEnabled = true;
                }
            }

        }, function (e) {
            showError('渲染时发生错误，已停止渲染。', e);
        });
    }

    /**
     * 添加时
     */
    _addedHook () {
        for (var i in this.model) {
            this.model[i].visible = true;
            this.model[i].show = true;
        }
    }

    /**
     * 移除时
     */
    _removedHook () {
        if (this.model) {
            for (var i in this.model) {
                this.model[i].visible = false;
                this.model[i].show = false;
            }
        }
    }

    //设置透明度
    setOpacity (value) {
        if (this.model) {
            for (var i = 0; i < this.model.length; i++) {
                var item = this.model[i];
                if (item == null) continue;

                item.style3D.fillForeColor.alpha = value;
            }
        }
    }
    //定位至数据区域
    centerAt (duration) {
        if (this.options.extent || this.options.center) {
            this._map.centerAt(this.options.extent || this.options.center, { duration: duration, isWgs84: true });
        }
    }

    isArray (obj) {
        return (typeof obj == 'object') && obj.constructor == Array;
    }

}


//注册下
mars3d.layer.register("supermap_s3m", S3MLayer);

