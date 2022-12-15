import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.859438, lng: 116.304605, alt: 1515, heading: 301, pitch: -50 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { bottom: "380px", left: "5px" }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到组件中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式

  addGraphicLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export let fixedRoute

function addGraphicLayer() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const positions = [
    [116.295754, 30.859525, 418.5],
    [116.295699, 30.859754, 419.1],
    [116.295759, 30.860242, 422.2],
    [116.296109, 30.861108, 425.6],
    [116.296669, 30.862062, 428.8],
    [116.297105, 30.862978, 431.7],
    [116.297429, 30.863782, 432.2],
    [116.297829, 30.864648, 432.6],
    [116.298229, 30.865548, 432.7],
    [116.298639, 30.86646, 433.2],
    [116.299029, 30.867376, 433.8],
    [116.299369, 30.868276, 434.9],
    [116.299615, 30.869388, 438.5],
    [116.300039, 30.870338, 442.5],
    [116.300469, 30.871318, 445.5],
    [116.300904, 30.872262, 449.4],
    [116.301324, 30.873121, 454.2],
    [116.301599, 30.873975, 458.7],
    [116.301689, 30.875131, 463.9],
    [116.301579, 30.876368, 468.8],
    [116.301229, 30.877428, 473.7],
    [116.300774, 30.878442, 479.1],
    [116.300239, 30.879461, 486.1],
    [116.299729, 30.880532, 493.5],
    [116.299264, 30.881518, 500.9],
    [116.298709, 30.882543, 510],
    [116.284909, 30.885183, 1133.1],
    [116.283389, 30.884496, 1137.1],
    [116.282189, 30.883573, 1144.7],
    [116.281149, 30.882568, 1156.7],
    [116.280359, 30.881538, 1169.8],
    [116.279799, 30.880498, 1181.2],
    [116.279349, 30.879354, 1193.9],
    [116.279239, 30.878175, 1204.7],
    [116.279199, 30.877008, 1217.5],
    [116.278985, 30.875825, 1219.3],
    [116.278719, 30.874704, 1229.2],
    [116.278504, 30.873662, 1244],
    [116.278319, 30.872651, 1259.5],
    [116.278159, 30.871621, 1276.4],
    [116.278009, 30.870608, 1288.9],
    [116.277859, 30.869592, 1299.4],
    [116.277719, 30.868562, 1307.6],
    [116.277579, 30.867551, 1318.2],
    [116.277479, 30.866533, 1324.5],
    [116.277375, 30.865503, 1333.4],
    [116.277249, 30.864495, 1342.3],
    [116.277109, 30.863481, 1348.5],
    [116.276925, 30.862451, 1355.5],
    [116.276689, 30.861432, 1362.3],
    [116.276329, 30.860395, 1369.9],
    [116.275779, 30.859358, 1377.1],
    [116.274999, 30.858373, 1386.1],
    [116.274169, 30.857366, 1395.2],
    [116.273239, 30.856492, 1402.7],
    [116.272034, 30.855893, 1407.4],
    [116.270639, 30.855432, 1415.9],
    [116.269143, 30.855142, 1422.6],
    [116.267639, 30.85497, 1429.6],
    [116.266053, 30.855134, 1434.4],
    [116.264344, 30.855382, 1437.1],
    [116.262739, 30.855813, 1434.6],
    [116.261124, 30.856393, 1432.8],
    [116.259589, 30.856968, 1434.4],
    [116.258065, 30.857548, 1436.9],
    [116.258949, 30.864934, 1272.7],
    [116.259889, 30.865938, 1266.5],
    [116.260995, 30.866778, 1262],
    [116.262219, 30.867478, 1257.4],
    [116.263369, 30.868178, 1259.1],
    [116.264535, 30.868852, 1259.3],
    [116.265729, 30.86955, 1257.7],
    [116.266959, 30.870248, 1253.8],
    [116.268204, 30.870984, 1248.4],
    [116.269429, 30.871701, 1242.8],
    [116.270623, 30.872398, 1241.4],
    [116.271799, 30.873088, 1241.6],
    [116.272973, 30.873792, 1240.8],
    [116.274099, 30.874505, 1240.5],
    [116.275159, 30.875291, 1238.8],
    [116.276079, 30.876208, 1236.6],
    [116.276833, 30.877313, 1232.6],
    [116.277469, 30.878473, 1230.4],
    [116.278023, 30.879636, 1227.8],
    [116.278519, 30.880798, 1225.7],
    [116.279009, 30.881963, 1223.5],
    [116.279519, 30.883118, 1223.2],
    [116.280029, 30.884288, 1223.1],
    [116.280589, 30.885453, 1222.1],
    [116.281199, 30.886541, 1222.2],
    [116.281959, 30.887563, 1221.3],
    [116.282883, 30.88852, 1221.2],
    [116.283883, 30.889444, 1221.5],
    [116.284949, 30.89026, 1221.2]
  ]

  fixedRoute = new mars3d.graphic.FixedRoute({
    name: "飞机航线",
    speed: 100,
    startTime: "2017-08-25 09:00:00",
    positions: positions,
    // "clockLoop": true,      //是否循环播放
    clockRange: Cesium.ClockRange.CLAMPED, // CLAMPED 到达终止时间后停止
    camera: {
      type: "gs",
      heading: 30,
      radius: 500
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/MQ-9-Predator.glb",
      scale: 1,
      minimumPixelSize: 100
    },
    path: {
      color: "rgba(255,255,0,0.5)",
      width: 1,
      leadTime: 0
    },
    wall: {
      color: "rgba(0,255,255,0.5)",
      surface: true
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  // 绑定popup
  bindPopup(fixedRoute)

  // ui面板信息展示
  fixedRoute.on(mars3d.EventType.change, (event) => {
    // console.log("change", event)
    eventTarget.fire("roamLineChange", event)
  })

  // fixedRoute.start()
  // fixedRoute.openPopup()

  // 修改控件对应的时间
  map.clock.currentTime = fixedRoute.startTime
  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(fixedRoute.startTime, fixedRoute.stopTime)
  }
}



// 改变视角模式
export function updateCameraSetting(data) {
  const cameraType = data.select
  const followedX = data.followedX
  const followedZ = data.followedZ
  const offsetZ = data.offsetZ
  const offsetY = data.offsetY
  const offsetX = data.offsetX

  fixedRoute.setCameraOptions({
    type: cameraType,
    radius: cameraType === "gs" ? followedX : 0,
    followedX: followedX,
    followedZ: followedZ,
    offsetZ: offsetZ,
    offsetY: offsetY,
    offsetX: offsetX
  })
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
