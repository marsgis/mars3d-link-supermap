import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中


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
    timeline: true // 是否显示时间线控件
  }
}

let weixin

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map  map.toolbar.style.bottom = "55px"// 修改toolbar控件的样式

  // 指定时间
  // map.clock.currentTime = Cesium.JulianDate.fromDate(new Date('2020-11-27 10:48:28'))
  map.clock.shouldAnimate = true
  map.clock.multiplier = 1 // 速度

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
      color: "rgba(0,255,255,0.5)",
      reverse: false,
      show: true
    },
    path: {
      show: true,
      color: "#00ff00",
      opacity: 0.5,
      width: 1
    },
    fixedFrameTransform: Cesium.Transforms.localFrameToFixedFrameGenerator("east", "south"),
    attr: { name: "高分1号" }
  })
  graphicLayer.addGraphic(weixin)

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

// 定位至卫星
export function locate() {
  weixin.flyTo()
}

// 参考轴系显示与隐藏
export function chkShowModelMatrix(val) {
  weixin.debugAxis = val
}
// 凝视目标
export function selPoint() {
  if (weixin.lookAt) {
    weixin.lookAt = null
  } else {
    map.graphicLayer.startDraw({
      type: "point",
      style: {
        pixelSize: 12,
        color: "#ffff00"
      },
      success: function (graphic) {
        const position = graphic.positionShow
        map.graphicLayer.clear()

        weixin.lookAt = position
      }
    })
  }
}

// 类型选择
export function chkSensorType(value) {
  if (value === "1") {
    weixin.setOptions({
      cone: {
        sensorType: mars3d.graphic.SatelliteSensor.Type.Conic
      }
    })
  } else {
    weixin.setOptions({
      cone: {
        sensorType: mars3d.graphic.SatelliteSensor.Type.Rect
      }
    })
  }
}

// 俯仰角
export function pitchChange(value) {
  weixin.pitch = value
}

// 左右角
export function rollChange(value) {
  weixin.roll = value
}

// 夹角1
export function angle1(value) {
  weixin.angle1 = value
}

// 夹角2
export function angle2(value) {
  weixin.angle2 = value
}
