import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 33.211374, lng: 117.277002, alt: 1200952, heading: 354, pitch: -72 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "XYZ瓦片",
      icon: "img/basemaps/google_vec.png",
      type: "xyz",
      url: "http://t3.tianditu.gov.cn/img_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={z}&layer=img&style=default&tilerow={y}&tilecol={x}&tilematrixset=c&format=tiles&tk=6c99c7793f41fccc4bd595b03711913e",
      crs: "EPSG:4490", // 标识坐标系
      show: true
    }
  ],
  layers: [
    {
      name: "山东电子",
      icon: "img/basemaps/google_vec.png",
      type: "xyz",
      url: "http://www.sdmap.gov.cn/tileservice/SDPubMap?layer=SDPubMap&style=default&tilematrixset=default028mm&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}",
      crs: "EPSG:4490",
      rectangle: { xmin: 114.3, xmax: 123.2, ymin: 34.165, ymax: 38.626 },
      minimumLevel: 5,
      maximumLevel: 18,
      alpha: 1,
      queryParameters: {
        // 可以传自定义url参数，如token等
        token: "mars3d"
      },
      show: true
    }
    // {
    //     "name": "arcgis服务",
    //     "icon": "img/basemaps/google_vec.png",
    //     "type": "xyz",
    //     "url": "https://localhost:6080/arcgis/rest/services/test/MapServer/tile/{z}/{y}/{x}",
    //     "crs": "EPSG:4490",
    //     "minimumLevel": 0,
    //     "maximumLevel": 18
    // },
    // {
    //     "name": "WMTS",
    //     "icon": "img/basemaps/google_vec.png",
    //     "type": "xyz",
    //     "url": "http://47.106.133.145:20000/geowebcache/service/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=arcgis-China&STYLE=_null&FORMAT=image/jpeg&TILEMATRIXSET=EPSG:4326_arcgis-China&TILEMATRIX=EPSG:4326_arcgis-China:{z}&TILEROW={y}&TILECOL={x}",
    //     "crs": "EPSG:4490",
    //     "minimumLevel": 0,
    //     "maximumLevel": 18,
    //     "proxy": "//server.mars3d.cn/proxy/",  //代理服务，解决跨域问题
    // }
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

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.ArcGisLayer({
    url: "//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4490/MapServer", // 大地2000地理坐标系
    highlight: {
      clampToGround: true,
      fill: true,
      color: "#2deaf7",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#e000d9",
      outlineOpacity: 1.0
    },
    popup: "all",
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
