import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let linePositions
let graphicPath

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 20.803452, lng: 116.629014, alt: 1734203, heading: 3, pitch: -57 }
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

  addDemoGraphics()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphics() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 半球
  const graphicQiu = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(117.276726, 31.864175, -10000.0),
    style: {
      radii: new Cesium.Cartesian3(200000.0, 200000.0, 200000.0),
      maximumConeDegree: 90,
      materialType: mars3d.MaterialType.EllipsoidWave,
      materialOptions: {
        color: "#ff0000",
        speed: 5.0
      },
      outline: false
    }
  })
  graphicLayer.addGraphic(graphicQiu)

  // 计算圆圈线
  linePositions = mars3d.PolyUtil.getEllipseOuterPositions({
    position: Cesium.Cartesian3.fromDegrees(117.276726, 31.864175),
    radius: 500000,
    count: 60 // 共返回count*4个点
  })
  linePositions = mars3d.PointUtil.setPositionsHeight(linePositions, 20000)
  linePositions.push(linePositions[0]) // 闭合圆

  // 圆圈线
  // const graphicLine = new mars3d.graphic.PolylineEntity({
  //   positions: linePositions,
  //   style: {
  //     width: 8,
  //     materialType: mars3d.MaterialType.PolylineGlow,
  //     materialOptions: {
  //       glowPower: 0.2,
  //       color: Cesium.Color.GREEN
  //     }
  //   }
  // })
  // graphicLayer.addGraphic(graphicLine)

  // 飞机path路径
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const start = map.clock.currentTime
  let alltimes = 0
  for (let i = 0, len = linePositions.length; i < len; i++) {
    alltimes += 1
    const time = Cesium.JulianDate.addSeconds(start, alltimes, new Cesium.JulianDate())
    property.addSample(time, linePositions[i])
  }
  const stop = Cesium.JulianDate.addSeconds(start, alltimes, new Cesium.JulianDate())

  // This is where it becomes a smooth path.
  property.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  })

  graphicPath = new mars3d.graphic.PathEntity({
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      width: 2,
      color: "#ffff00",
      opacity: 0.9
    },
    label: {
      text: "火星1号",
      font_size: 19,
      font_family: "楷体",
      color: Cesium.Color.AZURE,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(10, -25) // 偏移量
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.1,
      minimumPixelSize: 90
    }
  })
  graphicLayer.addGraphic(graphicPath)

  // Make sure viewer is at the desired time.
  map.clock.startTime = start.clone()
  map.clock.stopTime = stop.clone()
  map.clock.currentTime = start.clone()
  map.clock.clockRange = Cesium.ClockRange.LOOP_STOP // 到达终止时间后循环
  map.clock.multiplier = 1
  map.clock.shouldAnimate = true
}

// 顶视图
export function viewSeeTop() {
  map.trackedEntity = undefined

  map.flyToPositions(linePositions, { pitch: -90 })
}
// 侧视图
export function viewSeeCe() {
  map.trackedEntity = graphicPath

  graphicPath.flyToPoint({
    radius: 5000,
    heading: 0,
    duration: 0
  })
}
// 主视图
export function viewSeeHome() {
  map.trackedEntity = graphicPath

  graphicPath.flyToPoint({
    radius: 5000,
    heading: 90,
    duration: 0
  })
}
