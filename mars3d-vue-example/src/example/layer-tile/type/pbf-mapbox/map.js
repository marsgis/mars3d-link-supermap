import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 38.966548, lng: 114.742472, alt: 176062, heading: 25, pitch: -55 }
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

  globalNotify(
    "已知问题提示",
    `(1) 无数据区域mapbox-gl.js解析失败F12会有错误提示，但不影响使用。(2) 如果部分PBF数据未显示，需要扩展开发对应解析style代码。`
  )

  addPbfLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addPbfLayer() {
  // 在 lib\mars3d\thirdParty\pbf-mapbox\PbfLayer.js 中定义的
  const pbfLayer = new mars3d.layer.PbfLayer({
    url: "https://vstyles.mapplus.cn/v1.0/styles/bj_500_dz/style.json"
  })
  map.addLayer(pbfLayer)
}

// function addPbfLayer2() {
//   const host = "http://127.0.0.1"
//   const ak = "015asdfasdofjqwaoeirjtnmbv"

//   const pbfLayer = new mars3d.layer.PbfLayer({
//     url: `${host}/sj_vector/v6/api/style/1987/style.json?ak=${ak}`,
//     transformUrl: function (url) {
//       url = url.replace("sjtemp:/", host)
//       if (url.indexOf("ak") === -1) {
//         if (url.indexOf("?") === -1) {
//           url += `?ak=${ak}`
//         } else {
//           url += `&ak=${ak}`
//         }
//       }
//       return url
//     }
//   })
//   map.addLayer(pbfLayer)
// }
