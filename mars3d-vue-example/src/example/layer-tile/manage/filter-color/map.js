import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.77185, lng: 117.235049, alt: 18176, heading: 0, pitch: -69 }
  }
}
let mapSplit

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = "高德电子"

  mapSplit = new mars3d.control.MapSplit({})
  map.addControl(mapSplit)

  addTileLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 叠加的图层
let tileLayer
export function addTileLayer() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.GaodeLayer({
    layer: "vec",
    invertColor: true, // 反向颜色 color.r = 1.0 - color.r
    filterColor: "#4e70a6", // 滤镜颜色  color.r = color.r * filterColor.r
    brightness: 0.6,
    contrast: 1.8,
    gamma: 0.3,
    hue: 1,
    saturation: 0
  })
  map.addLayer(tileLayer)

  mapSplit.setLayerSplitDirection(tileLayer, Cesium.SplitDirection.RIGHT) // 对模型分屏卷帘
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}

export function setFilterColor(color) {
  if (tileLayer) {
    tileLayer.layer.filterColor = Cesium.Color.fromCssColorString(color)
  }
}
