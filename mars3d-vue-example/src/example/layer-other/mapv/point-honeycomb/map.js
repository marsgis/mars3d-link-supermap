import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: -24.347273, lng: 140.716348, alt: 5849790, heading: 337, pitch: -64 }
  }
}

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
    max: 100,
    size: 50,
    label: {
      show: true,
      fillStyle: "white"
    },
    globalAlpha: 0.5,
    gradient: {
      0.25: "rgb(0,0,255)",
      0.55: "rgb(0,255,0)",
      0.85: "yellow",
      1.0: "rgb(255,0,0)"
    },
    draw: "honeycomb",
    data: geojson // 数据
  }

  // 创建MapV图层
  const mapVLayer = new mars3d.layer.MapVLayer(options)
  map.addLayer(mapVLayer)

  mapVLayer.on("click", function (event) {
    console.log("单击了图层", event)
  })
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
