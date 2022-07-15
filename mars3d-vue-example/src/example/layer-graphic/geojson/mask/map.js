import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.307787, lng: 117.559842, alt: 312871, heading: 0, pitch: -64 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1,
      maximumZoomDistance: 1000000
    }
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
  // geojson 合肥边界线
  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/areas/340100.json",
    mask: true, // 标识为遮罩层【重点参数】
    symbol: {
      styleOptions: {
        fill: true,
        color: "rgb(2,26,79)",
        opacity: 0.9,
        outline: true,
        outlineColor: "#39E09B",
        outlineWidth: 8,
        outlineOpacity: 0.8,
        arcType: Cesium.ArcType.GEODESIC,
        clampToGround: true
      }
    }
    // flyTo: true
  })
  map.addLayer(geoJsonLayer)

  window.geoJsonLayer = geoJsonLayer
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
