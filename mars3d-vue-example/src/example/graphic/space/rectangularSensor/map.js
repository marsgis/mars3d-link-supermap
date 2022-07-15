import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 30.834006, lng: 118.779512, alt: 306743, heading: 313, pitch: -58 },
    cameraController: {
      constrainedAxis: false
    }
  },
  control: {
    sceneModePicker: false
  }
}

export const eventTarget = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  globalNotify("已知问题提示", `该矢量对象不支持拾取`)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 添加演示数据
  addDemoGraphic1()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function addDemoGraphic1() {
  const rectangularSensor = new mars3d.graphic.RectangularSensor({
    position: [117.218875, 31.817812, 138],
    style: {
      heading: 30,
      pitch: 0,
      roll: 0,

      radius: 100000, // 传感器的半径
      xHalfAngleDegree: 50, // 传感器水平半角
      yHalfAngleDegree: 50, // 传感器垂直半角

      color: "#00ffff",
      opacity: 0.4,
      lineColor: "#ffffff", // 线的颜色

      showScanPlane: true, // 是否显示扫描面
      scanPlaneColor: "#00ffff",
      scanPlaneOpacity: 0.9,
      scanPlaneMode: "vertical", // 扫描面模式 垂直vertical/水平horizontal
      scanPlaneRate: 3, // 扫描速率,
      depthTest: true
    }
  })

  graphicLayer.addGraphic(rectangularSensor)
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

    const graphic = new mars3d.graphic.RectangularSensor({
      position: position,
      style: {
        radius: result.radius, // 传感器的半径
        xHalfAngleDegree: 50, // 传感器水平半角
        yHalfAngleDegree: 50, // 传感器垂直半角
        color: "#00ffff",
        opacity: 0.4,
        lineColor: "#ffffff", // 线的颜色
        showScanPlane: false, // 是否显示扫描面
        depthTest: true
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制 相阵控雷达
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "rectangularSensor",
    style: {
      heading: 0,
      pitch: 0,
      roll: 0,

      radius: 10000, // 传感器的半径
      xHalfAngleDegree: 50, // 传感器水平半角
      yHalfAngleDegree: 50, // 传感器垂直半角

      color: "#00ffff",
      opacity: 0.4,
      lineColor: "#ffffff", // 线的颜色

      showScanPlane: true, // 是否显示扫描面
      scanPlaneColor: "#00ffff",
      scanPlaneOpacity: 0.9,
      scanPlaneMode: "vertical", // 扫描面模式 垂直vertical/水平horizontal
      scanPlaneRate: 3, // 扫描速率,
      depthTest: true
    }
  })
}
