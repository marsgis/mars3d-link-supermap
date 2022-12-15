import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.scene.center = { lat: 31.265081, lng: 116.103599, alt: 6178, heading: 348, pitch: -54 }
  delete option.terrain
  return option
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

  // 飞行区域边界线
  const graphic = new mars3d.graphic.PolygonEntity({
    positions: [
      [116.069898, 31.303655],
      [116.098708, 31.322126],
      [116.108063, 31.311256],
      [116.079317, 31.292959],
      [116.069898, 31.303655]
    ],
    style: {
      color: "#ffff00",
      outline: true,
      outlineWidth: 3,
      outlineColor: "#00ff00"
    }
  })
  graphicLayer.addGraphic(graphic)

  graphic.startFlicker({
    time: 3, // 闪烁时长（秒）
    onEnd: function () {
      // 结束后自动移除
      graphic.style = { fill: false }
      startRoam()
    }
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

const arrColor = [new Cesium.Color(1.0, 0.0, 0.0, 0.3), new Cesium.Color(0.0, 1.0, 0, 0.3), new Cesium.Color(0.0, 0.0, 1, 0.3)]

function startRoam() {
  // 视角切换（分步执行）
  map.setCameraViewList([
    {
      lat: 31.261244,
      lng: 116.087805,
      alt: 4571.19,
      heading: 2.3,
      pitch: -45.4,
      roll: 357.6,
      stop: 4
    },
    {
      lat: 31.299649,
      lng: 116.129938,
      alt: 2725.83,
      heading: 290.2,
      pitch: -34,
      roll: 358.1,
      stop: 4
    },
    {
      lat: 31.288891,
      lng: 116.106146,
      alt: 4268.26,
      heading: 325.4,
      pitch: -55.7,
      roll: 357.5
    }
  ])

  // 飞行路线
  const fixedRoute = new mars3d.graphic.FixedRoute({
    name: "无人机航拍",
    speed: 600,
    positions: [
      [116.077374, 31.294215, 1000],
      [116.107153, 31.312963, 1000],
      [116.103816, 31.316868, 1000],
      [116.074092, 31.297972, 1000],
      [116.07068, 31.301908, 1000],
      [116.100465, 31.320893, 1000]
    ],
    autoStop: true,
    model: {
      url: "//data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 0.02,
      minimumPixelSize: 50
    },
    path: {
      color: "#ffff00",
      width: 3,
      leadTime: 0
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  fixedRoute.start()

  let frameNum = -1
  let graphicFrustum

  fixedRoute.on(mars3d.EventType.change, function () {
    if (!map.clock.shouldAnimate) {
      return
    }

    // 当前的路线中的点位
    const currIndex = fixedRoute.currIndex
    if (currIndex % 2 === 0) {
      return
    }

    frameNum = ++frameNum % 100 // 调整间隔多少拍一次
    if (frameNum !== 0) {
      if (frameNum === 10 && graphicFrustum) {
        graphicLayer.removeGraphic(graphicFrustum)
        graphicFrustum = null
      }
      return
    }

    // 添加四棱锥体线
    graphicFrustum = new mars3d.graphic.FrustumPrimitive({
      position: fixedRoute.position,
      style: {
        angle: 15,
        angle2: 12,
        heading: fixedRoute.model.heading,
        length: Cesium.Cartographic.fromCartesian(fixedRoute.position).height,
        fill: false,
        outline: true,
        outlineColor: "#ffffff",
        outlineOpacity: 1.0
      },
      asynchronous: false,
      flat: true
    })
    graphicLayer.addGraphic(graphicFrustum)

    // 地面的4个顶点坐标
    const positions = graphicFrustum.getRayEarthPositions()

    // 添加地面矩形
    const graphic = new mars3d.graphic.PolygonPrimitive({
      positions: positions,
      style: {
        color: arrColor[graphicLayer.length % arrColor.length],
        zIndex: graphicLayer.length
      }
    })
    graphicLayer.addGraphic(graphic)
  })
}
