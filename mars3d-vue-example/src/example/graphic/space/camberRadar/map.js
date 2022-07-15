import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.784488, lng: 117.16699, alt: 9030, heading: 1, pitch: -57 },
    cameraController: {
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    }
  },
  control: {
    sceneModePicker: false
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

  // 加个模型
  const graphic = new mars3d.graphic.ModelEntity({
    name: "地面站模型",
    position: [117.170264, 31.840312, 258],
    style: {
      url: "//data.mars3d.cn/gltf/mars/leida.glb",
      scale: 1,
      minimumPixelSize: 40,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(graphic)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function addDemoGraphic1(radarParsms) {


  const camberRadar = new mars3d.graphic.CamberRadar({
    position: [117.170264, 31.840312, 363],
    style: {
      color: "#ff0000",
      opacity: 0.5,
      outline: true,
      outlineColor: "#ffffff",
      segmentH: 50,
      radius: radarParsms.outerRadius,
      startRadius: radarParsms.innerRadius,
      heading: radarParsms.headingValue,
      pitch: radarParsms.pitchValue,
      roll: radarParsms.rollValue,
      startFovH: Cesium.Math.toRadians(radarParsms.startFovH),
      endFovH: Cesium.Math.toRadians(radarParsms.endFovH),
      startFovV: Cesium.Math.toRadians(radarParsms.startFovV),
      endFovV: Cesium.Math.toRadians(radarParsms.endFovV),
      flat: true
    }
  })
  graphicLayer.addGraphic(camberRadar)
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

    const graphic = new mars3d.graphic.CamberRadar({
      position: position,
      style: {
        color: "#ff0000",
        opacity: 0.5,
        outline: true,
        outlineColor: "#ffffff",
        segmentH: 50,
        radius: result.radius,
        startRadius: result.radius * 0.3,
        startFovH: Cesium.Math.toRadians(180),
        endFovH: Cesium.Math.toRadians(-180),
        startFovV: Cesium.Math.toRadians(0),
        endFovV: Cesium.Math.toRadians(90)
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
    type: "camberRadar",
    style: {
      color: "#ff0000",
      opacity: 0.5,
      outline: true,
      outlineColor: "#ffffff",
      segmentH: 50,
      radius: 2000,
      startRadius: 800,
      startFovH: Cesium.Math.toRadians(180),
      endFovH: Cesium.Math.toRadians(-180),
      startFovV: Cesium.Math.toRadians(0),
      endFovV: Cesium.Math.toRadians(90)
    }
  })
}

// 取图层的最后一条数据，用于测试参数调整
function getLastGraphic() {
  const arr = graphicLayer.getGraphics()
  if (arr.length === 0) {
    return null
  } else {
    return arr[arr.length - 1]
  }
}

export function headingChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.heading = value
  }
}

export function pitchChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.pitch = value
  }
}

export function rollChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.roll = value
  }
}

export function outerRadiusChange(val) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.radius = val
  }
}

export function innerRadiusChange(val) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.startRadius = val
  }
}

export function startFovHChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.startFovH = Cesium.Math.toRadians(value)
  }
}

export function endFovHChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.endFovH = Cesium.Math.toRadians(value)
  }
}

export function startFovVChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.startFovV = Cesium.Math.toRadians(value)
  }
}

export function endFovVChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.endFovV = Cesium.Math.toRadians(value)
  }
}

export function updateColor(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.color = value
  }
}
