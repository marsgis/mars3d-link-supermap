import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    sceneMode: Cesium.SceneMode.SCENE3D,
    cameraController: {
      minimumZoomDistance: 1,
      maximumZoomDistance: 300000000
    }
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

  let lastCameraView // 记录视角

  // 切换场景前事件
  map.on(mars3d.EventType.morphStart, function (event) {
    lastCameraView = map.getCameraView()
  })

  // 切换场景后事件
  map.on(mars3d.EventType.morphComplete, function (event) {
    setTimeout(function () {
      map.setCameraView(lastCameraView)
    }, 100)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 切换为二维视图
export function to2d() {
  map.scene.morphTo2D()
}

// 切换为三维视图
export function to3d() {
  map.scene.morphTo3D()
}

// 切换为2.5D维视图
export function toGLB() {
  map.scene.morphToColumbusView()
}
