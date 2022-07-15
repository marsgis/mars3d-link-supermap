import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.73204, lng: 117.286568, alt: 50785, heading: 359, pitch: -76 }
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

  // 构造鹰眼地图
  const overviewMap = new mars3d.control.OverviewMap({
    basemap: {
      name: "天地图电子",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "vec_d" },
        { name: "注记", type: "tdt", layer: "vec_z" }
      ]
    },
    rectangle: {
      color: "#fecd78",
      opacity: 0.2,
      outline: 1,
      outlineColor: "#ff7800"
    },
    style: {
      right: "5px",
      top: "5px",
      width: "200px",
      height: "150px"
    }
  })
  map.addControl(overviewMap)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
