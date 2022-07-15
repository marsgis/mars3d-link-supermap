import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let weixin
let graphicLayer
let graphicTriangle

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    // 此处参数会覆盖config.json中的对应配置
    center: { lat: 5.459746, lng: 68.238291, alt: 36261079, heading: 143, pitch: -89 },
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
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了卫星", event)
  })
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "卫星图层", template: "all", attr: attr })
  })

  weixin = new mars3d.graphic.Satellite({
    name: "GAOFEN 1",
    tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
    tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90
    },
    cone: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 10,
      angle2: 0.01,
      color: "rgba(0,255,255,0.5)",
      opacity: 0.5,
      show: false
    },
    path: {
      color: "#00ff00",
      opacity: 0.5,
      width: 1,
      show: true
    }
  })
  graphicLayer.addGraphic(weixin)

  // 卫星朝向的中线地面点
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(() => {
      const pt1 = weixin.position
      const pt2 = weixin.groundPosition
      if (!pt1 || !pt2) {
        return []
      }
      return [pt1, pt2]
    }, false),
    style: {
      width: 2,
      color: "#ff0000",
      arcType: Cesium.ArcType.NONE
    }
  })
  graphicLayer.addGraphic(graphic)

  setTimeout(() => {
    weixin.flyTo({
      radius: 900000, // 距离目标点的距离
      pitch: -60 // 相机方向
    })
  }, 3000)

  const weixinData = {}
  weixinData.name = weixin.name
  weixinData.tle1 = weixin.options.tle1
  weixinData.tle2 = weixin.options.tle2

  // 显示实时坐标和时间
  weixin.on(mars3d.EventType.change, (e) => {
    const date = Cesium.JulianDate.toDate(map.clock.currentTime)
    weixinData.time = mars3d.Util.formatDate(date, "yyyy-MM-dd HH:mm:ss")
    if (weixin.position) {
      const point = mars3d.LngLatPoint.fromCartesian(weixin.position)
      weixinData.td_jd = point.lng
      weixinData.td_wd = point.lat
      weixinData.td_gd = mars3d.MeasureUtil.formatDistance(point.alt)
      eventTarget.fire("satelliteChange", { weixinData })
    }
  })
}

export function centerPoint(angle1) {
  if (graphicTriangle) {
    graphicTriangle.show = false
  }
  graphicTriangle = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const pt1 = weixin.position

      const hpr = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(weixin.heading),
        Cesium.Math.toRadians(weixin.pitch),
        Cesium.Math.toRadians(weixin.roll + angle1)
      )
      const ptLeft = mars3d.PointUtil.getRayEarthPosition(pt1, hpr, true)

      const hdr2 = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(weixin.heading),
        Cesium.Math.toRadians(weixin.pitch),
        Cesium.Math.toRadians(weixin.roll - angle1)
      )
      const ptRight = mars3d.PointUtil.getRayEarthPosition(pt1, hdr2, true)

      if (!ptRight || !ptLeft) {
        return []
      }

      return [ptLeft, pt1, ptRight, ptLeft]
    }, false),
    style: {
      width: 2,
      color: "#0000ff",
      arcType: Cesium.ArcType.NONE
    }
  })
  graphicLayer.addGraphic(graphicTriangle)
}

// 俯仰角
export function pitchChange(value) {
  weixin.pitch = value
}

// 左右角
export function rollChange(value) {
  weixin.roll = value
}

export function angle(value) {
  weixin.angle1 = value
  centerPoint(weixin.angle1)
}

export function chkShowModelMatrix(val) {
  weixin.coneShow = val // 显示关闭视锥体
}

export function locate() {
  weixin.flyTo()
}
