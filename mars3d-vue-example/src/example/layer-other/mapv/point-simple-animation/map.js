import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 21.004037, lng: 107.525781, alt: 10103609, heading: 0, pitch: -83 }
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
  map.basemap = 2017 // 蓝色底图

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/weibo2.json" })
    .then(function (json) {
      // 创建Mapv
      createMapvLayer(json)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })

  globalNotify("已知问题提示", `在视域变化中部分效果（如点的闪烁）没有融合，可根据实际项目决定是否采用此效果。`)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function createMapvLayer(rs) {
  const data = []
  for (let i = 0; i < rs[0].length; i++) {
    const geoCoord = rs[0][i].geoCoord
    data.push({
      geometry: {
        type: "Point",
        coordinates: geoCoord
      },
      time: Math.random() * 10
    })
  }

  const options = {
    fillStyle: "rgba(255, 250, 50, 0.6)",
    // shadowColor: 'rgba(255, 250, 50, 0.5)',
    // shadowBlur: 3,
    updateCallback: function (time) {
      time = time.toFixed(2)
      // $('#time').html('时间' + time)
    },
    size: 3,
    draw: "simple",
    animation: {
      type: "time",
      stepsRange: {
        start: 0,
        end: 10
      },
      trails: 1,
      duration: 6
    },

    data: data // 数据
  }

  // 创建MapV图层
  const mapVLayer = new mars3d.layer.MapVLayer(options)
  map.addLayer(mapVLayer)
}
