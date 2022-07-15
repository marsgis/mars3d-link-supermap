import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 36.873519, lng: 106.863496, alt: 19999205, heading: 354, pitch: -89 },
    orderIndependentTranslucency: false,
    contextOptions: { webgl: { alpha: true } }, // 允许透明，只能Map初始化传入 [关键代码]
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    globe: {
      baseColor: "rgba(0,0,0,0)",
      showGroundAtmosphere: false,
      enableLighting: false
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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function show() {
  map.container.style.backgroundImage = "none"
}

export function show1() {
  map.container.style.backgroundImage = "url(/img/tietu/backGroundImg.jpg)"
}

export function show2() {
  map.container.style.backgroundImage = "url(//data.mars3d.cn/file/img/world/world.jpg)"
}

export function show3() {
  map.container.style.backgroundImage = "url(/img/tietu/bg4.jpg)"
}
