import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let queryMapserver
let geoJsonLayer
let drawGraphic

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.79536, lng: 117.255222, alt: 16294, heading: 358, pitch: -76 }
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
  showGeoJsonLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function query(text) {
  queryMapserver.query({
    column: "项目名称",
    text: text,
    graphic: drawGraphic,
    success: (result) => {
      if (result.count === 0) {
        globalMsg("未查询到相关记录！")
        geoJsonLayer.load({ data: { features: null } })
        return
      } else {
        globalMsg("共查询到 " + result.count + " 条记录！")
      }
      geoJsonLayer.load({ data: result.geojson })
    },
    error: (error, msg) => {
      console.log("服务访问错误", error)
      globalAlert(msg, "服务访问错误")
    }
  })
}

function showGeoJsonLayer() {
  queryMapserver = new mars3d.query.QueryGeoServer({
    url: "//server.mars3d.cn/geoserver/mars/wfs",
    layer: "mars:hfjy"
  })

  // 用于显示查询结果（geojson）的图层
  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    symbol: {
      styleOptions: {
        image: "img/marker/mark-blue.png",
        scale: 1,
        scaleByDistance: true,
        scaleByDistance_far: 20000,
        scaleByDistance_farValue: 0.5,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        highlight: { type: "click", image: "img/marker/mark-red.png" },
        clampToGround: true,
        label: {
          text: "{项目名称}",
          font_size: 25,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -25,
          scaleByDistance: true,
          scaleByDistance_far: 80000,
          scaleByDistance_farValue: 0.5,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 80000,
          distanceDisplayCondition_near: 0
        }
      }
    },
    popup: "all"
  })
  map.addLayer(geoJsonLayer)

  geoJsonLayer.on(mars3d.EventType.load, function (event) {
    const list = event.list
    eventTarget.fire("befortUI", { list })
  })
}

// 框选查询 矩形
export function drawRectangle() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic

      console.log("矩形：", drawGraphic.toGeoJSON({ outline: true }))
    }
  })
}

// 框选查询   圆
export function drawCircle() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
      console.log("圆：", drawGraphic.toGeoJSON({ outline: true }))
    }
  })
}

// 框选查询   多边行
export function drawPolygon() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
      console.log("多边行：", drawGraphic.toGeoJSON())
    }
  })
}

export function clearAll(noClearDraw) {
  if (!noClearDraw) {
    drawGraphic = null
    map.graphicLayer.clear()
  }
  geoJsonLayer.clear()
}

export function flyToGraphic(graphic) {
  graphic.openHighlight()
  graphic.flyTo({
    radius: 1000, // 点数据：radius控制视距距离
    scale: 1.5, // 线面数据：scale控制边界的放大比例
    complete: () => {
      graphic.openPopup()
    }
  })
}
