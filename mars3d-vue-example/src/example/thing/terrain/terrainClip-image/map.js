import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.401401, lng: 117.014981, alt: 12825, heading: 316, pitch: -53 }
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

  const terrainClip = new mars3d.thing.TerrainClip({
    positions: [
      [116.919224, 31.460461],
      [116.901819, 31.459734],
      [116.902772, 31.479859],
      [116.926981, 31.479483],
      [116.936875, 31.486053],
      [116.974004, 31.489014],
      [116.982398, 31.483053],
      [116.981635, 31.458477],
      [116.946754, 31.424056],
      [116.908152, 31.44481]
    ],
    diffHeight: 1200, // 矿区深度
    image: "./img/textures/mining.jpg", // 井墙面贴图url
    imageBottom: "./img/textures/poly-soil.jpg", // 井底贴图url
    splitNum: 2 // wall边界插值数
  })
  map.addThing(terrainClip)

  globalNotify("功能提示", "非真实数据，仅体现岩层效果。")
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
