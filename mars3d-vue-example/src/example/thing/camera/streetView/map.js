import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let streetView

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  streetView = new mars3d.thing.StreetView({
    rotateSpeed: 30, // 右键拖动的移动度数，旋转的方向和速度，正负控制方向。
    windingPointDirection: false, /// 绕点旋转方向 true逆时针，false顺时针
    windingPointTime: 30, // 绕点旋转的一周时长(秒)，控制速度。
    windingPointAngle: 360, // 旋转的角度后自动停止
    heightStep: 0.2, // 升高或降低相机高度比例，当前相机高度的比例
    moveStep: 0.1, // 左键双击定位的移动比例，当前视距的比例
    moveDuration: 3 // 左键双击定位动画时长，不指定时cesium内部自动计算的
  })
  map.addThing(streetView)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function shadingMaterials(val) {
  if (val === 1) {
    streetView.enabled = true
  } else {
    streetView.enabled = false
  }
}
