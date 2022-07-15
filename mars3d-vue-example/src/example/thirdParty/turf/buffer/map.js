import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true // 绘制完成后是否自动激活编辑
  })
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    updateBuffer(e.graphic)
  })

  graphicLayer.on(mars3d.EventType.editMovePoint, function (e) {
    updateBuffer(e.graphic)
  })

  graphicLayer.on(mars3d.EventType.editRemovePoint, function (e) {
    updateBuffer(e.graphic)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function drawPoint() {
  deleteAll()

  graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 12,
      color: "#ffff00"
    }
  })
}

export function drawPolyline() {
  deleteAll()

  graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#ffff00",
      width: 3,
      clampToGround: true
    }
  })
}

export function drawPolygon() {
  deleteAll()

  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      outline: true,
      outlineColor: "#f0ce22",
      outlineWidth: 4,
      opacity: 0.5,
      clampToGround: true
    }
  })
}

function deleteAll() {
  graphicLayer.clear()
  map.graphicLayer.clear()
  lastgeojson = null
}

let width
export function radiusChange(val) {
  width = val * 1000 // km
  if (lastgeojson) {
    updateBuffer()
  }
}

let lastgeojson
function updateBuffer(graphic) {
  let buffere
  try {
    const geojson = graphic ? graphic.toGeoJSON() : lastgeojson
    geojson.properties = {}

    buffere = mars3d.PolyUtil.buffer(geojson, width)

    lastgeojson = geojson
  } catch (e) {
    console.log("缓冲分析异常", e)
  }
  if (!buffere) {
    return
  }

  const graphicsOptions = mars3d.Util.geoJsonToGraphics(buffere, {
    type: "polygon",
    style: {
      color: "rgba(255,0,0,0.4)",
      clampToGround: true
    }
  })

  map.graphicLayer.clear()
  map.graphicLayer.addGraphic(graphicsOptions)
}
