import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象

let graphic1
let graphic2

export const mapOptions = {
  scene: {
    center: { lat: 31.715325, lng: 117.233867, alt: 21228, heading: 2, pitch: -60 }
  },
  layers: []
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  addEntity()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addEntity() {
  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 面1
  graphic1 = new mars3d.graphic.PolygonEntity({
    positions: [
      [117.182288, 31.854164, 35.2],
      [117.210254, 31.878324, 28.2],
      [117.238229, 31.855796, 22.4],
      [117.242307, 31.826109, 12.5],
      [117.177277, 31.821475, 54.5],
      [117.182288, 31.854164, 35.2]
    ],
    style: {
      color: "#ff0000",
      opacity: 0.5,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(graphic1)

  // 面2
  graphic2 = new mars3d.graphic.PolygonEntity({
    positions: [
      [117.267046, 31.842971, 25.4],
      [117.20963, 31.840323, 37.2],
      [117.230646, 31.787122, 27.5],
      [117.28833, 31.799624, 20.6],
      [117.267046, 31.842971, 25.4]
    ],
    style: {
      color: "#0000FF",
      opacity: 0.5,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(graphic2)
}

// 求交
let intersectGraphic
export function intersect() {
  if (intersectGraphic) {
    graphicLayer.removeGraphic(intersectGraphic, true)
    intersectGraphic = null
  }

  const layer1 = graphic1.toGeoJSON()
  const layer2 = graphic2.toGeoJSON()
  console.log("2个面的geojson对象", layer1, layer2)

  const geojson = turf.intersect(layer1, layer2)

  intersectGraphic = mars3d.Util.geoJsonToGraphics(geojson)[0]
  intersectGraphic.type = "polygon"
  intersectGraphic.style = {
    color: "#00ff00",
    opacity: 0.8,
    outline: true,
    outlineWidth: 3,
    outlineColor: "#ffffff",
    clampToGround: true,
    label: {
      text: "我是相交部分",
      font_size: 18,
      color: "#000000"
    }
  }
  intersectGraphic = graphicLayer.addGraphic(intersectGraphic)
}

// 清除
export function clear() {
  if (intersectGraphic) {
    graphicLayer.removeGraphic(intersectGraphic, true)
    intersectGraphic = null
  }
}
