import * as mars3d from "mars3d"
import FloorGraphic from "./FloorGraphic"

export let map // mars3d.Map三维地图对象
let floorGraphic

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.832215, lng: 117.219965, alt: 195, heading: 31, pitch: -36 }
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

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 该对象代码定义在：js/FloorGraphic.js

  floorGraphic = new FloorGraphic({
    position: [117.220897, 31.833569, 41.1], // 楼栋位置
    style: {
      url: "//data.mars3d.cn/gltf/mars/floor/floor.glb",
      heading: 100,

      topUrl: "//data.mars3d.cn/gltf/mars/floor/top.glb", // 楼顶的模型
      count: 9, // 总层数（不含楼顶）
      spacing: 3 // 每层层高,单位:米
    }
  })
  graphicLayer.addGraphic(floorGraphic)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 展开
export function openFloorModel() {
  const height = 5 // 展开的每层间隔高度，单位：米
  floorGraphic.openAll(height)
}

// 合并
export function mergeFloorModel() {
  floorGraphic.mergeAll()
}

// 还原
export function resetModel() {
  floorGraphic.reset()
}

// 楼层显示
export function showFloorModel(floorNum) {
  floorGraphic.showFloor(floorNum)
}
