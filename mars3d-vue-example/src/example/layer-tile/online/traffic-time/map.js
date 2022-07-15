import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.841275, lng: 117.311355, alt: 50289, heading: 292, pitch: -85 }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2017 // 切换至蓝色底图



  addGaodeLayer()
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
export function addGaodeLayer() {
  removeLayer()
  tileLayer = new mars3d.layer.GaodeLayer({
    layer: "time",
    minimumTerrainLevel: 4,
    minimumLevel: 4,
    proxy: "//server.mars3d.cn/proxy/"
  })
  map.addLayer(tileLayer)
}

export function addBaiduLayer() {
  removeLayer()

  tileLayer = new mars3d.layer.BaiduLayer({
    name: "百度实时路况",
    layer: "time"
  })
  map.addLayer(tileLayer)
}

function removeLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
