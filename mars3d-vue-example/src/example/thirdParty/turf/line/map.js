import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象

let lineLayer

export const mapOptions = {
  scene: {
    center: { lat: 31.855058, lng: 117.312337, alt: 79936, heading: 0, pitch: -90 }
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

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 基础线矢量数据
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function drawLine() {
  clearLayer()

  lineLayer.startDraw({
    type: "polyline",
    style: {
      color: "#55ff33",
      width: 3,
      clampToGround: false
    }
  })
}

// 计算曲线
export function calculationCurve() {
  graphicLayer.clear()

  let line = lineLayer.getGraphics()
  if (line.length === 0) {
    globalMsg("请绘制线！")
    return
  }
  line = line[0].toGeoJSON()

  const curved = turf.bezierSpline(line)
  const positions = curved.geometry.coordinates

  const graphic = new mars3d.graphic.PolylineEntity({
    positions: positions,
    style: {
      width: 4,
      color: "#00ffff"
    }
  })
  graphicLayer.addGraphic(graphic)
}

// 计算平行线
export function parallelLines(distance) {
  let line = lineLayer.getGraphics()
  if (line.length === 0) {
    globalMsg("请绘制线！")
    return
  }
  line = line[0].toGeoJSON()

  graphicLayer.clear()

  const offsetLine = turf.lineOffset(line, distance, { units: "miles" })

  const positions = offsetLine.geometry.coordinates

  const graphic = new mars3d.graphic.PolylineEntity({
    positions: positions,
    style: {
      width: 4,
      color: "#ff0000"
    }
  })
  graphicLayer.addGraphic(graphic)
}

export function clearLayer() {
  graphicLayer.clear()
  lineLayer.clear()
}
