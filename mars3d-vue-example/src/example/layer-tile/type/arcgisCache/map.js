import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 20.328888, lng: 110.051238, alt: 6352112, heading: 0, pitch: -78 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "ArcGIS影像",
      icon: "img/basemaps/esriWorldImagery.png",
      type: "arcgis_cache",
      url: "//data.mars3d.cn/arcgis_cache/googleVec/_alllayers/{z}/{y}/{x}.jpg",
      upperCase: true, // 标识图片名称是否大写
      minimumLevel: 0,
      maximumLevel: 4,
      show: true
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

  map.setCameraView({ lat: 31.427562, lng: 117.193707, alt: 97757, heading: 3, pitch: -66 })

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.ArcGisCacheLayer({
    url: "//data.mars3d.cn/arcgis_cache/hfgh/_alllayers/{z}/{y}/{x}.png",
    upperCase: false,
    minimumLevel: 1,
    maximumLevel: 17,
    minimumTerrainLevel: 1,
    // "maximumTerrainLevel": 17,
    rectangle: { xmin: 116.846, xmax: 117.642, ymin: 31.533, ymax: 32.185 } // 控制切片如果在矩形坐标内才显示，如果不在矩形坐标内不显示
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
