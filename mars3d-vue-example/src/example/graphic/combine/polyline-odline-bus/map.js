import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 39.564004, lng: 116.394499, alt: 55751, heading: 0, pitch: -56 }
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

  map.basemap = "黑色底图"

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  // 在layer上绑定Popup弹窗
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
  })

  Cesium.Resource.fetchJson("//data.mars3d.cn/file/apidemo/bjgj.json").then(function (data) {
    const busLines = []
    data.forEach(function (busLine, idx) {
      let prevPt
      const points = []
      for (let i = 0; i < busLine.length; i += 2) {
        let pt = [busLine[i], busLine[i + 1]]
        if (i > 0) {
          pt = [prevPt[0] + pt[0], prevPt[1] + pt[1]]
        }
        prevPt = pt

        const longitude = pt[0] / 1e4
        const latitude = pt[1] / 1e4
        const cart = Cesium.Cartesian3.fromDegrees(longitude, latitude, 100.0)
        points.push(cart)
      }

      busLines.push({
        positions: points,
        color: new Cesium.Color(Math.random() * 0.5 + 0.5, Math.random() * 0.8 + 0.2, 0.0, 1.0),
        speed: 2 + 1.0 * Math.random()
      })
    })
    createLines(busLines)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function createLines(arr) {
  const arrData = []
  arr.forEach(function (item, index) {
    arrData.push({
      positions: item.positions,
      style: {
        width: 2.0,
        materialType: mars3d.MaterialType.ODLine,
        materialOptions: {
          color: item.color,
          speed: item.speed,
          startTime: Math.random()
        }
      },
      attr: { index: index }
    })
  })

  // 多个线对象的合并渲染。
  const graphic = new mars3d.graphic.PolylineCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(graphic)
}
