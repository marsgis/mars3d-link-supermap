import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let lineLayer
let pointLayer

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

  // 添加线 矢量数据图层
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)

  lineLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
          pointLayer.clear()
        }
      }
    }
  ])

  // 添加相交点 矢量数据图层
  pointLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(pointLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function drawLine() {
  // 开始绘制
  lineLayer.startDraw({
    type: "polyline",
    style: {
      color: getColor(),
      width: 3,
      clampToGround: true
    }
  })
}

export function crossPoint() {
  lineLayer.stopDraw()
  pointLayer.clear()

  if (lineLayer.length <= 1) {
    globalMsg("请至少绘制两条线")
    return
  }

  const geojson = lineLayer.toGeoJSON()
  const allCount = geojson.features.length

  for (let i = 0; i < allCount; i++) {
    const line1 = geojson.features[i]

    for (let j = i + 1; j < allCount; j++) {
      const line2 = geojson.features[j]

      // 计算相交点
      const intersects = turf.lineIntersect(line1, line2)

      if (intersects.features.length > 0) {
        const intersectsPointGrahic = mars3d.Util.geoJsonToGraphics(intersects.features, {
          style: {
            color: "#0000ff",
            pixelSize: 8,
            outlineColor: "#ffffff",
            outlineWidth: 2,
            clampToGround: true
          }
        })
        pointLayer.addGraphic(intersectsPointGrahic)
      }
    }
  }
}

export function clearAll() {
  pointLayer.clear()
  lineLayer.clear()
}

// 颜色
let index = 0
const colors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#00FF"]
function getColor() {
  const i = index++ % colors.length
  return colors[i]
}
