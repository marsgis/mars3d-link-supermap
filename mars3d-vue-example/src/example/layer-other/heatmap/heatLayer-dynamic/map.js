import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let heatLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.823087, lng: 117.236208, alt: 2383, heading: 3, pitch: -61 }
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

  showHeatMap()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function showHeatMap() {
  // 随机数据的生成
  const heatMapData0 = getRandomPoints()
  const heatMapData1 = getRandomPoints()
  const resultHeatMapData = getRandomPoints()

  // 热力图 图层
  heatLayer = new mars3d.layer.HeatLayer({
    positions: heatMapData0,
    rectangle: rectangle,
    // 以下为热力图本身的样式参数，可参阅api：https://www.patrick-wied.at/static/heatmapjs/docs.html
    heatStyle: {
      radius: 40,
      blur: 0.85
    },
    // 以下为矩形矢量对象的样式参数
    style: {
      // arc: true, // 是否为曲面
      height: 200.0
    }
  })
  map.addLayer(heatLayer)

  // 为了演示动态更新
  let ratio = 0
  map.on(mars3d.EventType.preUpdate, (e) => {
    if (!isDynamic) {
      return
    }

    ratio += 0.003
    if (ratio > 1.0) {
      ratio = 0.0
    }

    const gridData = new Array(100 * 100)
    gridData.fill(0)

    lerpHeatMapData(heatMapData0, heatMapData1, ratio, resultHeatMapData)

    // 更新数据
    heatLayer.setPositions(resultHeatMapData, true)
  })
}

let isDynamic = true
export function chkUnderground(enabled) {
  isDynamic = enabled
}

const rectangle = {
  xmin: 117.226189,
  xmax: 117.245831,
  ymin: 31.828858,
  ymax: 31.842967
}

const heatCount = 1000

// 获取bbox矩形区域内的count个随机点
function getRandomPoints() {
  const arr = []
  const arrPoint = turf.randomPoint(heatCount, { bbox: [rectangle.xmin, rectangle.ymin, rectangle.xmax, rectangle.ymax] }).features // 随机点
  for (let i = 0; i < arrPoint.length; i++) {
    const item = arrPoint[i].geometry.coordinates
    const val = Math.floor(Math.random() * 100) // 热力值
    arr.push({ lng: item[0], lat: item[1], value: val })
  }
  return arr
}

function lerpHeatMapData(startArr, endArr, ratio, result) {
  for (let i = 0; i < heatCount; i++) {
    const start = startArr[i]
    const end = endArr[i]
    result[i] = {
      lng: start.lng * (1 - ratio) + end.lng * ratio,
      lat: start.lat * (1 - ratio) + end.lat * ratio,
      value: start.value * (1 - ratio) + end.value * ratio
    }
  }
}
