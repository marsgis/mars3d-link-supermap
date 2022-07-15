import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tileLayer
let wmsLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 28.268322, lng: 117.426104, alt: 1052215, heading: 0, pitch: -69 }
  },
  control: {
    baseLayerPicker: false
  },
  basemaps: [],
  layers: [{ type: "tileinfo", name: "瓦片信息", zIndex: 3, show: true }]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
  addLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addLayer() {
  // 添加图层
  tileLayer = new mars3d.layer.TdtLayer({
    name: "天地图影像",
    layer: "img_d",
    zIndex: 1
  })
  map.addLayer(tileLayer)

  // wms、arcgis等矢量发布类型图层支持click事件
  wmsLayer = new mars3d.layer.WmsLayer({
    url: "//server.mars3d.cn/geoserver/mars/wms",
    layers: "mars:hf",
    crs: "EPSG:4326",
    parameters: {
      transparent: "true",
      format: "image/png"
    },
    getFeatureInfoParameters: {
      feature_count: 10
    },
    popup: "all",
    zIndex: 2
  })
  map.addLayer(wmsLayer)

  addTileStatus()
}

function addTileStatus() {
  map.on(mars3d.EventType.tileLoadProgress, function (count) {
    // console.log(`地图所有瓦片加载,剩余：${count}`)
    if (count === 0) {
      console.log(`地图所有瓦片加载完成`)
    }
  })

  let count = 0
  // 添加单个瓦片，开始加载瓦片（请求前）
  tileLayer.on(mars3d.EventType.addTile, function (event) {
    count++
    console.log(`${count},开始请求加载瓦片: L:${event.level},X:${event.x},Y:${event.y}`)
  })
  // 添加单个瓦片 加载瓦片完成
  tileLayer.on(mars3d.EventType.addTileSuccess, function (event) {
    count--
    console.log(`${count},开始请求加载瓦片: L:${event.level},X:${event.x},Y:${event.y}`)
  })
  // 添加单个瓦片 加载瓦片出错
  tileLayer.on(mars3d.EventType.addTileError, function (event) {
    count--
    console.log(`${count},开始请求加载瓦片: L:${event.level},X:${event.x},Y:${event.y}`)
  })

  // 卸载移除了瓦片
  tileLayer.on(mars3d.EventType.removeTile, function (event) {
    console.log(`卸载移除了瓦片: L:${event.level},X:${event.x},Y:${event.y}`)
  })

  // 单击事件
  wmsLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了矢量数据，共" + event.features.length + "条", event)
  })
}
