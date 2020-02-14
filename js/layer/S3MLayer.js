//如果需要在config.json中type定义非类库内置类型时，可以按下面示例进行扩展，主要是重写add、remove等方法。
//该类内部主要使用的的2个属性：this.config是config.json中配置的对应节点参数，this.viewer是地球对象

//超图S3M 三维模型图层加载
var S3MLayer = mars3d.layer.BaseLayer.extend({
    //添加 
    add: function () {
        if (this.model) {
            for (var i in this.model) {
                this.model[i].visible = true;
            }
        }
        else {
            this.initData();
        }
    },
    //移除
    remove: function () {
        if (this.model) {
            for (var i in this.model) {
                this.model[i].visible = false;
            }
        }
    },
    //定位至数据区域
    centerAt: function (duration) {
        if (this.config.extent || this.config.center) {
            this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
        }
    },
    hasOpacity: true,
    //设置透明度
    setOpacity: function (value) {
        if (this.model) {
            for (var i = 0; i < this.model.length; i++) {
                var item = this.model[i];
                if (item == null) continue;

                item.style3D.fillForeColor.alpha = value;
            }
        }
    },
    initData: function () {
        var that = this;

        //场景添加S3M图层服务
        var promise;
        if (this.config.layername) {
            promise = this.viewer.scene.addS3MTilesLayerByScp(this.config.url, {
                name: this.config.layername
            });
        }
        else {
            promise = this.viewer.scene.open(this.config.url);
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

                //s3mOptions
                if (that.config.s3mOptions) {
                    for (var key in that.config.s3mOptions) {
                        layer[key] = that.config.s3mOptions[key];
                    }
                }
                
                //高度调整 offset.z
                if (Cesium.defined(that.config.offset) && Cesium.defined(that.config.offset.z)) {
                    layer.style3D.bottomAltitude = that.config.offset.z;
                    layer.refresh();
                }

            }


            if (!that.viewer.mars.isFlyAnimation() && that.config.flyTo) {
                that.centerAt(0);
            }

            if (that.config.dataUrl) {
                for (var i = 0; i < layer.length; i++) {
                    var ql = layer[i];

                    //读取子图层信息，通过数组的方式返回子图层的名称以及子图层所包含的对象的IDs
                    ql.setQueryParameter({
                        url: that.config.dataUrl,
                        dataSourceName: ql.name.split("@")[1],
                        dataSetName: ql.name.split("@")[0],
                        isMerge: true
                    });

                    //获取图层风格
                    //Note_GJ: rgba, 1为不透明，0为全透明。已经在模型中导入材质，所以这里的颜色不特别设置
                    //var style3D = new Cesium.Style3D();
                    // var color = new Cesium.Color.fromCssColorString("#919191");//混泥土颜色 RGB(145, 145,145)
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
    },
    isArray: function (obj) {
        return (typeof obj == 'object') && obj.constructor == Array;
    },


});



//注册到mars3d内部图层管理中：type为s3m时，实例化S3MLayer
mars3d.layer.regLayerForConfig("supermap_s3m", S3MLayer);

