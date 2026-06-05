import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

const BaseLayer = mars3d.layer.BaseLayer

/**
 * 超图MVT矢量瓦片图层,
 * 【需要引入  mars3d-supermap 插件库】
 *
 * @param {object} [options] 参数对象，包括以下：
 * @param {string} options.url 适用于通过SuperMap桌面软件生成mvt数据,经iServer发布为rest风格的地图服务，只需提供服务地址。
 * @param {string} options.layer 图层名称,适用于第三方发布的WMTS服务。
 * @param {number} [options.canvasWidth] 用来绘制矢量的纹理边长。默认是512，越大越精细，越小性能越高。
 * @param {string} [options.format='mvt'] 适用于第三方发布的WMTS服务。
 * @param {object} [options.mapboxStyle] 使用的mapBox风格。
 * @param {object} [options.多个参数] 参考[supermap官方API]{@link http://support.supermap.com.cn:8090/webgl/docs/Documentation/Scene.html#addVectorTilesLayer}
 *
 *
 * @param {string|number} [options.id = createGuid()] 图层id标识
 * @param {string|number} [options.pid] 图层父级的id，一般图层管理中使用
 * @param {string} [options.name] 图层名称
 * @param {boolean} [options.show = true] 图层是否显示
 * @param {BaseClass|boolean} [options.eventParent]  指定的事件冒泡对象，默认为map对象，false时不冒泡
 * @param {object} [options.center] 图层自定义定位视角 {@link Map#setCameraView}
 * @param {number} options.center.lng 经度值, -180至180
 * @param {number} options.center.lat 纬度值, -90至90
 * @param {number} [options.center.alt] 高度值
 * @param {number} [options.center.heading] 方向角度值，绕垂直于地心的轴旋转角度, 0至360
 * @param {number} [options.center.pitch] 俯仰角度值，绕纬度线旋转角度, -90至90
 * @param {number} [options.center.roll] 翻滚角度值，绕经度线旋转角度, -90至90
 * @param {boolean} [options.flyTo] 加载完成数据后是否自动飞行定位到数据所在的区域。
 * @export
 * @class SmMvtLayer
 * @extends {BaseLayer}
 */
export class SmMvtLayer extends BaseLayer {
  /**
   * 对应的supermap图层 Cesium.VectorTilesLayer
   * @type {*}
   * @readonly
   * @see http://support.supermap.com.cn:8090/webgl/docs/Documentation/VectorTilesLayer.html
   */
  get layer() {
    return this._mvtLayer
  }

  /**
   * 对象添加到地图前创建一些对象的钩子方法，
   * 只会调用一次
   * @return {void}  无
   * @private
   */
  _mountedHook() {
    // options参考API文档：http://support.supermap.com.cn:8090/webgl/docs/Documentation/Scene.html
    this._mvtLayer = this._map.scene.addVectorTilesMap({
      viewer: this._map.viewer,
      canvasWidth: 512,
      ...this.options
    })
    // this._mvtLayer.readyPromise.then(function (data) {
    //   // setPaintProperty(layerId, name, value, options)
    //   // for(var layerId in that.options.style){
    //   //     that._mvtLayer.setPaintProperty(layerId, "fill-color", "rgba(255,0,0,0.8)");
    //   // }
    // })

    const handler = new Cesium.ScreenSpaceEventHandler(this._map.scene.canvas)
    handler.setInputAction((event) => {
      if (!this.show) {
        return
      }

      const position = this._map.getCurrentMousePosition(event.position)

      // 查询出相交图层的feature
      const features = this._mvtLayer.queryRenderedFeatures([position], {
        // layers: [selectLayer.id]
      })

      // eslint-disable-next-line array-callback-return
      const filter = features.reduce((memo, result) => {
        const attr = result.feature.properties
        if (!attr) {
          // eslint-disable-next-line array-callback-return
          return
        }

        const content = mars3d.Util.getPopupForConfig(this.options, attr)
        const item = {
          data: attr,
          event: event
        }
        this._map.openPopup(position, content, item)
      })
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.handler = handler
  }

  /**
   * 对象添加到地图上的创建钩子方法，
   * 每次add时都会调用
   * @return {void}  无
   * @private
   */
  _addedHook() {
    this._mvtLayer.show = true
    // this._mvtLayer.refresh();
  }

  /**
   * 对象从地图上移除的创建钩子方法，
   * 每次remove时都会调用
   * @return {void}  无
   * @private
   */
  _removedHook() {
    if (this._mvtLayer) {
      this._mvtLayer.show = false
    }
  }

  /**
   * 设置透明度
   * @param {number} value 透明度
   * @return {void}  无
   */
  setOpacity(value) {
    if (this._mvtLayer) {
      this._mvtLayer.alpha = parseFloat(value)
    }
  }

  // 定位至数据区域
  flyTo(options = {}) {
    if (this.options.center) {
      return this._map.setCameraView(this.options.center, options)
    } else if (this.options.extent) {
      return this._map.flyToExtent(this.options.extent, options)
    } else if (this._mvtLayer) {
      return this._map.camera.flyTo({
        ...options,
        destination: this._mvtLayer.rectangle
      })
    }
    return Promise.resolve(false)
  }
}
mars3d.layer.SmMvtLayer = SmMvtLayer

// 注册下
mars3d.LayerUtil.register("supermap_mvt", SmMvtLayer)
