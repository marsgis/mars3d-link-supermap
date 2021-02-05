function createImageryProvider (options, urltemplate) {
    options = mars3d.layer.converOptions(options, urltemplate)
    return new Cesium.SuperMapImageryProvider(options);
}

//超图影像瓦片服务
class SImgLayer extends mars3d.layer.BaseTileLayer {
    //构建ImageryProvider
    _createImageryProvider (options, urltemplate) {
        return createImageryProvider(options, urltemplate)
    }
    //添加时 
    _addedHook () {
        super._addedHook () 

        if (Cesium.defined(this.options.transparentBackColorTolerance)) {
            this._imageryLayer.transparentBackColorTolerance = this.options.transparentBackColorTolerance //去黑边
        }
    }
}
SImgLayer.createImageryProvider = createImageryProvider

//图层类型
const layerType = 'supermap_img'

//注册下
mars3d.layer.register(layerType, SImgLayer)
mars3d.layer.registerImageryProvider(layerType, createImageryProvider)
