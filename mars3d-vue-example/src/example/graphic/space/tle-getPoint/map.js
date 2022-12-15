import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    // 此处参数会覆盖config.json中的对应配置
    center: { lat: 6.148021, lng: 58.982029, alt: 42278441, heading: 220, pitch: -85 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1000,
      maximumZoomDistance: 300000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
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
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addSatellite()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addSatellite() {
  graphicLayer.bindPopup(function (event) {
    const points = event.graphic.attr?.points
    if (!points) {
      return
    }
    // 单击轨迹连线上的点后，求该点对应的时间
    const positionDM = event.cartesian
    const val1 = points[0]
    const val2 = points[points.length - 1]

    const startTime = Cesium.JulianDate.toDate(val1.time)
    const endTime = Cesium.JulianDate.toDate(val2.time)

    const len1 = Math.abs(Cesium.Cartesian3.distance(positionDM, val1.position))
    const len2 = Math.abs(Cesium.Cartesian3.distance(positionDM, val2.position))

    const adds = (len1 / (len1 + len2)) * (endTime.getTime() - startTime.getTime()) // 求按距离比例的时间增加值
    const currentTime = new Date(startTime.getTime() + adds)

    const inthtml = "单击处时间：" + mars3d.Util.formatDate(currentTime, "yyyy-MM-dd HH:mm:ss")
    return inthtml
  })

  const weixin = new mars3d.graphic.Satellite({
    name: "GAOFEN 1",
    tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
    tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90,
      autoHeading: true,
      show: true
    },
    label: {
      color: "#ffffff",
      opacity: 1,
      font_family: "楷体",
      font_size: 30,
      outline: true,
      outlineColor: "#000000",
      outlineWidth: 3,
      background: true,
      backgroundColor: "#000000",
      backgroundOpacity: 0.5,
      font_weight: "normal",
      font_style: "normal",
      pixelOffsetX: 0,
      pixelOffsetY: -20,
      scaleByDistance: true,
      scaleByDistance_far: 10000000,
      scaleByDistance_farValue: 0.4,
      scaleByDistance_near: 100000,
      scaleByDistance_nearValue: 1,
      show: true
    },
    cone: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 10,
      angle2: 5,
      color: "#6ef500",
      show: true
    },
    path: {
      show: true,
      color: "#00ff00",
      opacity: 0.5,
      width: 1
    }
  })
  map.graphicLayer.addGraphic(weixin)

  setTimeout(() => {
    weixin.flyTo({
      radius: 900000, // 距离目标点的距离
      pitch: -60 // 相机方向
    })
  }, 1000)

  const now = Cesium.JulianDate.toDate(map.clock.currentTime)
  const startTime = mars3d.Util.formatDate(now, "yyyy-MM-dd HH:mm:ss")

  now.setMinutes(now.getMinutes() + 60)
  const endTime = mars3d.Util.formatDate(now, "yyyy-MM-dd HH:mm:ss")

  eventTarget.fire("loadStatellite", { startTime, endTime })
}

export function btnAdd(data) {
  const weixin = map.graphicLayer.getGraphicByAttr("GAOFEN 1", "name")
  const startTime = data.startTime
  const endTime = data.endTime
  const areaColor = data.areaColor
  const slideOpacity = data.slideOpacity
  const slideAngle = data.slideAngle

  addTimeShading(weixin, {
    startTime: startTime,
    endTime: endTime,
    color: areaColor,
    opacity: slideOpacity,
    angle: slideAngle
  })
}
export function btnRemoveAll() {
  graphicLayer.clear()
}

export function changeColorOpacity(data) {
  graphicLayer.eachGraphic(function (graphic) {
    graphic.setColorStyle({ color: data.areaColor, opacity: data.slideOpacity })
  })
}

export function changeAngle(val) {
  const weixin = map.graphicLayer.getGraphicByAttr("GAOFEN 1", "name")
  if (val) {
    weixin.angle1 = val
  }
}

export function changeGuidaoS(valS) {
  updateVisibleForFaceNouth(true, valS)
}

export function changeGuidaoJ(valJ) {
  updateVisibleForFaceNouth(false, valJ)
}

// options参数包含：startTime开始时间，endTime结束时间，angle张开角度，color颜色，opacity透明度
function addTimeShading(weixin, options) {
  graphicLayer.clear()

  const bt = new Date(options.startTime).getTime()
  const et = new Date(options.endTime).getTime()
  if (bt >= et) {
    globalMsg("开始时间需要小于结束时间。")
    return
  }

  const step = 2 * 60000

  const points = []
  const positions = []

  let temp_t = bt
  while (temp_t <= et) {
    const point = weixin.tle.getPoint(temp_t)
    if (!point) {
      break
    }

    const ground_pos = Cesium.Cartesian3.fromDegrees(point.lng, point.lat)
    positions.push(ground_pos)

    const time = Cesium.JulianDate.fromDate(new Date(temp_t))
    points.push({
      position: ground_pos,
      time: time,
      height: point.alt
    })

    temp_t += step
  }

  if (positions.length < 2) {
    globalMsg("没有该时间段内的轨迹数据。")
    return
  }

  let clr = Cesium.Color.fromCssColorString(options.color || "#ff0000").withAlpha(Number(options.opacity || 1.0))
  clr = Cesium.ColorGeometryInstanceAttribute.fromColor(clr)

  const geometryInstancesSG = [] // 升轨
  const geometryInstancesJG = [] // 降轨
  for (let i = 1; i < positions.length; i++) {
    const position1 = positions[i - 1]
    const position2 = positions[i]

    const height = points[i].height // 也可以取position2的高度
    const shadingWidth = height * Math.tan(Cesium.Math.toRadians(options.angle)) * 2 // 根据卫星角度求其带宽度

    const instance = new Cesium.GeometryInstance({
      geometry: new Cesium.CorridorGeometry({
        vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
        positions: [position1, position2],
        width: shadingWidth,
        cornerType: Cesium.CornerType.MITERED // 指定转角处样式
      }),
      attributes: {
        color: clr
      }
    })
    // 重要：绑定相关属性
    instance.attr = {
      points: [points[i - 1], points[i]]
    }

    const hp = mars3d.PointUtil.getHeadingPitchRollForLine(position1, position2)

    if (hp.heading > 0) {
      geometryInstancesSG.push(instance)
    } else {
      geometryInstancesJG.push(instance)
    }
  }

  // 升轨
  if (geometryInstancesSG.length > 0) {
    const primitiveSG = new mars3d.graphic.BaseCombine({
      instances: geometryInstancesSG
    })
    primitiveSG.isFaceNouth = true
    graphicLayer.addGraphic(primitiveSG)
  }

  // 降轨
  if (geometryInstancesJG.length > 0) {
    const primitiveJG = new mars3d.graphic.BaseCombine({
      instances: geometryInstancesJG
    })
    primitiveJG.isFaceNouth = false
    graphicLayer.addGraphic(primitiveJG)
  }
}

// 升降轨类型筛选
function updateVisibleForFaceNouth(isFaceNouth, show) {
  graphicLayer.eachGraphic(function (graphic) {
    if (isFaceNouth && graphic.isFaceNouth) {
      graphic.show = show
    }
    if (!isFaceNouth && !graphic.isFaceNouth) {
      graphic.show = show
    }
  })
}
