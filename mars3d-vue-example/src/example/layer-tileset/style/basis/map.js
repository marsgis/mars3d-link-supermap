import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tiles3dLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.786828, lng: 117.181704, alt: 3393, heading: 38, pitch: -34 }
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

  map.basemap = 2017 // 切换到蓝色底图
  // 模型
  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei2/tileset.json",
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    style: {
      color: {
        conditions: [
          ["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
          ["${height} >= 200", "rgb(102, 71, 151)"],
          ["${height} >= 100", "rgb(170, 162, 204)"],
          ["${height} >= 50", "rgb(224, 226, 238)"],
          ["${height} >= 30", "rgb(252, 230, 200)"],
          ["${height} >= 20", "rgb(248, 176, 87)"],
          ["${height} >= 10", "rgb(198, 106, 11)"],
          ["true", "rgb(127, 59, 8)"]
        ]
      }
    },
    highlight: { type: "click", color: "#FFFF00" },
    popup: [
      { field: "objectid", name: "编号" },
      { field: "name", name: "名称" },
      { field: "height", name: "楼高", unit: "米" }
    ]
  })
  map.addLayer(tiles3dLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function setStyle1() {
  tiles3dLayer.style = undefined
}

export function setStyle2() {
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
        ["${height} >= 200", "rgb(102, 71, 151)"],
        ["${height} >= 100", "rgb(170, 162, 204)"],
        ["${height} >= 50", "rgb(224, 226, 238)"],
        ["${height} >= 30", "rgb(252, 230, 200)"],
        ["${height} >= 20", "rgb(248, 176, 87)"],
        ["${height} >= 10", "rgb(198, 106, 11)"],
        ["true", "rgb(127, 59, 8)"]
      ]
    }
  })
}

export function selectColor(col) {
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [["true", `color("${col}")`]]
    }
  })
}
