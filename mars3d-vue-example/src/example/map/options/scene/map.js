import * as mars3d from "mars3d"

export let map

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 20.772952, lng: 82.609338, alt: 22604251, heading: 0, pitch: -90 }
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

  // 2也可以通过下面方法获取center参数
  const center = map.getCameraView()
  console.log("center参数为", JSON.stringify(center))

  // 可以通过centerAt切换视角
  map.setCameraView(center)
}


// 视图切换
export function sceneMode(name) {
  const value = Number(name)
  setSceneOptions("sceneMode", value)
}

export function setSceneOptions(name, value) {
  const options = {}
  options[name] = value

  console.log("更新了地图参数", options)
  map.setSceneOptions(options)
}

export function setSceneGlobeOptions(name, value) {
  const options = { globe: {} }
  options.globe[name] = value

  console.log("更新了地图参数", options)
  map.setSceneOptions(options)
}

export function setSceneCameraControllerOptions(name, value) {
  const options = { cameraController: {} }
  options.cameraController[name] = value

  console.log("更新了地图参数", options)
  map.setSceneOptions(options)

  if (name === "constrainedAxis" && value === true) {
    map.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z
  }
}

// 是否显示底图
export function showBaseMap(val) {
  if (val === "1") {
    map.basemap = 2021
  } else {
    map.basemap = undefined
  }
}
