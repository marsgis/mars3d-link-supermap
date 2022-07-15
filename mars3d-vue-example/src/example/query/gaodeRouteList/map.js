import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let routeLayer
let gaodeRoute

// 当前页面业务相关
let startGraphic
let endPointArr
let poiLayer
let queryGaodePOI

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.812769, lng: 117.250545, alt: 18500, heading: 358, pitch: -81 }
  }
}

// 自定义事件
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  routeLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(routeLayer)

  gaodeRoute = new mars3d.query.GaodeRoute({})

  queryGaodePOI = new mars3d.query.GaodePOI({})

  // 创建矢量数据图层
  poiLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(poiLayer)

  poiLayer.bindPopup(function (event) {
    const item = event.graphic.attr

    let inHtml = '<div class="mars3d-template-titile">' + item.name + '</div><div class="mars3d-template-content" >'

    const type = String(item.type).trim()
    if (type) {
      inHtml += "<div><label>类别</label>" + type + "</div>"
    }

    const xzqh = String(item.xzqh).trim()
    if (xzqh) {
      inHtml += "<div><label>区域</label>" + xzqh + "</div>"
    }

    const tel = String(item.tel).trim()
    if (tel) {
      inHtml += "<div><label>电话</label>" + tel + "</div>"
    }

    if (item.address) {
      const address = item.address.trim()
      inHtml += "<div><label>地址</label>" + address + "</div>"
    }
    inHtml += "</div>"
    return inHtml
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 起点
export function startPoint() {
  if (startGraphic) {
    startGraphic.remove()
    startGraphic = null
  }
  routeLayer.clear()

  return map.graphicLayer
    .startDraw({
      type: "billboard",
      style: {
        image: "img/marker/route-start.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    })
    .then((graphic) => {
      startGraphic = graphic
      const point = graphic.point
      point.format()

      return point.lng + "," + point.lat
    })
}

// 终点
export function endPoint() {
  showLoading()
  routeLayer.clear()
  poiLayer.clear()
  endPointArr = null

  const extent = map.getExtent() // 当前视域内

  queryGaodePOI.queryPolygon({
    text: "企业",
    polygon: [
      [extent.xmin, extent.ymin],
      [extent.xmin, extent.ymax],
      [extent.xmax, extent.ymax],
      [extent.xmax, extent.ymin]
    ],
    page: 0,
    count: 10,
    success: function (res) {
      hideLoading()

      const count = res.count
      eventTarget.fire("end", { count })

      addEndPointEntity(res.list)
    },
    error: function (msg) {
      globalMsg(msg)
      hideLoading()
    }
  })
}

// 开始分析
export function btnAnalyse(type, count) {
  if (!startGraphic || !endPointArr || endPointArr.length === 0) {
    globalMsg("请设置起点和查询目的地")
    return
  }
  showLoading()

  queryRoute(type)
}

function queryRoute(type) {
  const startPoint = startGraphic.coordinate
  const points = []

  endPointArr.forEach((item) => {
    points.push([startPoint, [item.x, item.y]])
  })

  gaodeRoute.queryArr({
    type: Number(type), // GaodeRouteType枚举类型
    points: points,
    success: function (data) {
      hideLoading()

      showRouteResult(data)
    },
    error: function (msg) {
      hideLoading()
      globalAlert(msg)
    }
  })
}

function showRouteResult(data) {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (!item) {
      continue
    }

    const lnglats = item.points
    if (!lnglats || lnglats.length < 1) {
      continue
    }

    const name = endPointArr[i].name

    const time = mars3d.Util.formatTime(item.allDuration)
    const distance = mars3d.MeasureUtil.formatDistance(item.allDistance)
    const html = "目的地：" + name + "<br/>总距离：" + distance + "<br/>所需时间：" + time + ""

    const graphic = new mars3d.graphic.PolylineEntity({
      positions: lnglats,
      style: {
        clampToGround: true,
        material: Cesium.Color.fromRandom({
          alpha: 0.7
        }),
        width: 4
      },
      popup: html
    })
    routeLayer.addGraphic(graphic)

    graphic.entityGraphic.material_old = graphic.entityGraphic.material
    graphic.entityGraphic.width_old = graphic.entityGraphic.width

    const id = graphic.id
    eventTarget.fire("analyse", { i, name, distance, time, id })
  }
}

// 终点的POI查询
function addEndPointEntity(arr) {
  console.log("查询数据结果", arr)

  endPointArr = arr

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    const graphic = new mars3d.graphic.BillboardEntity({
      position: Cesium.Cartesian3.fromDegrees(item.x, item.y),
      style: {
        image: "img/marker/route-end.png",
        scale: 1,
        clampToGround: true, // 贴地
        label: {
          text: item.name,
          font: "20px 楷体",
          color: Cesium.Color.AZURE,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -30), // 偏移量
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000),
          clampToGround: true // 贴地
        }
      },
      attr: item
    })
    poiLayer.addGraphic(graphic)
  }
}

let lastRoute
export function centerAtRoute(id) {
  const graphic = routeLayer.getGraphicById(id)

  if (lastRoute) {
    lastRoute.entityGraphic.material = lastRoute.entityGraphic.material_old
    lastRoute.entityGraphic.width = lastRoute.entityGraphic.width_old
  }

  // 动画线材质
  graphic.entityGraphic.width = 5
  graphic.entityGraphic.material = mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
    color: Cesium.Color.CHARTREUSE,
    image: "img/textures/line-color-yellow.png",
    speed: 20
  })

  map.flyToGraphic(graphic)

  lastRoute = graphic
}

// 清除按钮
export function removeAll() {
  if (startGraphic) {
    startGraphic.remove()
    startGraphic = null
  }
  routeLayer.clear()
  poiLayer.clear()
  endPointArr = null
}
