import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  terrain: false
  // 方式1：在创建地球前的传参中配置 terrain 参数[目前1个球只支持1个地形服务]
  // terrain: {
  //   type: "tdt",
  //   url: "https://t{s}.tianditu.gov.cn/DataServer",
  //   key: mars3d.Token.tianditu,
  //   subdomains: "01234567",
  //   show: true,
  // },
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 方式2：在创建地球后更新terrainProvider
  map.terrainProvider = new mars3d.provider.TdtTerrainProvider({
    url: "https://t{s}.tianditu.gov.cn/DataServer",
    key: mars3d.Token.tianditu,
    subdomains: "01234567"
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 是否开启三角网
export function checkedTriangulation(enabled) {
  map.scene.globe._surface.tileProvider._debug.wireframe = enabled // 三角网
}
