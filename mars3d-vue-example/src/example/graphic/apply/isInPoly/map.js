import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.772337, lng: 117.213784, alt: 12450, heading: 0, pitch: -66 }
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

  const extent = map.getExtent()
  mars3d.Util.fetchJson({
    url: "//server.mars3d.cn/server/pointRandom/",
    queryParameters: {
      xmin: extent.xmin,
      ymin: extent.ymin,
      xmax: extent.xmax,
      ymax: extent.ymax,
      count: 100
    }
  })
    .then(function (data) {
      addData(data)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let selectGraphic = []
function addData(arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    const graphic = new mars3d.graphic.BillboardEntity({
      position: Cesium.Cartesian3.fromDegrees(item.x, item.y, 0),
      style: {
        image: "img/marker/mark-blue.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1)
      },
      attr: item
    })
    graphicLayer.addGraphic(graphic)

    graphic.bindTooltip(item.name)
  }
}

// 在范围内的改变图标为红色
function updateSelect(drawGraphic) {
  graphicLayer.eachGraphic((graphic) => {
    const position = graphic.positionShow

    const isInArea = drawGraphic.isInPoly(position)
    if (isInArea) {
      graphic.setStyle({
        image: "img/marker/mark-red.png"
      })
      selectGraphic.push(graphic)
    }
  })
}

export function removeAll() {
  map.graphicLayer.clear()

  for (let i = 0; i < selectGraphic.length; i++) {
    const graphic = selectGraphic[i]
    graphic.setStyle({
      image: "img/marker/mark-blue.png"
    })
  }
  selectGraphic = []
}

export function drawPolygon() {
  removeAll()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    },
    success: function (graphic) {
      updateSelect(graphic)
    }
  })
}

export function drawCircle() {
  removeAll()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    },
    success: function (graphic) {
      updateSelect(graphic)
    }
  })
}

export function drawRectangle() {
  removeAll()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    },
    success: function (graphic) {
      updateSelect(graphic)
    }
  })
}
