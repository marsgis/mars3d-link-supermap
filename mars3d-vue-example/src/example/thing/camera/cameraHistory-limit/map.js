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

  cameraHistory = new mars3d.thing.CameraHistory({
    limit: {
      // 限定视角范围
      position: Cesium.Cartesian3.fromDegrees(117.27462, 31.864196, 34.85),
      radius: 5000.0,
      debugExtent: true
    },
    maxCacheCount: 999
  })
  map.addThing(cameraHistory)

  cameraHistory.on(mars3d.EventType.change, function (event) {
    // 触发自定义事件
    const count = event.count
    eventTarget.fire("changeCamera", { count })
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 是否开启限定范围
export function chkUnderground(val) {
  cameraHistory.debugExtent = val
}
