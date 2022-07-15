import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 23.54104, lng: 121.083097, alt: 10219674, heading: 0, pitch: -85 },
    highDynamicRange: false
  },
  terrain: {
    type: "gee",
    url: "http://www.earthenterprise.org/3d",
    // "proxy": "//server.mars3d.cn/proxy/",
    show: true
  },
  basemaps: [
    {
      name: "GEE地图",
      icon: "img/basemaps/osm.png",
      type: "gee",
      url: "http://www.earthenterprise.org/3d",
      // "proxy": "//server.mars3d.cn/proxy/",
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
  map = mapInstance // 记录首次创建的map

  globalNotify("已知问题提示", `(1) 需要自行部署自己的谷歌地球企业版服务后，修改url才能体验。`)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
