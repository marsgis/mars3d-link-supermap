import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.609076, lng: 117.292797, alt: 17106, heading: 350, pitch: -51 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "马拉松",
    url: "//data.mars3d.cn/file/geojson/hefei-marathon.json",
    onCreateGraphic: function (e) {
      const typeP = e.type + "P" // 修改type为primitive类型展示
      if (mars3d.GraphicType[typeP]) {
        e.type = typeP
      }
      geoJsonLayer.addGraphic(e)
    }
  })
  map.addLayer(geoJsonLayer)
}

// 图层状态 在组件中进行管理的图层
export function getManagerLayer() {
  return map.getLayerByAttr("马拉松", "name")
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function startPoint() {
  map.setCameraView({ lat: 31.77566, lng: 117.226039, alt: 413, heading: 47, pitch: -48 })
}

export function halfWayPoint() {
  map.setCameraView({ lat: 31.723314, lng: 117.247933, alt: 159, heading: 270, pitch: -31 })
}
export function endPoint() {
  map.setCameraView({ lat: 31.712765, lng: 117.294325, alt: 377, heading: 336, pitch: -56 })
}

export function allLine() {
  map.setCameraView({ lat: 31.609076, lng: 117.292797, alt: 17106, heading: 350, pitch: -51 })
}
