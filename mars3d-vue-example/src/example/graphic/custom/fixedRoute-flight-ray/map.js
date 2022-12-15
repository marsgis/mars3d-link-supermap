import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.344715, lng: 115.783073, alt: 10056, heading: 158, pitch: -55 },
    globe: {
      // depthTestAgainstTerrain: true,
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true // 是否显示时间线控件
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
  map.hasTerrain = false

  globalNotify("已知问题提示", `不支持对地形的求交，目前仅对椭球体做投射。 `)

  addGraphicLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let fixedRoute

function addGraphicLayer() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  fixedRoute = new mars3d.graphic.FixedRoute({
    name: "飞机航线",
    speed: 200,
    positions: [
      [115.833866, 31.311451, 4000],
      [115.785116, 31.293944, 4000],
      [115.748115, 31.266263, 4000],
      [115.711031, 31.216472, 4000]
    ],
    clockLoop: true, // 是否循环播放
    camera: {
      type: "zy",
      followedX: 50,
      followedZ: 10
    },
    label: {
      text: "火星号",
      color: "#0081c2",
      font_size: 20,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      pixelOffsetX: 0,
      pixelOffsetY: -20
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.01,
      minimumPixelSize: 100
    },
    path: {
      color: "rgba(255,255,0,0.5)",
      width: 1,
      leadTime: 0
    }
    // wall: {
    //   color: "rgba(0,255,255,0.5)",
    //   surface: true
    // }
  })
  graphicLayer.addGraphic(fixedRoute)

  // 绑定popup
  bindPopup(fixedRoute)

  // ui面板信息展示
  fixedRoute.on(mars3d.EventType.change, (event) => {
    eventTarget.fire("roamLineChange", event)
  })

  // 启动漫游
  fixedRoute.start()

  testShading()

  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(fixedRoute.startTime, fixedRoute.stopTime)
  }
}

export function setMoelStyle(style) {
  fixedRoute.model.setStyle(style)
}

export function clearMoelPitchRoll () {
  fixedRoute.model.style.pitch = undefined
  fixedRoute.model.style.roll = undefined
}


export function clearGroundLayer() {
  groundLayer.clear()
}

let groundLayer // 地面投影图层

function testShading() {
  // 卫星朝向的中线地面点
  const line1 = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const pt1 = fixedRoute.position
      const pt2 = centerPosion
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
  map.graphicLayer.addGraphic(line1)

  // 卫星边线2点
  const graphicTriangle = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const positions = getFourShadingPosition({
        angle: 2.4,
        angle2: 1.4
      })
      return positions
    }, false),
    style: {
      width: 2,
      color: "#0000ff",
      clampToGround: true
    }
  })
  map.graphicLayer.addGraphic(graphicTriangle)

  // 创建矢量数据图层
  groundLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(groundLayer)

  setInterval(function () {
    if (!map.clock.shouldAnimate || !thisPositions) {
      return
    }
    addPolygon()
  }, 1500)
}

// 获取地面的四棱台投影面
let thisPositions
let centerPosion
let lastPositions

function getFourShadingPosition(opts) {
  // 位置
  const pt1 = fixedRoute.position
  if (!pt1) {
    return
  }

  const ellipsoid = map.scene.globe.ellipsoid

  // 张角
  const angle1 = Cesium.Math.toRadians(opts.angle) / 2

  const heading = Cesium.Math.toRadians(Cesium.defaultValue(opts.heading, fixedRoute.model.heading))
  const pitch = Cesium.Math.toRadians(Cesium.defaultValue(opts.pitch, fixedRoute.model.pitch))
  const roll = Cesium.Math.toRadians(Cesium.defaultValue(opts.heading, fixedRoute.model.roll))

  // 张角
  const angle2 = Cesium.Math.toRadians(opts.angle2) / 2

  const ptLeft1 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch + angle2, roll + angle1), true, ellipsoid)
  if (!ptLeft1) {
    return
  }

  const ptRight1 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch + angle2, roll - angle1), true, ellipsoid)
  if (!ptRight1) {
    return
  }

  const ptRight2 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch - angle2, roll - angle1), true, ellipsoid)
  if (!ptRight2) {
    return
  }

  const ptLeft2 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch - angle2, roll + angle1), true, ellipsoid)
  if (!ptLeft2) {
    return
  }

  const ptLeft = Cesium.Cartesian3.midpoint(ptLeft1, ptLeft2, new Cesium.Cartesian3())
  const ptRight = Cesium.Cartesian3.midpoint(ptRight1, ptRight2, new Cesium.Cartesian3())
  thisPositions = [ptLeft, ptRight]

  centerPosion = Cesium.Cartesian3.midpoint(ptLeft, ptRight, new Cesium.Cartesian3())

  return [ptLeft1, ptRight1, ptRight2, ptLeft2, ptLeft1]
}

function addPolygon() {
  if (lastPositions == null) {
    lastPositions = thisPositions
    return
  }
  const positions = [lastPositions[0], lastPositions[1], thisPositions[1], thisPositions[0]]
  lastPositions = thisPositions

  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: positions,
    style: {
      color: "#ff0000",
      opacity: 0.3
    }
  })
  groundLayer.addGraphic(graphic)

  if (groundLayer.length > 2000) {
    groundLayer.clear()
  }
}

function bindPopup(fixedRoute) {
  fixedRoute.bindPopup(
    `<div style="width: 200px">
      <div>总 距 离：<span id="lblAllLen"> </span></div>
      <div>总 时 间：<span id="lblAllTime"> </span></div>
      <div>开始时间：<span id="lblStartTime"> </span></div>
      <div>剩余时间：<span id="lblRemainTime"> </span></div>
      <div>剩余距离：<span id="lblRemainLen"> </span></div>
    </div>`,
    { closeOnClick: false }
  )

  // 刷新局部DOM,不影响popup面板的其他控件操作
  fixedRoute.on(mars3d.EventType.postRender, function (event) {
    const container = event.container // popup对应的DOM

    const params = fixedRoute?.info
    if (!params) {
      return
    }

    const lblAllLen = container.querySelector("#lblAllLen")
    if (lblAllLen) {
      lblAllLen.innerHTML = mars3d.MeasureUtil.formatDistance(params.distance_all)
    }

    const lblAllTime = container.querySelector("#lblAllTime")
    if (lblAllTime) {
      lblAllTime.innerHTML = mars3d.Util.formatTime(params.second_all / map.clock.multiplier)
    }

    const lblStartTime = container.querySelector("#lblStartTime")
    if (lblStartTime) {
      lblStartTime.innerHTML = mars3d.Util.formatDate(Cesium.JulianDate.toDate(fixedRoute.startTime), "yyyy-M-d HH:mm:ss")
    }

    const lblRemainTime = container.querySelector("#lblRemainTime")
    if (lblRemainTime) {
      lblRemainTime.innerHTML = mars3d.Util.formatTime((params.second_all - params.second) / map.clock.multiplier)
    }

    const lblRemainLen = container.querySelector("#lblRemainLen")
    if (lblRemainLen) {
      lblRemainLen.innerHTML = mars3d.MeasureUtil.formatDistance(params.distance_all - params.distance) || "完成"
    }
  })
}

// ui层使用
export const formatDistance = mars3d.MeasureUtil.formatDistance
export const formatTime = mars3d.Util.formatTime
