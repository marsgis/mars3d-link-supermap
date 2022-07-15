import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let firstPersonRoam

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.929546, lng: 116.172289, alt: 559, heading: 168, pitch: -11 }
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

  firstPersonRoam = new mars3d.thing.FirstPersonRoam()
  map.addThing(firstPersonRoam)

  firstPersonRoam.startAutoForward()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 是否开启漫游
export function chkOpen(value) {
  firstPersonRoam.enabled = value
}

// 开始自动漫游
export function startAuto() {
  firstPersonRoam.startAutoForward()
}

// 停止自动漫游
export function stopAuto() {
  firstPersonRoam.stopAutoForward()
}
