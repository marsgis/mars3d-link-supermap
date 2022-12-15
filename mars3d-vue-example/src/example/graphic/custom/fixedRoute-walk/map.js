import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中
export let fixedRoute

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.824853, lng: 117.221414, alt: 1452, heading: 355, pitch: -54 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
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

  fixedRoute = new mars3d.graphic.FixedRoute({
    name: "步行路线",
    frameRate: 1,
    speed: 40,
    // autoStop: true, // 到达终点自动停止
    clockLoop: true, // 循环播放
    positions: [
      [117.220356, 31.833959, 43.67],
      [117.220361, 31.835111, 44.36],
      [117.213242, 31.835863, 42.31],
      [117.211926, 31.835738, 42.14],
      [117.183103, 31.833906, 47.17],
      [117.183136, 31.833586, 47.39],
      [117.183968, 31.833637, 47.05],
      [117.184038, 31.833134, 47.39],
      [117.184364, 31.833142, 47.26],
      [117.184519, 31.833375, 47.04]
    ],
    pauseTime: 0.5,
    camera: {
      type: "gs",
      radius: 300
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/man/walk.gltf",
      scale: 5,
      minimumPixelSize: 50,
      clampToGround: true
    },
    circle: {
      radius: 10,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#ffff00",
        opacity: 0.3,
        speed: 10,
        count: 3,
        gradient: 0.1
      },
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  // 绑定popup
  bindPopup(fixedRoute)

  // 显示popup
  fixedRoute.openPopup()

  // ui面板信息展示
  fixedRoute.on(mars3d.EventType.change, (event) => {
    eventTarget.fire("roamLineChange", event)
  })

  fixedRoute.on(mars3d.EventType.endItem, function (event) {
    console.log("已漫游过点：" + event.index, event)
  })
  fixedRoute.on(mars3d.EventType.end, function (event) {
    console.log("漫游结束", event)
    eventTarget.fire("endRoam")
  })

  // 不贴地时，直接开始
  // fixedRoute.start()

  // 贴地时，异步计算完成后开始
  // fixedRoute.clampToGround({ has3dtiles: true }).then(function () {//异步计算完成贴地后再启动
  //     //贴地后的路线值为flyLine.positions
  //    fixedRoute.start()
  // });
}

function bindPopup(fixedRoute) {
  fixedRoute.bindPopup(
    () => {
      const html = `<div id="popupContent"  class="marsBlackPanel animation-spaceInDown">
    <div class="marsBlackPanel-text">
      <div style="width: 200px;text-align:left;">
        <div>总 距 离：<span id="lblAllLen"> </span></div>
        <div>总 时 间：<span id="lblAllTime"> </span></div>
        <div>开始时间：<span id="lblStartTime"> </span></div>
        <div>剩余时间：<span id="lblRemainTime"> </span></div>
        <div>剩余距离：<span id="lblRemainLen"> </span></div>
      </div>
    </div>
    <span class="mars3d-popup-close-button closeButton" >×</span>
    </div>`
      return html
    },
    { offsetY: -40, template: false }
  )

  // 刷新局部DOM,不影响popup面板的其他控件操作
  fixedRoute.on(mars3d.EventType.postRender, function (event) {
    const container = event.container // popup对应的DOM

    const params = fixedRoute.info
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
      lblRemainLen.innerHTML = mars3d.MeasureUtil.formatDistance(params.distance_all - params.distance)
    }
  })
}

// ui层使用
export const formatDistance = mars3d.MeasureUtil.formatDistance
export const formatTime = mars3d.Util.formatTime
