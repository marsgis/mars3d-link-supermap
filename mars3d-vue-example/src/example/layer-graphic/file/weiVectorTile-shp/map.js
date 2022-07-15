import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.221078, lng: 117.305076, alt: 136530, heading: 10, pitch: -68 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
  showWeiVectorTileLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
/**
 * API文档，参考lib\mars3d\thirdParty\weiVectorTile\Document.rar（解压Document.rar）
 * 显示国界线
 *
 * @returns {void}
 */
function showWeiVectorTileLayer() {
  // shp 国界线

  Promise.all([
    Cesium.Resource.fetchBlob({ url: "//data.mars3d.cn/file/shp/hefei_xz.shp" }),
    Cesium.Resource.fetchBlob({ url: "//data.mars3d.cn/file/shp/hefei_xz.dbf" }),
    Cesium.Resource.fetchBlob({ url: "//data.mars3d.cn/file/shp/hefei_xz.prj" })
  ]).then(function (files) {
    files[0].name = "hefei.shp"
    files[1].name = "hefei.dbf"
    files[2].name = "hefei.prj"

    const tileLayer = new mars3d.layer.WeiVectorTileLayer({
      source: files,
      removeDuplicate: false,
      zIndex: 2,
      encoding: "gbk",
      defaultStyle: {
        // 参考api文档的Cesium.VectorStyle类
        tileCacheSize: 200,

        fill: true, // 是否填充，仅面数据有效。
        fillColor: "rgba(255,255,255,0.01)",

        outline: true, // 是否显示边，仅面数据有效。
        outlineColor: "rgba(209,204,226,1)",
        // lineDash: [3, 10],
        lineWidth: 2,

        showMaker: false,
        showCenterLabel: false
        // showCenterLabel: true, //是否显示文本，仅对线和面数据有效
        // centerLabelPropertyName: 'NAME',
        // fontColor: 'rgba(255,255,255,1)',
        // fontSize: 23,
        // fontFamily: '楷体',
        // labelOffsetX: -10,
        // labelOffsetY: -5,
      },
      maximumLevel: 20,
      minimumLevel: 1,
      simplify: false,
      allowPick: true, // 允许单击
      // 以下为mars3d参数,API参考http://mars3d.cn/api/BaseTileLayer.html#.ConstructorOptions
      maxLength: -1,
      popup: "名称：{name} <br /> 日期：{address}"
    })
    map.addLayer(tileLayer)

    tileLayer.on(mars3d.EventType.click, function (event) {
      console.log("单击了图层", event)
    })
  })
}
