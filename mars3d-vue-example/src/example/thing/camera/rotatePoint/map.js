import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let rotatePoint

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.851782, lng: 116.350493, alt: 7944, heading: 348, pitch: -31 }
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

  rotatePoint = new mars3d.thing.RotatePoint({
    direction: false, // 方向 true逆时针，false顺时针
    time: 50 // 给定飞行一周所需时间(单位 秒)，控制速度
    // autoStopAngle: 360, //到达指定角度后自动停止
  })
  map.addThing(rotatePoint)

  // 开启旋转
  rotatePoint.start()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function startRotate() {
  // 获取当前视角
  const point = map.getCenter()
  rotatePoint.start(point) // 可以传指定的中心点坐标
}

export function stopRotate() {
  rotatePoint.stop()
}
