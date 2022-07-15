import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象
let polygonsLayer

export const mapOptions = {
  scene: {
    center: { lat: 31.771917, lng: 117.373238, alt: 34263, heading: 336, pitch: -69 },
    fxaa: true
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

  polygonsLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(polygonsLayer)

  const graphic = new mars3d.graphic.PolygonEntity({
    positions: [
      [117.271662, 31.870639, 21.49],
      [117.290605, 31.871517, 19.47],
      [117.302056, 31.858145, 16.27],
      [117.299439, 31.847545, 14.77],
      [117.267705, 31.8491, 22.11]
    ],
    style: {
      color: "#3388ff",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff"
    }
  })
  graphicLayer.addGraphic(graphic)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 绘制面
export function drawPolygon() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: getColor(),
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff"
    },
    success: (graphic) => {
      graphicLayer.clear()
      polygonsLayer.clear()
      graphicLayer.addGraphic(graphic)
    }
  })
}

// 旋转面
export function spinPolygons(angle) {
  clearGraphic()

  const graphic = graphicLayer.getGraphics()[0]
  const poly = graphic.toGeoJSON({ closure: true })

  const centerPoint = mars3d.LngLatPoint.fromCartesian(graphic.center).toArray() // 围绕执行旋转的点

  // truf旋转操作
  const rotatedPoly = turf.transformRotate(poly, angle, { pivot: centerPoint })

  const spinGraphic = mars3d.Util.geoJsonToGraphics(rotatedPoly, {
    style: {
      color: "#ff0000",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff"
    }
  })
  polygonsLayer.addGraphic(spinGraphic)
}

// 平移面
export function translationPolygons(offset) {
  clearGraphic()

  const graphic = graphicLayer.getGraphics()[0]
  const poly = graphic.toGeoJSON({ closure: true })

  // truf平移操作
  const rotatedPoly = turf.transformTranslate(poly, offset, 10)

  const spinGraphic = mars3d.Util.geoJsonToGraphics(rotatedPoly, {
    style: {
      color: "#ff0000",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff"
    }
  })
  polygonsLayer.addGraphic(spinGraphic)
}

// 缩放面
export function zoomPolygons(scale) {
  clearGraphic()

  if (scale === 0) {
    return
  }

  const graphic = graphicLayer.getGraphics()[0]
  const poly = graphic.toGeoJSON({ closure: true })

  // truf缩放操作
  const rotatedPoly = turf.transformScale(poly, scale)

  const spinGraphic = mars3d.Util.geoJsonToGraphics(rotatedPoly, {
    style: {
      color: "#ff0000",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff"
    }
  })
  polygonsLayer.addGraphic(spinGraphic)
}

function clearGraphic() {
  polygonsLayer.clear()
  graphicLayer.endDraw()
}

// 颜色
let index = 0
const colors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#0000FF"]
function getColor() {
  const i = index++ % colors.length
  return colors[i]
}
