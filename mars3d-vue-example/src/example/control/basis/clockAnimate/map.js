import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.control = {
    timeline: true,
    clockAnimate: false,
    distanceLegend: { left: "100px", bottom: "27px" }
  }
  return option
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 时钟控制（可替代cesium本身的animation）
  const clockAnimate = new mars3d.control.ClockAnimate({
    format: "yyyy-MM-dd HH:mm:ss"
  })
  map.addControl(clockAnimate)

  clockAnimate.on(mars3d.EventType.click, function (event) {
    if (event.targetType === "label") {
      console.log("单击了时间文本区域", event)
      const startTime = Cesium.JulianDate.toDate(map.clock.startTime)
      const stopTime = Cesium.JulianDate.toDate(map.clock.stopTime)
      const currentTime = Cesium.JulianDate.toDate(map.clock.currentTime)

      eventTarget.fire("clickShowClockAnimate", { startTime, stopTime, currentTime })
    }
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function setCurrentTime(currentTime) {
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date(currentTime))
}

export function setClockAnimateTime(startTimes, stopTimes) {
  const startTime = Cesium.JulianDate.fromDate(new Date(startTimes))
  const stopTime = Cesium.JulianDate.fromDate(new Date(stopTimes))

  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(startTime, stopTime)
  }
}
