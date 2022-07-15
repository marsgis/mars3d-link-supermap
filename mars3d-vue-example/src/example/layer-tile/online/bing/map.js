import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 20.349464, lng: 108.816138, alt: 7733636, heading: 358, pitch: -82 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "Bing影像",
      icon: "img/basemaps/bingAerial.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.AERIAL,
      key: mars3d.Token.bing,
      show: true
    },
    {
      name: "Bing影像(含注记)",
      icon: "img/basemaps/bingAerialLabels.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.AERIAL_WITH_LABELS,
      key: mars3d.Token.bing
    },
    {
      name: "Bing电子地图",
      icon: "img/basemaps/bingRoads.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.ROAD,
      key: mars3d.Token.bing
    },
    {
      name: "Bing电子地图2",
      icon: "img/basemaps/bingRoads.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.ROAD_ON_DEMAND,
      key: mars3d.Token.bing
    },
    {
      name: "Bing浅色电子​​",
      icon: "img/basemaps/bingAerialLabels.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.CANVAS_LIGHT,
      key: mars3d.Token.bing
    },
    {
      name: "Bing深色地图",
      icon: "img/basemaps/bd-c-midnight.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.CANVAS_DARK,
      key: mars3d.Token.bing
    },
    {
      name: "Bing灰色地图",
      icon: "img/basemaps/bingAerialLabels.png",
      type: "bing",
      layer: Cesium.BingMapsStyle.CANVAS_GRAY,
      key: mars3d.Token.bing
    }
  ]
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
  tileLayer = new mars3d.layer.BingLayer({
    layer: Cesium.BingMapsStyle.CANVAS_DARK,
    key: mars3d.Token.bing
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
