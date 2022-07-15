import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let rotateOut

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.850468, lng: 116.354027, alt: 722, heading: 87, pitch: -6 }
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

  rotateOut = new mars3d.thing.RotateOut({
    direction: false, // 方向 true逆时针，false顺时针
    time: 60 // 给定飞行一周所需时间(单位 秒)，控制速度
  })
  map.addThing(rotateOut)

  // 开启旋转
  rotateOut.start()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function startRotate() {
  rotateOut.start()
}

export function stopRotate() {
  rotateOut.stop()
}
