import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

const BaseLayer = mars3d.layer.BaseLayer

/**
 * 超图S3M三维模型图层,
 * 【需要引入  mars3d-supermap 插件库】
 *
 * @param {object} [options] 参数对象，包括以下：
 * @param {string} options.url supermap的S3M服务地址,示例："url": "http://www.supermapol.com/realspace/services/3D-Olympic/rest/realspace"
 * @param {string} [options.layername] 指定图层名称,未指定时，打开iserver场景服务下所有图层
 * @param {string} [options.sceneName] 工作空间中有多个场景，需要指定场景名称；设置为undefined，默认打开第一个
 * @param {object} [options.s3mOptions] [S3M支持的参数]{@link http://support.supermap.com.cn:8090/webgl/docs/Documentation/S3MTilesLayer.html?classFilter=S3MTilesLayer} ,示例： {"selectEnabled":false},
 * @param {object} [options.position] 模型新的中心点位置（移动模型）
 * @param {number} options.position.alt 获取或设置底部高程。（单位：米）
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
 * @class S3MLayer
 * @extends {BaseLayer}
 */
export class S3MLayer extends BaseLayer {
  /**
   * 模型对应的Cesium.S3MTilesLayer图层组
   * @type {object[]}
   * @readonly
   * @see http://support.supermap.com.cn:8090/webgl/docs/Documentation/S3MTilesLayer.html
   */
  get layer() {
    return this._layerArr
  }

  /**
   * 设置S3M图层本身支持的参数
   * @type {object}
   * @see [S3M支持的参数]{@link http://support.supermap.com.cn:8090/webgl/docs/Documentation/S3MTilesLayer.html?classFilter=S3MTilesLayer}
   */
  get s3mOptions() {
    return this.options.s3mOptions
  }

  set s3mOptions(value) {
    for (const key in value) {
      let val = value[key]
      this.options.s3mOptions[key] = val

      if (key === "transparentBackColor") {
        // 去黑边，与offset互斥，注意别配置offset
        val = Cesium.Color.fromCssColorString(val)
      } else if (key === "transparentBackColorTolerance") {
        val = Number(val)
      }

      for (let i = 0; i < this._layerArr.length; i++) {
        const layer = this._layerArr[i]
        if (layer == null) {
          continue
        }
        layer[key] = val
      }
    }
  }

  _showHook(show) {
    this.eachLayer((layer) => {
      layer.visible = show // 不同超图版本，有的是visible，有的是show
      layer.show = show
    }, this)
  }

  /**
   * 对象添加到地图前创建一些对象的钩子方法，
   * 只会调用一次
   * @return {void}  无
   * @private
   */
  _mountedHook() {
    if (!this._map.scene.open) {
      throw new Error("请引入 超图版本Cesium库 或 超图S3M插件 ")
    }

    const centerOld = this._map.getCameraView()
    const url = this.getUrl()
    // 场景添加S3M图层服务
    let promise
    if (this.options.layername) {
      promise = this._map.scene.addS3MTilesLayerByScp(url, {
        name: this.options.layername,
        autoSetView: this.options.flyTo,
        cullEnabled: this.options.cullEnabled
      })
    } else {
      promise = this._map.scene.open(url, this.options.sceneName, {
        autoSetView: this.options.flyTo
      })
    }

    promise.then(
      (smLayer) => {
        if (Array.isArray(smLayer)) {
          this._layerArr = smLayer
        } else {
          this._layerArr = [smLayer]
        }
        if (!this.isAdded) {
          this._removedHook()
          return
        }

        for (let i = 0; i < this._layerArr.length; i++) {
          const layer = this._layerArr[i]
          if (!layer) {
            continue
          }
          try {
            this._initModelItem(layer)
          } catch (e) {
            mars3d.Log.logError("s3m图层初始化出错", e)
          }
        }

        this._showHook(this.show)

        if (this.options.flyTo) {
          this.flyTo()
        } else if (this.options.flyTo === false) {
          this._map.setCameraView(centerOld, { duration: 0 })
        }

        this._readyPromise.resolve(this)
        this.fire(mars3d.EventType.load, { layers: this._layerArr })
      },
      (error) => {
        if (this._readyPromise?.reject) {
          this._readyPromise.reject(error)
        }
      }
    )

    // this._map.viewer.pickEvent.addEventListener(function (feature) {
    //   debugger;
    // });
  }

  // 对单个s3m图层处理
  _initModelItem(layer) {
    // 图层参数合并
    if (this.options.s3mOptions) {
      for (const key in this.options.s3mOptions) {
        const val = this.options.s3mOptions[key]

        if (key === "transparentBackColor") {
          layer[key] = Cesium.Color.fromCssColorString(val) // 去黑边
        } else if (key === "transparentBackColorTolerance") {
          layer[key] = Number(val)
        } else {
          layer[key] = val
        }
      }
    }

    // 选中颜色
    if (this.options.highlight) {
      layer.selectedColor = mars3d.Util.getColorByStyle(this.options.highlight)
    }

    // 高度调整
    if (this.options?.position?.alt) {
      layer.style3D.altitudeMode = Cesium.HeightReference.NONE
      layer.style3D.bottomAltitude = this.options.position.alt
      if (layer.refresh) {
        layer.refresh() // 设置风格后需刷新
      }
    }
  }

  /**
   * 对象添加到地图上的创建钩子方法，
   * 每次add时都会调用
   * @return {void}  无
   * @private
   */
  _addedHook() {
    this.eachLayer((layer) => {
      this._map.scene.layers.add(layer)
    })
  }

  /**
   * 对象从地图上移除的创建钩子方法，
   * 每次remove时都会调用
   * @return {void}  无
   * @private
   */
  _removedHook() {
    try {
      this.eachLayer((layer) => {
        this._map.scene.layers.remove(layer.name, true)
      })
    } catch (e) {
      mars3d.Log.logWarn(`s3m移除中空值异常(插件本身问题，需改超图插件)`, e)
    }
  }

  /**
   * 遍历每一个子图层并将其作为参数传递给回调函数
   *
   * @param {Function} method 回调方法
   * @param {object} [context] 侦听器的上下文(this关键字将指向的对象)。
   * @return {GroupLayer} 当前对象本身,可以链式调用
   */
  eachLayer(method, context) {
    if (!this._layerArr) {
      return
    }
    this._layerArr.forEach((layer) => {
      method.call(context, layer)
    })
    return this
  }

  /**
   * 设置透明度
   * @param {number} value 透明度
   * @return {void}  无
   */
  setOpacity(value) {
    this.eachLayer((layer) => {
      layer.style3D.fillForeColor.alpha = value
    }, this)
  }

  // 定位至数据区域
  flyTo(options = {}) {
    if (this.options.center) {
      return this._map.setCameraView(this.options.center, options)
    } else if (this.options.extent) {
      return this._map.flyToExtent(this.options.extent, options)
    }
  }
}
mars3d.layer.S3MLayer = S3MLayer

// 注册下
mars3d.LayerUtil.register("supermap_s3m", S3MLayer)
