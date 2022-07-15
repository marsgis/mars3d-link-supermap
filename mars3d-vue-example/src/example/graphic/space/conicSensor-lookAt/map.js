import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: -7.606383, lng: 119.069383, alt: 10521145, heading: 0, pitch: -82 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1000,
      maximumZoomDistance: 300000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    },
    clock: {
      multiplier: 5 // 速度
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件,
    compass: { top: "10px", left: "5px" }
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
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式

  globalMsg("非实际卫星轨道，随机模拟的坐标，只是为了演示追踪！")

  addGraphicLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addGraphicLayer() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // ===========================================================
  // 取数据
  const property = getDynamicProperty(function (timeInterval) {
    graphic.entity.availability = new Cesium.TimeIntervalCollection([new Cesium.TimeInterval(timeInterval)])
  })

  const times = property._property._times
  const startTime = times[0].clone()
  const stopTime = times[times.length - 1].clone()

  const graphic = new mars3d.graphic.PathEntity({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: startTime,
        stop: stopTime
      })
    ]),
    position: property, // 点集
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      leadTime: 0,
      trailTime: 2800,
      resolution: 1,
      materialType: mars3d.MaterialType.PolylineGlow,
      materialOptions: {
        glowPower: 0.1,
        color: Cesium.Color.YELLOW
      },
      width: 10
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 150
    }
  })
  graphicLayer.addGraphic(graphic)

  // ===========================================================

  // 视锥体 展示
  const satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: property,
    autoHeading: true, // 是否自动角度，根据监听的卫星模型
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 20,
      angle2: 10,
      heading: 0,
      pitch: 0,
      roll: 0,
      color: "rgba(110,245,0,0.5)"
    }
  })
  graphicLayer.addGraphic(satelliteSensor)

  satelliteSensor.trackedEntity = graphic // 本身跟随卫星

  // 地面站 展示
  const localStart = Cesium.Cartesian3.fromDegrees(109.51856, 18.258736, 2)
  const conicSensor = new mars3d.graphic.ConicSensor({
    position: localStart,
    style: {
      angle: 5, // 雷达最小扫描仰角
      length: 2500000,
      color: Cesium.Color.fromBytes(255, 0, 0, 85)
    }
  })
  graphicLayer.addGraphic(conicSensor)

  conicSensor.lookAt = property // 追踪卫星

  // 测试连接线
  const testLine = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const localEnd = conicSensor.rayPosition
      if (!localEnd) {
        return []
      }
      return [localStart, localEnd]
    }, false),
    style: {
      arcType: Cesium.ArcType.NONE,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: "#ff0000"
      },
      width: 1
    }
  })
  graphicLayer.addGraphic(testLine)
}

// 构造模拟数据，实际项目应改为服务读取返回
function getDynamicProperty(callback) {
  const arr = dataWork.getTestData(Cesium.JulianDate.toIso8601(map.clock.currentTime), 2 * 60)

  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    const thisTime = Cesium.JulianDate.fromIso8601(item.time)
    const position = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)

    // 添加每一个链接点的信息，到达的时间以及坐标位置
    property.addSample(thisTime, position)
  }

  const times = property._property._times
  const startTime = times[0].clone()
  let stopTime = times[times.length - 1].clone()

  const allTimes = Cesium.JulianDate.secondsDifference(stopTime, map.clock.currentTime) * 0.3 // 判断剩下多少时长时加载下一步数据
  let loading = false
  map.on(mars3d.EventType.clockTick, function (clock) {
    const sxTimes = Cesium.JulianDate.secondsDifference(stopTime, map.clock.currentTime) // 剩下时长

    if (!loading && sxTimes < allTimes) {
      loading = true
      const arr = dataWork.getTestData(Cesium.JulianDate.toIso8601(stopTime), 2 * 60)

      for (let i = 1; i < arr.length; i++) {
        const item = arr[i]

        const thisTime = Cesium.JulianDate.fromIso8601(item.time)
        const position = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)

        // 添加每一个链接点的信息，到达的时间以及坐标位置
        property.addSample(thisTime, position)
      }

      const times = property._property._times
      stopTime = times[times.length - 1].clone()

      loading = false
      if (callback) {
        const result = { start: startTime, stop: stopTime }
        callback(result)
      }
    }
  })

  return property
}

// 模拟数据生产类
const dataWork = {
  thisPoint: {
    x: 100.245989,
    y: 0,
    z: 1000000
  },
  // data开始时间，seconds 秒数
  getTestData: function (date, seconds) {
    const startTime = Cesium.JulianDate.fromIso8601(date) // 飞行开始时间

    const arr = []

    let thisTime
    for (let i = 0; i <= seconds; i += 5) {
      thisTime = Cesium.JulianDate.addSeconds(startTime, i, new Cesium.JulianDate())

      // 生成随机的坐标
      this.thisPoint.x += i * 0.01
      this.thisPoint.y += i * 0.01

      arr.push({
        time: Cesium.JulianDate.toIso8601(thisTime),
        x: this.thisPoint.x,
        y: this.thisPoint.y,
        z: this.thisPoint.z
      })
    }
    return arr
  }
}
