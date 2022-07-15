import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.808307, lng: 110.597446, alt: 7852846, heading: 353, pitch: -86 }
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

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/weibo.json" })
    .then(function (json) {
      // 创建Mapv
      createMapvLayer(json)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function createMapvLayer(rs) {
  const data1 = []
  const data2 = []
  const data3 = []
  for (let i = 0; i < rs[0].length; i++) {
    const geoCoord = rs[0][i].geoCoord
    data1.push({
      geometry: {
        type: "Point",
        coordinates: geoCoord
      }
    })
  }

  for (let i = 0; i < rs[1].length; i++) {
    const geoCoord = rs[1][i].geoCoord
    data2.push({
      geometry: {
        type: "Point",
        coordinates: geoCoord
      },
      time: Math.random() * 10
    })
  }

  for (let i = 0; i < rs[2].length; i++) {
    const geoCoord = rs[2][i].geoCoord
    data3.push({
      geometry: {
        type: "Point",
        coordinates: geoCoord
      }
    })
  }

  const animation = {
    animation: {
      stepsRange: {
        start: 0,
        end: 10
      },
      trails: 1,
      duration: 6
    }
  }
  addMapvLayer(data1, "rgba(200, 200, 0, 0.8)", 0.7)
  addMapvLayer(data2, "rgba(255, 250, 0, 0.8)", 0.7)
  addMapvLayer(data3, "rgba(255, 250, 250, 0.6)", 0.7)
  addMapvLayer(data2, "rgba(255, 250, 250, 0.9)", 1.1, animation)
}

function addMapvLayer(data, color, size, animation) {
  const options1 = {
    fillStyle: color,
    bigData: "Point",
    size: size,
    draw: "simple",
    depthTest: false,
    ...animation,
    data: data // 数据
  }
  // 创建MapV图层
  const mapVLayer = new mars3d.layer.MapVLayer(options1)
  map.addLayer(mapVLayer)
}
