/**
 * Mars3D平台插件,结合supermap超图库使用的功能插件  mars3d-supermap
 *
 * 版本信息：v3.3.4
 * 编译日期：2022-04-09 13:46:43
 * 版权所有：Copyright by 火星科技  http://mars3d.cn
 * 使用单位：免费公开版 ，2022-02-01
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, (window.mars3d || require('mars3d'))) :
  typeof define === 'function' && define.amd ? define(['exports', 'mars3d'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["mars3d-supermap"] = {}, global.mars3d));
})(this, (function (exports, mars3d) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return n;
  }

  var mars3d__namespace = /*#__PURE__*/_interopNamespace(mars3d);

  const Cesium$2 = mars3d__namespace.Cesium;

  const BaseLayer$1 = mars3d__namespace.layer.BaseLayer;

  /**
   * 超图S3M三维模型图层,
   * 【需要引入  mars3d-supermap 插件库】
   *
   * @param {Object} [options] 参数对象，包括以下：
   * @param {String} options.url supermap的S3M服务地址,示例："url": "http://www.supermapol.com/realspace/services/3D-Olympic/rest/realspace"
   * @param {String} [options.layername] 指定图层名称,未指定时，打开iserver场景服务下所有图层
   * @param {String} [options.sceneName] 工作空间中有多个场景，需要指定场景名称；设置为undefined，默认打开第一个
   * @param {Object} [options.s3mOptions] [S3M支持的参数]{@link http://support.supermap.com.cn:8090/webgl/docs/Documentation/S3MTilesLayer.html?classFilter=S3MTilesLayer} ,示例： {"selectEnabled":false},
   * @param {Object} [options.position] 模型新的中心点位置（移动模型）
   * @param {Number} options.position.alt 获取或设置底部高程。（单位：米）
   *
   * @param {String|Number} [options.id = uuid()] 图层id标识
   * @param {String|Number} [options.pid = -1] 图层父级的id，一般图层管理中使用
   * @param {String} [options.name = ''] 图层名称
   * @param {Boolean} [options.show = true] 图层是否显示
   * @param {BaseClass|Boolean} [options.eventParent]  指定的事件冒泡对象，默认为map对象，false时不冒泡
   * @param {Object} [options.center] 图层自定义定位视角 {@link Map#setCameraView}
   * @param {Number} options.center.lng 经度值, 180 - 180
   * @param {Number} options.center.lat 纬度值, -90 - 90
   * @param {Number} [options.center.alt] 高度值
   * @param {Number} [options.center.heading] 方向角度值，绕垂直于地心的轴旋转角度, 0-360
   * @param {Number} [options.center.pitch] 俯仰角度值，绕纬度线旋转角度, 0-360
   * @param {Number} [options.center.roll] 翻滚角度值，绕经度线旋转角度, 0-360
   * @param {Boolean} [options.flyTo] 加载完成数据后是否自动飞行定位到数据所在的区域。
   * @export
   * @class S3MLayer
   * @extends {BaseLayer}
   */
  class S3MLayer extends BaseLayer$1 {

    /**
     * 模型对应的Cesium.S3MTilesLayer图层组
     * @type {Object[]}
     * @readonly
     * @see http://support.supermap.com.cn:8090/webgl/docs/Documentation/S3MTilesLayer.html
     */
    get layer() {
      return this._layerArr
    }



    /**
     * 设置S3M图层本身支持的参数
     * @type {Object}
     * @see [S3M支持的参数]{@link http://support.supermap.com.cn:8090/webgl/docs/Documentation/S3MTilesLayer.html?classFilter=S3MTilesLayer}
     */
    get s3mOptions() {
      return this.options.s3mOptions
    }

    set s3mOptions(value) {
      for (const key in value) {
        let val = value[key];
        this.options.s3mOptions[key] = val;

        if (key === "transparentBackColor") {
          // 去黑边，与offset互斥，注意别配置offset
          val = Cesium$2.Color.fromCssColorString(val);
        } else if (key === "transparentBackColorTolerance") {
          val = Number(val);
        }

        for (let i = 0; i < this._layerArr.length; i++) {
          const layer = this._layerArr[i];
          if (layer == null) {
            continue
          }
          layer[key] = val;
        }
      }
    }

    /**
     * 对象添加到地图前创建一些对象的钩子方法，
     * 只会调用一次
     * @return {void}  无
     * @private
     */
    _mountedHook() {
      // 场景添加S3M图层服务
      let promise;
      if (this.options.layername) {
        promise = this._map.scene.addS3MTilesLayerByScp(this.options.url, {
          name: this.options.layername,
          autoSetVie: this.options.flyTo,
          cullEnabled: this.options.cullEnabled
        });
      } else {
        promise = this._map.scene.open(this.options.url, this.options.sceneName, {
          autoSetVie: this.options.flyTo
        });
      }

      promise.then(
        (smLayer) => {
          if (Array.isArray(smLayer)) {
            this._layerArr = smLayer;
          } else {
            this._layerArr = [smLayer];
          }

          for (let i = 0; i < this._layerArr.length; i++) {
            const layer = this._layerArr[i];
            if (!layer) {
              continue
            }
            try {
              this._initModelItem(layer);
            } catch (e) {
              mars3d__namespace.Log.logError("s3m图层初始化出错", e);
            }
          }

          if (this.options.flyTo) {
            this.flyToByAnimationEnd();
          }
          this._readyPromise.resolve(this);
          this.fire(mars3d__namespace.EventType.load, { layers: this._layerArr });
        },
        (error) => {
          this._readyPromise.reject(error);
        }
      );

      // this._map.viewer.pickEvent.addEventListener(function (feature) {
      //   debugger;
      // });
    }

    // 对单个s3m图层处理
    _initModelItem(layer) {
      // 图层参数合并
      if (this.options.s3mOptions) {
        for (const key in this.options.s3mOptions) {
          const val = this.options.s3mOptions[key];

          if (key === "transparentBackColor") {
            layer[key] = Cesium$2.Color.fromCssColorString(val); // 去黑边
          } else if (key === "transparentBackColorTolerance") {
            layer[key] = Number(val);
          } else {
            layer[key] = val;
          }
        }
      }

      // 选中颜色
      if (this.options.highlight) {
        layer.selectedColor = mars3d__namespace.Util.getColorByStyle(this.options.highlight);
      }

      // 高度调整
      if (this.options?.position?.alt) {
        layer.style3D.altitudeMode = Cesium$2.HeightReference.NONE;
        layer.style3D.bottomAltitude = this.options.position.alt;
        if (layer.refresh) {
          layer.refresh(); // 设置风格后需刷新
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
      for (const i in this._layerArr) {
        this._layerArr[i].visible = true;
        this._layerArr[i].show = true;
      }
    }

    /**
     * 对象从地图上移除的创建钩子方法，
     * 每次remove时都会调用
     * @return {void}  无
     * @private
     */
    _removedHook() {
      if (this._layerArr) {
        for (const i in this._layerArr) {
          this._layerArr[i].visible = false;
          this._layerArr[i].show = false;
        }
      }
    }

    /**
     * 设置透明度
     * @param {Number} value 透明度
     * @return {void}  无
     */
    setOpacity(value) {
      if (this._layerArr) {
        for (let i = 0; i < this._layerArr.length; i++) {
          const item = this._layerArr[i];
          if (item == null) {
            continue
          }

          item.style3D.fillForeColor.alpha = value;
        }
      }
    }

    // 定位至数据区域
    flyTo(options = {}) {
      if (this.options.center) {
        this._map.setCameraView(this.options.center, options);
      } else if (this.options.extent) {
        this._map.flyToExtent(this.options.extent, options);
      }
    }
  }
  mars3d__namespace.layer.S3MLayer = S3MLayer;

  // 注册下
  mars3d__namespace.LayerUtil.register("supermap_s3m", S3MLayer);

  const Cesium$1 = mars3d__namespace.Cesium;

  const BaseTileLayer = mars3d__namespace.layer.BaseTileLayer;

  /**
   * 超图影像瓦片服务图层,
   * 【需要引入  mars3d-supermap 插件库】
   *
   * @param {Object} [options] 参数对象，包括以下：
   * @param {String} options.url supermap的影像服务地址
   * @param {String|String[]} [options.subdomains] URL模板中用于 {s} 占位符的子域。 如果此参数是单个字符串，则字符串中的每个字符都是一个子域。如果是 一个数组，数组中的每个元素都是一个子域。
   * @param {String} [options.tileFormat] 影像图片格式，默认为png。
   * @param {Boolean} [options.transparent=true] 设置请求的地图服务的参数是否为transparent。
   * @param {String|Cesium.Color} [options.transparentBackColor] 设置影像透明色。
   * @param {Number} [options.transparentBackColorTolerance] 去黑边,设置影像透明色容限，取值范围为0.0~1.0。0.0表示完全透明，1.0表示完全不透明。
   * @param {String} [options.cacheKey] 影像的三维缓存密钥。
   *
   * @param {Number} [options.minimumLevel=0] 瓦片所支持的最低层级，如果数据没有第0层，该参数必须配置,当地图小于该级别时，平台不去请求服务数据。
   * @param {Number} [options.maximumLevel] 瓦片所支持的最大层级,大于该层级时会显示上一层拉伸后的瓦片，当地图大于该级别时，平台不去请求服务数据。
   * @param {Number} [options.minimumTerrainLevel] 展示影像图层的最小地形细节级别，小于该级别时，平台不显示影像数据。
   * @param {Number} [options.maximumTerrainLevel] 展示影像图层的最大地形细节级别，大于该级别时，平台不显示影像数据。
   * @param {Object} [options.rectangle] 瓦片数据的矩形区域范围
   * @param {Number} options.rectangle.xmin 最小经度值, -180 至 180
   * @param {Number} options.rectangle.xmax 最大纬度值, -180 至 180
   * @param {Number} options.rectangle.ymin 最小纬度值, -90 至 90
   * @param {Number} options.rectangle.ymax 最大纬度值, -90 至 90
   * @param {Number[]} [options.bbox] bbox规范的瓦片数据的矩形区域范围,与rectangle二选一即可。
   * @param {Number} [options.zIndex] 控制图层的叠加层次，默认按加载的顺序进行叠加，但也可以自定义叠加顺序，数字大的在上面(只对同类型图层间有效)。
   * @param {CRS} [options.crs=CRS.EPSG:3857] 瓦片数据的坐标系信息，默认为墨卡托投影
   * @param {ChinaCRS} [options.chinaCRS] 标识瓦片的国内坐标系（用于自动纠偏或加偏），自动将瓦片转为map对应的chinaCRS类型坐标系。
   *
   * @param {String} [options.proxy] 加载资源时要使用的代理服务url。
   * @param {Object} [options.templateValues] 一个对象，用于替换Url中的模板值的键/值对
   * @param {Object} [options.queryParameters] 一个对象，其中包含在检索资源时将发送的查询参数。比如：queryParameters: {'access_token': '123-435-456-000'},
   * @param {Object} [options.headers] 一个对象，将发送的其他HTTP标头。比如：headers: { 'X-My-Header': 'valueOfHeader' },
   * @param {Boolean} [options.enablePickFeatures=true] 如果为true，则 {@link UrlTemplateImageryProvider#pickFeatures} 请求 pickFeaturesUrl 并尝试解释响应中包含的功能。
   *        如果为 false{@link UrlTemplateImageryProvider#pickFeatures} 会立即返回未定义（表示没有可拾取的内容） 功能）而无需与服务器通信。如果您知道数据，则将此属性设置为false 源不支持选择功能，或者您不希望该提供程序的功能可供选择。注意 可以通过修改 {@link UriTemplateImageryProvider#enablePickFeatures}来动态覆盖 属性。
   * @param {Cesium.GetFeatureInfoFormat[]} [options.getFeatureInfoFormats] 在某处获取功能信息的格式 调用 {@link UrlTemplateImageryProvider#pickFeatures} 的特定位置。如果这 参数未指定，功能选择已禁用。
   *
   * @param {Number} [options.opacity = 1.0] 透明度，取值范围：0.0-1.0。
   * @param {Number|Function} [options.alpha=1.0] 同opacity。
   * @param {Number|Function} [options.nightAlpha=1.0] 当 enableLighting 为 true 时 ，在地球的夜晚区域的透明度，取值范围：0.0-1.0。
   * @param {Number|Function} [options.dayAlpha=1.0]  当 enableLighting 为 true 时，在地球的白天区域的透明度，取值范围：0.0-1.0。
   * @param {Number|Function} [options.brightness=1.0] 亮度
   * @param {Number|Function} [options.contrast=1.0] 对比度。 1.0使用未修改的图像颜色，小于1.0会降低对比度，而大于1.0则会提高对比度。
   * @param {Number|Function} [options.hue=0.0] 色调。 0.0 时未修改的图像颜色。
   * @param {Number|Function} [options.saturation=1.0] 饱和度。 1.0使用未修改的图像颜色，小于1.0会降低饱和度，而大于1.0则会增加饱和度。
   * @param {Number|Function} [options.gamma=1.0] 伽马校正值。 1.0使用未修改的图像颜色。
   * @param {Number} [options.maximumAnisotropy=maximum supported] 使用的最大各向异性水平 用于纹理过滤。如果未指定此参数，则支持最大各向异性 将使用WebGL堆栈。较大的值可使影像在水平方向上看起来更好 视图。
   * @param {Cesium.Rectangle} [options.cutoutRectangle] 制图矩形，用于裁剪此ImageryLayer的一部分。
   * @param {Cesium.Color} [options.colorToAlpha]  用作Alpha的颜色。
   * @param {Number} [options.colorToAlphaThreshold=0.004] 颜色到Alpha的阈值。
   * @param {Boolean} [options.hasAlphaChannel=true] 如果此图像提供者提供的图像为真 包括一个Alpha通道；否则为假。如果此属性为false，则为Alpha通道，如果 目前，将被忽略。如果此属性为true，则任何没有Alpha通道的图像都将 它们的alpha随处可见。当此属性为false时，内存使用情况 和纹理上传时间可能会减少。
   * @param {Number} [options.tileWidth=256] 图像图块的像素宽度。
   * @param {Number} [options.tileHeight=256] 图像图块的像素高度。
   * @param {Object} [options.customTags] 允许替换网址模板中的自定义关键字。该对象必须具有字符串作为键，并且必须具有值。
   *
   * @param {String|Number} [options.id = uuid()] 图层id标识
   * @param {String|Number} [options.pid = -1] 图层父级的id，一般图层管理中使用
   * @param {String} [options.name = ''] 图层名称
   * @param {Boolean} [options.show = true] 图层是否显示
   * @param {BaseClass|Boolean} [options.eventParent]  指定的事件冒泡对象，默认为map对象，false时不冒泡
   * @param {Object} [options.center] 图层自定义定位视角 {@link Map#setCameraView}
   * @param {Number} options.center.lng 经度值, 180 - 180
   * @param {Number} options.center.lat 纬度值, -90 - 90
   * @param {Number} [options.center.alt] 高度值
   * @param {Number} [options.center.heading] 方向角度值，绕垂直于地心的轴旋转角度, 0-360
   * @param {Number} [options.center.pitch] 俯仰角度值，绕纬度线旋转角度, 0-360
   * @param {Number} [options.center.roll] 翻滚角度值，绕经度线旋转角度, 0-360
   * @param {Boolean} [options.flyTo] 加载完成数据后是否自动飞行定位到数据所在的区域。
   * @export
   * @class SmImgLayer
   * @extends {BaseTileLayer}
   *
   * @see http://support.supermap.com.cn:8090/webgl/docs/Documentation/SuperMapImageryProvider.html?classFilter=SuperMapImageryProvider
   */
  class SmImgLayer extends BaseTileLayer {
    // 构建ImageryProvider
    _createImageryProvider(options) {
      return createImageryProvider(options)
    }

    // 添加时
    _addedHook() {
      super._addedHook();

      if (Cesium$1.defined(this.options.transparentBackColor)) {
        this._imageryLayer.transparentBackColor = mars3d__namespace.Util.getCesiumColor(this.options.transparentBackColor);
        this._imageryLayer.transparentBackColorTolerance = this.options.transparentBackColorTolerance; // 去黑边
      }
    }
  }
  function createImageryProvider(options) {
    options = mars3d__namespace.LayerUtil.converOptions(options);

    if (options.url instanceof Cesium$1.Resource) {
      options.url = options.url.url;
    }

    if (Cesium$1.defined(options.transparentBackColor)) {
      delete options.transparentBackColor;
      delete options.transparentBackColorTolerance;
    }
    return new Cesium$1.SuperMapImageryProvider(options)
  }

  /**
   * 创建用于图层的 ImageryProvider对象
   *
   * @param {Object} options Provider参数，同图层构造参数。
   * @return {Cesium.ImageryProvider} ImageryProvider类
   * @function
   */
  SmImgLayer.createImageryProvider = createImageryProvider;

  mars3d__namespace.layer.SmImgLayer = SmImgLayer;

  // 注册下
  const layerType = "supermap_img";
  mars3d__namespace.LayerUtil.register(layerType, SmImgLayer);
  mars3d__namespace.LayerUtil.registerImageryProvider(layerType, createImageryProvider);

  const Cesium = mars3d__namespace.Cesium;

  const BaseLayer = mars3d__namespace.layer.BaseLayer;

  /**
   * 超图MVT矢量瓦片图层,
   * 【需要引入  mars3d-supermap 插件库】
   *
   * @param {Object} [options] 参数对象，包括以下：
   * @param {String} options.url 适用于通过SuperMap桌面软件生成mvt数据,经iServer发布为rest风格的地图服务，只需提供服务地址。
   * @param {String} options.layer 图层名称,适用于第三方发布的WMTS服务。
   * @param {Number} [options.canvasWidth] 用来绘制矢量的纹理边长。默认是512，越大越精细，越小性能越高。
   * @param {String} [options.format='mvt'] 适用于第三方发布的WMTS服务。
   * @param {Object} [options.mapboxStyle] 使用的mapBox风格。
   * @param {Object} [options.多个参数] 参考[supermap官方API]{@link http://support.supermap.com.cn:8090/webgl/docs/Documentation/Scene.html#addVectorTilesLayer}
   *
   *
   * @param {String|Number} [options.id = uuid()] 图层id标识
   * @param {String|Number} [options.pid = -1] 图层父级的id，一般图层管理中使用
   * @param {String} [options.name = ''] 图层名称
   * @param {Boolean} [options.show = true] 图层是否显示
   * @param {BaseClass|Boolean} [options.eventParent]  指定的事件冒泡对象，默认为map对象，false时不冒泡
   * @param {Object} [options.center] 图层自定义定位视角 {@link Map#setCameraView}
   * @param {Number} options.center.lng 经度值, 180 - 180
   * @param {Number} options.center.lat 纬度值, -90 - 90
   * @param {Number} [options.center.alt] 高度值
   * @param {Number} [options.center.heading] 方向角度值，绕垂直于地心的轴旋转角度, 0-360
   * @param {Number} [options.center.pitch] 俯仰角度值，绕纬度线旋转角度, 0-360
   * @param {Number} [options.center.roll] 翻滚角度值，绕经度线旋转角度, 0-360
   * @param {Boolean} [options.flyTo] 加载完成数据后是否自动飞行定位到数据所在的区域。
   * @export
   * @class SmMvtLayer
   * @extends {BaseLayer}
   */
  class SmMvtLayer extends BaseLayer {
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
      this._mvtLayer = this._map.scene.addVectorTilesMap(this.options);
      this._mvtLayer.readyPromise.then(function (data) {
        // setPaintProperty(layerId, name, value, options)
        // for(var layerId in that.options.style){
        //     that._mvtLayer.setPaintProperty(layerId, "fill-color", "rgba(255,0,0,0.8)");
        // }
      });

      const scene = this._map.scene;
      const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction((event) => {
        if (!this.show) {
          return
        }

        const position = mars3d__namespace.PointUtil.getCurrentMousePosition(scene, event.position);

        // 查询出相交图层的feature
        const features = this._mvtLayer.queryRenderedFeatures([position], {
          // layers: [selectLayer.id]
        });

        // eslint-disable-next-line array-callback-return
        features.reduce((memo, result) => {
          const attr = result.feature.properties;
          if (!attr) {
            // eslint-disable-next-line array-callback-return
            return
          }

          const content = mars3d__namespace.Util.getPopupForConfig(this.options, attr);
          const item = {
            data: attr,
            event: event
          };
          this._map.openPopup(position, content, item);
        });
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.handler = handler;
    }

    /**
     * 对象添加到地图上的创建钩子方法，
     * 每次add时都会调用
     * @return {void}  无
     * @private
     */
    _addedHook() {
      this._mvtLayer.show = true;
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
        this._mvtLayer.show = false;
      }
    }

    /**
     * 设置透明度
     * @param {Number} value 透明度
     * @return {void}  无
     */
    setOpacity(value) {
      if (this._mvtLayer) {
        this._mvtLayer.alpha = parseFloat(value);
      }
    }

    // 定位至数据区域
    flyTo(options = {}) {
      if (this.options.center) {
        this._map.setCameraView(this.options.center, options);
      } else if (this.options.extent) {
        this._map.flyToExtent(this.options.extent, options);
      } else if (this._mvtLayer) {
        this._map.camera.flyTo({
          ...options,
          destination: this._mvtLayer.rectangle
        });
      }
    }
  }
  mars3d__namespace.layer.SmMvtLayer = SmMvtLayer;

  // 注册下
  mars3d__namespace.LayerUtil.register("supermap_mvt", SmMvtLayer);

  exports.S3MLayer = S3MLayer;
  exports.SmImgLayer = SmImgLayer;
  exports.SmMvtLayer = SmMvtLayer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=mars3d-supermap-src.js.map
