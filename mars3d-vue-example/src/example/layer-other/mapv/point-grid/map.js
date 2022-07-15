import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 创建mapv图层
  createMapvLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function createMapvLayer() {
  // 构造数据
  const positions = []
  const geojson = []
  let randomCount = 300
  while (randomCount--) {
    // 取区域内的随机点
    const point = [random(113 * 1000, 119 * 1000) / 1000, random(28 * 1000, 35 * 1000) / 1000]

    positions.push(Cesium.Cartesian3.fromDegrees(point[0], point[1]))

    geojson.push({
      geometry: {
        type: "Point",
        coordinates: point
      },
      count: 30 * Math.random()
    })
  }
  map.camera.flyTo({
    destination: Cesium.Rectangle.fromCartesianArray(positions)
  })

  // mapv图层参数
  const options = {
    fillStyle: "rgba(55, 50, 250, 0.8)",
    shadowColor: "rgba(255, 250, 50, 1)",
    shadowBlur: 20,
    size: 40,
    globalAlpha: 0.5,
    label: {
      show: true,
      fillStyle: "white"
      // shadowColor: 'yellow',
      // font: '20px Arial',
      // shadowBlur: 10,
    },
    gradient: {
      0.25: "rgb(0,0,255)",
      0.55: "rgb(0,255,0)",
      0.85: "yellow",
      1.0: "rgb(255,0,0)"
    },
    draw: "grid",
    data: geojson // 数据
  }

  // 创建MapV图层
  const mapVLayer = new mars3d.layer.MapVLayer(options)
  map.addLayer(mapVLayer)
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
