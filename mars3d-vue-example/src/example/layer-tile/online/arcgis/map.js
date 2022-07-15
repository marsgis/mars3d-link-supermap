import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.675177, lng: 117.323257, alt: 81193, heading: 0, pitch: -79 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "ArcGIS影像",
      icon: "img/basemaps/esriWorldImagery.png",
      type: "arcgis",
      layer: "img_d", // 使用layer时会自动用内部固定url "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
      enablePickFeatures: false,
      show: true
    },
    {
      name: "ArcGIS电子街道",
      icon: "img/basemaps/google_vec.png",
      type: "arcgis",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
      enablePickFeatures: false
    },
    {
      name: "ArcGIS NatGeo",
      icon: "img/basemaps/esriWorldStreetMap.png",
      type: "arcgis",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer",
      enablePickFeatures: false
    },
    {
      name: "蓝色底图",
      icon: "img/basemaps/bd-c-midnight.png",
      type: "arcgis",
      url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      enablePickFeatures: false,
      chinaCRS: mars3d.ChinaCRS.GCJ02
    },
    {
      name: "灰色底图",
      icon: "img/basemaps/bd-c-grayscale.png",
      type: "arcgis",
      url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer",
      enablePickFeatures: false,
      chinaCRS: mars3d.ChinaCRS.GCJ02
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
  tileLayer = new mars3d.layer.ArcGisLayer({
    url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer",
    enablePickFeatures: false
    // queryParameters: {
    //   mosaicRule: `{"where":"t='20180525'"}`,
    // },
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
