import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.654436, lng: 117.083883, alt: 759, heading: 316, pitch: -50 }
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
  addLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addLayer() {
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "石化工厂",
    url: "//data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: 24.6 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    center: {
      lat: 31.654436,
      lng: 117.083883,
      alt: 758.53,
      heading: 316.4,
      pitch: -50.1,
      roll: 359.8
    },
    popup: "all"
  })
  map.addLayer(tilesetLayer)

  // 测试点数据，实际开发时换掉
  const arrPoints = getRandomPoints(900)

  // 热力图 图层
  const heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    // 以下为热力图本身的样式参数，可参阅api：https://www.patrick-wied.at/static/heatmapjs/docs.html
    heatStyle: {
      radius: 40,
      blur: 0.8
    },
    // 以下为矩形矢量对象的样式参数
    style: {
      opacity: 0.6,
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
      clampToGround: true
    }
  })
  map.addLayer(heatLayer)
}

// 获取bbox矩形区域内的count个随机点
function getRandomPoints(count) {
  const xmin = 117.075718
  const xmax = 117.083508
  const ymin = 31.654645
  const ymax = 31.661744

  const arr = []
  const arrPoint = turf.randomPoint(count, { bbox: [xmin, ymin, xmax, ymax] }).features // 随机点
  for (let i = 0; i < arrPoint.length; i++) {
    const item = arrPoint[i].geometry.coordinates
    const val = Math.floor(Math.random() * 100) // 热力值

    arr.push({ lng: item[0], lat: item[1], value: val })
  }
  return arr
}
