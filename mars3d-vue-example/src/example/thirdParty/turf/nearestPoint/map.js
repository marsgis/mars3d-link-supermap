import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let pointLayer
let graphicLayer

const pointStyle = {
  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  scale: 1,
  scaleByDistance: true,
  scaleByDistance_far: 20000,
  scaleByDistance_farValue: 0.7,
  scaleByDistance_near: 1000,
  scaleByDistance_nearValue: 1,
  clampToGround: true
}

export const mapOptions = {
  scene: {
    center: { lat: 31.967015, lng: 117.316406, alt: 9150, heading: 206, pitch: -42 },
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

  pointLayer = new mars3d.layer.GeoJsonLayer({
    name: "体育设施点",
    url: "//data.mars3d.cn/file/geojson/hfty-point.json",
    symbol: {
      styleOptions: {
        ...pointStyle,
        image: "img/marker/mark-blue.png"
      }
    },
    popup: "{项目名称}",
    zIndex: 10
  })
  map.addLayer(pointLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer({
    zIndex: 20
  })
  map.addLayer(graphicLayer)

  // 地球点击事件
  map.on(mars3d.EventType.click, (e) => {
    clickPoint(e.cartesian)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function clickPoint(position) {
  if (pointLayer.length === 0) {
    globalMsg("正在加载数据,请稍等......")
    return
  }

  graphicLayer.clear()

  // 生成查询点
  const queryPoint = new mars3d.graphic.BillboardEntity({
    position: position,
    style: {
      ...pointStyle,
      image: "img/marker/route-start.png"
    },
    popup: "查询点"
  })
  graphicLayer.addGraphic(queryPoint)

  // turf分析
  const targetPoint = queryPoint.toGeoJSON()
  const points = pointLayer.toGeoJSON()
  const nearest = turf.nearestPoint(targetPoint, points)
  if (!nearest) {
    return
  }

  const nearestPoint = mars3d.Util.geoJsonToGraphics(nearest)[0]

  // 连线
  const polyline = new mars3d.graphic.PolylineEntity({
    positions: [position, nearestPoint.position],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "rgba(89,249,255,0.8)",
        image: "img/textures/line-tarans.png",
        speed: 8
      }
    }
  })
  graphicLayer.addGraphic(polyline)

  // 终点
  const endPoint = new mars3d.graphic.CircleEntity({
    position: nearestPoint.position,
    style: {
      radius: polyline.distance / 10,
      height: 40,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#00ffff",
        count: 2,
        speed: 20
      }
    },
    popup: "最近的体育场所是:<br />" + nearestPoint.attr["项目名称"]
  })
  graphicLayer.addGraphic(endPoint)
  endPoint.openPopup()
}

export function clearAll() {
  graphicLayer.clear()
}
