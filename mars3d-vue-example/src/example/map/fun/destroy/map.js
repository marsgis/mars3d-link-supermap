import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  layers: [
    {
      type: "geojson",
      name: "示例数据",
      url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
      popup: "{type} {name}",
      show: true
    },
    {
      type: "3dtiles",
      name: "测试模型",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 116.313536, lat: 31.217297, alt: 80 },
      scale: 100,
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

  map.on(mars3d.EventType.load, function (event) {
    console.log(`地图所有图层加载完成`)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  destroyMap()
}

export function createMap() {
  if (map) {
    globalMsg("地图已存在,请勿重复创建!")
    return
  }
  map = new mars3d.Map("mars3dContainer", mapOptions)
}

export function destroyMap() {
  if (!map) {
    globalMsg("地图已销毁,无需重复销毁!")
    return
  }
  map.destroy()
  map = null
}
