import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let queryMapserver
let graphicLayer
let drawGraphic

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 26.870137, lng: 113.091046, alt: 2629327.7, heading: 358.1, pitch: -81.2 }
  }
}
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  queryMapserver = new mars3d.query.QueryIServer({
    url: "https://iserver.supermap.io/iserver/services/map-china/rest/maps/China",
    layerName: "Province_R@China",
    crs: "EPSG:3857",
    toGeoJSON: function (features) {
      if (features) {
        // eslint-disable-next-line no-undef
        return iserverGeojson.toGeoJSON(features) // 引入 public\lib\geojson\iserver-geojson.js
      }
    }
  })

  // 用于显示查询结果（geojson）的图层
  graphicLayer = new mars3d.layer.GraphicLayer({
    symbol: {
      styleOptions: {
        randomColor: true,
        opacity: 0.5,
        outline: true,
        outlineStyle: {
          color: "#ffffff",
          width: 2
        }
      }
    },
    popup: "all"
  })
  map.addLayer(graphicLayer)

  globalNotify("提示", "框选范围之后，可以直接点击查询，也可以输入省份名进行查询")
  graphicLayer.on(mars3d.EventType.load, function (event) {
    const list = event.list
    eventTarget.fire("befortUI", { list })
  })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

export async function query(text) {
  if (!drawGraphic) {
    globalMsg("请绘制一个查询范围")
    return
  }
  globalMsg("正在查询中...")
  const result = await queryMapserver.query({
    queryParams: {
      attributeFilter: `NAME like '%${text}%'`
    },
    graphic: drawGraphic
  })
  console.log("查询结果：", result)

  if (result.count === 0) {
    globalMsg("未查询到相关记录！")
    return
  }
  graphicLayer.loadGeoJSON(result.geojson, { crs: queryMapserver.options.crs })
}

// 框选查询 矩形
export async function drawRectangle() {
  clearAll()
  drawGraphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    }
  })
  console.log("矩形：", drawGraphic.toGeoJSON({ outline: true }))
}

// 框选查询   圆
export async function drawCircle() {
  clearAll()
  drawGraphic = await map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    }
  })
  console.log("圆：", drawGraphic.toGeoJSON({ outline: true }))
}

// 框选查询   多边行
export async function drawPolygon() {
  clearAll()
  drawGraphic = await map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    }
  })
  console.log("多边行：", drawGraphic.toGeoJSON())
}

export function clearAll(noClearDraw) {
  if (!noClearDraw) {
    drawGraphic = null
    map.graphicLayer.clear()
  }
  graphicLayer.clear()
}

export function flyToGraphic(graphicId) {
  const graphic = graphicLayer.getGraphicById(graphicId)
  if (!graphic) {
    return
  }
  graphic.openHighlight()
  graphic.flyTo({
    radius: 1000, // 点数据：radius控制视距距离
    scale: 1.5, // 线面数据：scale控制边界的放大比例
    complete: () => {
      graphic.openPopup()
    }
  })
}
