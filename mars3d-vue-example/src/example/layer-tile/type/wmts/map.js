import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 36.468047, lng: 104.069505, alt: 16801717, heading: 0, pitch: -88 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "山西天地图",
      icon: "img/basemaps/blackMarble.png",
      type: "wmts",
      url: "http://shanxi.tianditu.gov.cn/service/SX_DOM/wmts",
      layer: "WD_DOM",
      format: "image/tile",
      tileMatrixSetID: "Matrix_WD_DOM_1",
      crs: "EPSG:4490",
      proxy: "//server.mars3d.cn/proxy/", // 代理服务，解决跨域问题
      show: true
    },
    {
      name: "单张图片",
      icon: "img/basemaps/offline.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/world.jpg",
      show: false
    }
  ]
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

  map.setCameraView({ lat: 31.528964, lng: 117.245717, alt: 81718, heading: 0, pitch: -67 })

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.WmtsLayer({
    url: "//server.mars3d.cn/geoserver/gwc/service/wmts",
    layer: "mars:hfgh",
    format: "image/png",
    tileMatrixSetID: "EPSG:4326",
    crs: "EPSG:4326",
    alpha: 0.8,

    pickFeaturesUrl: "//server.mars3d.cn/geoserver/mars/wms",
    popup: "all",
    highlight: {
      type: "wallP",
      diffHeight: 100,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/fence.png",
        color: "#ffff00",
        speed: 10, // 速度，建议取值范围1-100
        axisY: true
      }
    },

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
