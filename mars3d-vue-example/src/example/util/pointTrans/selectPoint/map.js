import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.728284, lng: 117.274164, alt: 25061, heading: 358, pitch: -69 },
    fxaa: true
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  const point = map.getCenter()
  point.format()
  eventTarget.fire("loadCenterPoint", { point })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 获取默认point点
export function defultPoint() {
  const point = map.getCenter()
  point.format()
  return {
    lng: point.lng,
    lat: point.lat,
    alt: point.alt
  }
}

// 坐标转化的三种方法
export function marsUtilFormtNum(item, num) {
  return mars3d.Util.formatNum(item, num)
}
export function marsPointTrans(item) {
  return mars3d.PointTrans.degree2dms(item)
}
export function marsProj4Trans(JD, WD, radio) {
  if (radio === "2") {
    return mars3d.PointTrans.proj4Trans([JD, WD], mars3d.CRS.EPSG4326, mars3d.CRS.CGCS2000_GK_Zone_6)
  } else {
    return mars3d.PointTrans.proj4Trans([JD, WD], mars3d.CRS.EPSG4326, mars3d.CRS.CGCS2000_GK_Zone_3)
  }
}

// 转换成十进制的方法
export function marsDms2degree(du, fen, miao) {
  return mars3d.PointTrans.dms2degree(du, fen, miao)
}
export function marsZONEtoCRS(jd, wd, radio) {
  if (radio === "2") {
    return mars3d.PointTrans.proj4Trans([jd, wd], mars3d.CRS.CGCS2000_GK_Zone_6, mars3d.CRS.EPSG4326)
  } else {
    return mars3d.PointTrans.proj4Trans([jd, wd], mars3d.CRS.CGCS2000_GK_Zone_3, mars3d.CRS.EPSG4326)
  }
}

// 地图选点
export function bindMourseClick() {
  map.setCursor(true)
  map.once(mars3d.EventType.click, function (event) {
    map.setCursor(false)
    const cartesian = event.cartesian
    const point = mars3d.LngLatPoint.fromCartesian(cartesian)
    point.format() // 经度、纬度、高度

    eventTarget.fire("clickMap", { point })
  })
}

let pointEntity
export function updateMarker(hasCenter, jd, wd, alt) {
  const position = [jd, wd, alt]

  if (pointEntity == null) {
    pointEntity = new mars3d.graphic.PointEntity({
      position: position,
      style: {
        color: "#3388ff",
        pixelSize: 10,
        outlineColor: "#ffffff",
        outlineWidth: 2
      }
    })
    map.graphicLayer.addGraphic(pointEntity)
  } else {
    pointEntity.position = position
  }

  if (hasCenter) {
    pointEntity.flyTo({ radius: 1000 })
  }
}
