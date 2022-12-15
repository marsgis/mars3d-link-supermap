import * as mars3d from "mars3d"
import { CanvasBillboard } from "CanvasBillboard.js"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const mapOptions = {
  scene: {
    center: { lat: 31.81226, lng: 117.096703, alt: 231, heading: 329, pitch: -28 }
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

  // 加载油田联合站模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    pid: 2020,
    type: "3dtiles",
    name: "油田联合站",
    url: "//data.mars3d.cn/3dtiles/max-ytlhz/tileset.json",
    position: { lng: 117.094224, lat: 31.815859, alt: 26.4 },
    rotation: { z: 116.2 },
    maximumScreenSpaceError: 1,
    center: { lat: 32.407076, lng: 117.459703, alt: 3361, heading: 358, pitch: -51 }
  })
  map.addLayer(tiles3dLayer)

  // 创建DIV数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 随机更新文本
  setInterval(() => {
    graphicLayer.eachGraphic((graphic) => {
      graphic.text = random(0, 100) // 更新文本
    })
  }, 2000)

  addDemoGraphic1(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

function addDemoGraphic1(graphicLayer) {
  const arrData = [
    { name: "油罐一", position: [117.09521, 31.814404, 47.3] },
    { name: "油罐二", position: [117.095206, 31.814878, 47.3] },
    { name: "油罐三", position: [117.094653, 31.814428, 47.3] },
    { name: "发电机", position: [117.093428, 31.816959, 31.8] },
    { name: "指挥室", position: [117.093953, 31.814397, 36] },
    { name: "加热罐", position: [117.09385, 31.815837, 36.9] },
    { name: "冷却室", position: [117.094662, 31.816403, 32.9] }
  ]
  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const graphic = new mars3d.graphic.CanvasBillboard({
      position: item.position,
      style: {
        text: 18,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(800, 0.4, 1200, 0.2),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000)
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.CanvasBillboard({
      position: position,
      style: {
        text: 18,
        scale: 0.4,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 900000)
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "canvasBillboard",
    style: {
      text: 18,
      scale: 0.4,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 900000)
    }
  })
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
