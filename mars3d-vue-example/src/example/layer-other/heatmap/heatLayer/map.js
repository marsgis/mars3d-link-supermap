import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 25.873121, lng: 119.290515, alt: 51231, heading: 2, pitch: -71 }
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
  // map.basemap = 2017 // 蓝色底图

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/heat-fuzhou.json" })
    .then(function (result) {
      const arrPoints = []
      for (let i = 0; i < result.Data.length; i++) {
        const item = result.Data[i]
        arrPoints.push({ lng: item.x, lat: item.y, value: item.t0 })
      }
      showHeatMap(arrPoints)
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

function showHeatMap(arrPoints) {
  // 热力图 图层
  const heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    // 以下为热力图本身的样式参数，可参阅api：https://www.patrick-wied.at/static/heatmapjs/docs.html
    max: 20000,
    heatStyle: {
      radius: 20,
      minOpacity: 0,
      maxOpacity: 0.4,
      blur: 0.3,
      gradient: {
        0: "#e9ec36",
        0.25: "#ffdd2f",
        0.5: "#fa6c20",
        0.75: "#fe4a33",
        1: "#ff0000"
      }
    },
    // 以下为矩形矢量对象的样式参数
    style: {
      opacity: 1.0
      // clampToGround: true,
    },
    flyTo: true
  })
  map.addLayer(heatLayer)

  map.on(mars3d.EventType.mouseMove, (e) => {
    const point = mars3d.LngLatPoint.fromCartesian(e.cartesian)
    const data = heatLayer.getPointData(point)

    const inhtml = `
      经度: ${point.lng} <br />
      纬度: ${point.lat} <br />
      X值: ${data.x} <br />
      Y值: ${data.y} <br />
      value值: ${data.value} <br />
      颜色:<span style="background-color: ${data.color};padding:2px 5px;">${data.color}</span>
      `
    map.openSmallTooltip(e.windowPosition, inhtml)
  })
}
