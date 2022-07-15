import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 22.969426, lng: 110.603628, alt: 7059762, heading: 354, pitch: -82 }
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
  tileLayer = new mars3d.layer.XyzLayer({
    url: "//data.mars3d.cn/tile/dizhiChina/{z}/{x}/{y}.png",
    crs: "EPSG:3857", // 标识为Web墨卡托投影坐标系，也是默认值
    minimumLevel: 0,
    maximumLevel: 10,
    rectangle: { xmin: 69.706929, xmax: 136.560941, ymin: 15.831038, ymax: 52.558005 },
    opacity: 0.7,
    center: { lat: 22.43392, lng: 113.23887, alt: 8157553, heading: 354, pitch: -82 },
    flyTo: true
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
