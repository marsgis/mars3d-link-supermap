import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

const BaseTileLayer = mars3d.layer.BaseTileLayer

/**
 * 超图影像瓦片服务图层,
 * 【需要引入  mars3d-supermap 插件库】
 *
 * @param {object} [options] 参数对象，包括以下：
 * @param {string} options.url supermap的影像服务地址
 * @param {string|string[]} [options.subdomains] URL模板中用于 {s} 占位符的子域。 如果此参数是单个字符串，则字符串中的每个字符都是一个子域。如果是 一个数组，数组中的每个元素都是一个子域。
 * @param {string} [options.tileFormat] 影像图片格式，默认为png。
 * @param {boolean} [options.transparent=true] 设置请求的地图服务的参数是否为transparent。
 * @param {string|Cesium.Color} [options.transparentBackColor] 设置影像透明色。
 * @param {number} [options.transparentBackColorTolerance] 去黑边,设置影像透明色容限，取值范围为0.0~1.0。0.0表示完全透明，1.0表示完全不透明。
 * @param {string} [options.cacheKey] 影像的三维缓存密钥。
 *
 * @param {number} [options.minimumLevel=0] 瓦片所支持的最低层级，如果数据没有第0层，该参数必须配置,当地图小于该级别时，平台不去请求服务数据。
 * @param {number} [options.maximumLevel] 瓦片所支持的最大层级,大于该层级时会显示上一层拉伸后的瓦片，当地图大于该级别时，平台不去请求服务数据。
 * @param {number} [options.minimumTerrainLevel] 展示影像图层的最小地形细节级别，小于该级别时，平台不显示影像数据。
 * @param {number} [options.maximumTerrainLevel] 展示影像图层的最大地形细节级别，大于该级别时，平台不显示影像数据。
 * @param {object} [options.rectangle] 瓦片数据的矩形区域范围
 * @param {number} options.rectangle.xmin 最小经度值, -180 至 180
 * @param {number} options.rectangle.xmax 最大经度值, -180 至 180
 * @param {number} options.rectangle.ymin 最小纬度值, -90 至 90
 * @param {number} options.rectangle.ymax 最大纬度值, -90 至 90
 * @param {number[]} [options.bbox] bbox规范的瓦片数据的矩形区域范围[xmin ,ymin ,xmax ,ymax],与rectangle二选一即可。
 * @param {number} [options.zIndex] 控制图层的叠加层次，默认按加载的顺序进行叠加，但也可以自定义叠加顺序，数字大的在上面(只对同类型图层间有效)。
 * @param {CRS} [options.crs=CRS.EPSG3857] 瓦片数据的坐标系信息，默认为墨卡托投影
 * @param {ChinaCRS} [options.chinaCRS] 标识瓦片的国内坐标系（用于自动纠偏或加偏），自动将瓦片转为map对应的chinaCRS类型坐标系。
 *
 * @param {string} [options.proxy] 加载资源时要使用的代理服务url。
 * @param {object} [options.queryParameters] 一个对象，其中包含在检索资源时将发送的查询参数。比如：queryParameters: {'access_token': '123-435-456-000'},
 * @param {object} [options.headers] 一个对象，将发送的其他HTTP标头。比如：headers: { 'X-My-Header': 'valueOfHeader' },
 * @param {boolean} [options.enablePickFeatures=true] 如果为true，则 {@link UrlTemplateImageryProvider#pickFeatures} 请求 pickFeaturesUrl 并尝试解释响应中包含的功能。
 *        如果为 false{@link UrlTemplateImageryProvider#pickFeatures} 会立即返回未定义（表示没有可拾取的内容） 功能）而无需与服务器通信。如果您知道数据，则将此属性设置为false 源不支持选择功能，或者您不希望该提供程序的功能可供选择。注意 可以通过修改 {@link UriTemplateImageryProvider#enablePickFeatures}来动态覆盖 属性。
 * @param {Cesium.GetFeatureInfoFormat[]} [options.getFeatureInfoFormats] 在某处获取功能信息的格式 调用 {@link UrlTemplateImageryProvider#pickFeatures} 的特定位置。如果这 参数未指定，功能选择已禁用。
 *
 * @param {number} [options.opacity = 1.0] 透明度，取值范围：0.0-1.0。
 * @param {number|Function} [options.alpha=1.0] 同opacity。
 * @param {number|Function} [options.nightAlpha=1.0] 当 enableLighting 为 true 时 ，在地球的夜晚区域的透明度，取值范围：0.0-1.0。
 * @param {number|Function} [options.dayAlpha=1.0]  当 enableLighting 为 true 时，在地球的白天区域的透明度，取值范围：0.0-1.0。
 * @param {number|Function} [options.brightness=1.0] 亮度
 * @param {number|Function} [options.contrast=1.0] 对比度。 1.0使用未修改的图像颜色，小于1.0会降低对比度，而大于1.0则会提高对比度。
 * @param {number|Function} [options.hue=0.0] 色调。 0.0 时未修改的图像颜色。
 * @param {number|Function} [options.saturation=1.0] 饱和度。 1.0使用未修改的图像颜色，小于1.0会降低饱和度，而大于1.0则会增加饱和度。
 * @param {number|Function} [options.gamma=1.0] 伽马校正值。 1.0使用未修改的图像颜色。
 * @param {number} [options.maximumAnisotropy=maximum supported] 使用的最大各向异性水平 用于纹理过滤。如果未指定此参数，则支持最大各向异性 将使用WebGL堆栈。较大的值可使影像在水平方向上看起来更好 视图。
 * @param {Cesium.Rectangle} [options.cutoutRectangle] 制图矩形，用于裁剪此ImageryLayer的一部分。
 * @param {Cesium.Color} [options.colorToAlpha]  用作Alpha的颜色。
 * @param {number} [options.colorToAlphaThreshold=0.004] 颜色到Alpha的阈值。
 * @param {boolean} [options.hasAlphaChannel=true] 如果此图像提供者提供的图像为真 包括一个Alpha通道；否则为假。如果此属性为false，则为Alpha通道，如果 目前，将被忽略。如果此属性为true，则任何没有Alpha通道的图像都将 它们的alpha随处可见。当此属性为false时，内存使用情况 和纹理上传时间可能会减少。
 * @param {number} [options.tileWidth=256] 图像图块的像素宽度。
 * @param {number} [options.tileHeight=256] 图像图块的像素高度。
 * @param {object} [options.customTags] 允许替换网址模板中的自定义关键字。该对象必须具有字符串作为键，并且必须具有值。
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
 * @class SmImgLayer
 * @extends {BaseTileLayer}
 *
 * @see http://support.supermap.com.cn:8090/webgl/docs/Documentation/SuperMapImageryProvider.html?classFilter=SuperMapImageryProvider
 */
export class SmImgLayer extends BaseTileLayer {
  // 构建ImageryProvider
  async _createImageryProvider(options) {
    return await createImageryProvider(options)
  }

  // 添加时
  _addedHook() {
    super._addedHook()

    if (Cesium.defined(this.options.transparentBackColor)) {
      this._imageryLayer.transparentBackColor = mars3d.Util.getCesiumColor(this.options.transparentBackColor)
      this._imageryLayer.transparentBackColorTolerance = this.options.transparentBackColorTolerance // 去黑边
    }
  }
}
async function createImageryProvider(options) {
  options = mars3d.LayerUtil.converOptions(options)

  if (options.url instanceof Cesium.Resource) {
    options.url = options.url.url
  }

  if (Cesium.defined(options.transparentBackColor)) {
    delete options.transparentBackColor
    delete options.transparentBackColorTolerance
  }
  return new Cesium.SuperMapImageryProvider(options)
}

/**
 * 创建用于图层的 ImageryProvider对象
 *
 * @param {object} options Provider参数，同图层构造参数。
 * @return {Cesium.ImageryProvider} ImageryProvider类
 * @function
 */
SmImgLayer.createImageryProvider = createImageryProvider

mars3d.layer.SmImgLayer = SmImgLayer

// 注册下
const layerType = "supermap_img"
mars3d.LayerUtil.register(layerType, SmImgLayer)
mars3d.LayerUtil.registerImageryProvider(layerType, createImageryProvider)
