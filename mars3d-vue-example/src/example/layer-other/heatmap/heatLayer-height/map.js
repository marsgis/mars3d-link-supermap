import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let heatLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.80232, lng: 117.206907, alt: 1996, heading: 39, pitch: -22 }
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
  map.basemap = 2017 // 蓝色底图

  // 图层1
  const arrPoints = getRandomPoints(1000) // 测试点数据，实际开发时换掉
  showHeatMap(arrPoints, 300)

  // 图层2
  const arrPoints2 = getRandomPoints(1000) // 测试点数据，实际开发时换掉
  showHeatMap(arrPoints2, 800)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function showHeatMap(arrPoints, height) {
  // 热力图 图层
  heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    rectangle: rectangle,
    // 以下为热力图本身的样式参数，可参阅api：https://www.patrick-wied.at/static/heatmapjs/docs.html
    heatStyle: {
      radius: 40,
      blur: 0.85
    },
    // 以下为矩形矢量对象的样式参数
    style: {
      height: height
    }
  })
  map.addLayer(heatLayer)
}

// 更新数据
export function btnUpdate() {
  const arr = getRandomPoints(1000)
  heatLayer.setPositions(arr, true)
}

const rectangle = {
  xmin: 117.226189,
  xmax: 117.245831,
  ymin: 31.828858,
  ymax: 31.842967
}

// 获取bbox矩形区域内的count个随机点
function getRandomPoints(count) {
  const arr = []
  const arrPoint = turf.randomPoint(count, { bbox: [rectangle.xmin, rectangle.ymin, rectangle.xmax, rectangle.ymax] }).features // 随机点
  for (let i = 0; i < arrPoint.length; i++) {
    const item = arrPoint[i].geometry.coordinates
    const val = Math.floor(Math.random() * 100) // 热力值
    arr.push({ lng: item[0], lat: item[1], value: val })
  }
  return arr
}
