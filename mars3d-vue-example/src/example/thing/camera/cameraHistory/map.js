import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let cameraHistory

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  cameraHistory = new mars3d.thing.CameraHistory()
  map.addThing(cameraHistory)

  cameraHistory.on(mars3d.EventType.change, function (data) {
    eventTarget.fire("changeCameraHistory", { data })
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 上一条视角
export function lastView() {
  const result = cameraHistory.goLast()

  if (!result) {
    globalMsg("当前已是第一条记录了")
  }
}
// 下一条视角
export function nextView() {
  const result = cameraHistory.goNext()
  if (!result) {
    globalMsg("当前已是最后一条记录了")
  }
}

// 回到当前视角
export function lastOneView() {
  const result = cameraHistory.goNow()
  if (!result) {
    globalMsg("当前已是最后一条记录了")
  }
}
