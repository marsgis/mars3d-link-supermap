import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.840726, lng: 117.25174, alt: 206, heading: 357, pitch: -25 },
    cameraController: {
      enableCollisionDetection: false
    }
  },
  control: {
    infoBox: false
  },
  layers: [
    {
      id: 1987,
      name: "教学楼",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
      maximumScreenSpaceError: 16,
      maximumMemoryUsage: 1024,
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 开启键盘漫游
  map.keyboardRoam.enabled = true

  map.keyboardRoam.minHeight = 80

  map.keyboardRoam.setOptions({
    moveStep: 10, // 平移步长 (米)。
    dirStep: 25, // 相机原地旋转步长，值越大步长越小。
    rotateStep: 1.0, // 相机围绕目标点旋转速率，0.3-2.0
    minPitch: 0.1, // 最小仰角  0-1
    maxPitch: 0.95 // 最大仰角  0-1
  })

  // 不按键一直自动往前走，调用stopMoveForward停止。
  // map.keyboardRoam.startMoveForward()

  // 相机原地左一直旋转
  // setInterval(function () {
  //     map.keyboardRoam.rotateCamera(mars3d.KeyboardType.LEFT_ROTATE);
  // }, 100);
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 修改步长
export function changeSlider(val) {
  if (val) {
    map.keyboardRoam.moveStep = val
  }
}

// 室内
export function centerAtDX1() {
  map.keyboardRoam.moveStep = 0.1 // 平移步长 (米)。
  map.keyboardRoam.dirStep = 50 // 相机原地旋转步长，值越大步长越小。
  map.keyboardRoam.rotateStep = 0.3 // 相机围绕目标点旋转速率，0.3-2.0

  map.setCameraView({ lat: 31.843804, lng: 117.250994, alt: 33, heading: 307, pitch: 1 })
}

// 室外
export function centerAtDX2() {
  map.keyboardRoam.moveStep = 10 // 平移步长 (米)。
  map.keyboardRoam.dirStep = 25 // 相机原地旋转步长，值越大步长越小。
  map.keyboardRoam.rotateStep = 1.0 // 相机围绕目标点旋转速率，0.3-2.0

  map.setCameraView({ lat: 31.829732, lng: 117.246797, alt: 773, heading: 357, pitch: -25 })
}
