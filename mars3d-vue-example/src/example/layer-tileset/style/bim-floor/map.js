import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tiles3dLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.842449, lng: 117.251173, alt: 144, heading: 4, pitch: -35 }
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

  // 模型
  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "教学楼",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 1024,
    highlight: {
      type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
      color: "#00FF00"
    },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)
  showCengByStyle("F5")
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 显示整栋楼
export function showAll() {
  tiles3dLayer.style = undefined
}
// 负一层
export function minusOne() {
  showCengByStyle("B1")
}

// 1~5层
export function show(num) {
  const floor = "F" + num
  showCengByStyle(floor)
}

// API: http://mars3d.cn/api/TilesetLayer.html#style
// 说明：https://github.com/CesiumGS/3d-tiles/tree/master/specification/Styling

function showCengByStyle(ceng) {
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${标高} ==='" + ceng + "' || ${底部约束} ==='" + ceng + "'", "rgb(255, 255, 255)"],
        ["true", "rgba(255, 255, 255,0.03)"]
      ]
    }
  })
}
