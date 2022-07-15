import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  startAnimation()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function startAnimation() {
  map.flyHome({ duration: 0 })

  // 开场动画
  map.openFlyAnimation({
    // duration1:4,
    // easingFunction1: Cesium.EasingFunction.QUINTIC_IN_OUT,
    callback: function () {
      // 动画播放完成后回调
    }
  })
}

export function stopAnimation() {
  map.camera.cancelFlight()
}
