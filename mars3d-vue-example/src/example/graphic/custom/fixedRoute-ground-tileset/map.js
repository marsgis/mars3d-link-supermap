import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 33.588405, lng: 119.031988, alt: 336, heading: 359, pitch: -37 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
  },
  layers: [
    {
      name: "文庙",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
      position: { alt: 120 },
      maximumScreenSpaceError: 2,
      maximumMemoryUsage: 1024,
      flyTo: true,
      show: true
    }
  ]
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

  map.on("load", function () {
    addRoamLine()
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addRoamLine() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 该数据可以从 基础项目 飞行漫游功能界面操作后单个路线的 保存JSON
  const fixedRoute = new mars3d.graphic.FixedRoute({
    name: "贴模型表面漫游",
    speed: 60,
    positions: [
      [119.030216, 33.59167, 50.9],
      [119.032637, 33.590768, 50.8],
      [119.033624, 33.592647, 53.4],
      [119.033814, 33.59293, 53.3],
      [119.033013, 33.593351, 53.1],
      [119.032066, 33.593706, 52.9],
      [119.031406, 33.593802, 53]
    ],
    camera: {
      type: "gs",
      heading: 0,
      radius: 500
    },
    model: {
      show: true,
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.1,
      minimumPixelSize: 20
    },
    polyline: {
      color: "#ffff00",
      width: 3,
      clampToGround: true,
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  // 绑定popup
  bindPopup(fixedRoute)

  // ui面板信息展示
  fixedRoute.on(mars3d.EventType.change, (event) => {
    eventTarget.fire("roamLineChange", event)
  })

  // 不贴地时，直接开始
  // startFly(fixedRoute)

  // 需要计算贴地点时，异步计算完成贴地后再启动
  showLoading()
  fixedRoute.autoSurfaceHeight({ has3dtiles: true, splitNum: 10 }).then(function (e) {
    hideLoading()
    startFly(fixedRoute)
  })
}

function startFly(fixedRoute) {
  fixedRoute.start()
  fixedRoute.openPopup() // 显示popup
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
