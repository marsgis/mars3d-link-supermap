import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.752136, lng: 117.269021, alt: 3782, heading: 338, pitch: -23 }
  },
  terrain: { show: false }
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

  globalMsg("文件数据较大，正在加载数据，请稍等片刻……")
  showLoading()

  const colorHash = {
    10: "#FFEDA0",
    15: "#FED976",
    20: "#FEB24C",
    25: "#FD8D3C",
    30: "#FC4E2A",
    35: "#E31A1C",
    40: "#BD0026",
    450000: "#800026"
  }

  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "建筑物面",
    url: "//data.mars3d.cn/file/geojson/buildings-hf.json",
    symbol: {
      type: "polygonC", // 大数据面类型，效率高
      styleOptions: {
        color: "#0d3685",
        opacity: 1.0,
        outline: false
      },
      callback: function (attr, styleOpt) {
        const floor = Number(attr.floor || 1)
        const diffHeight = floor * 5
        for (const key in colorHash) {
          if (floor <= parseInt(key)) {
            return { height: 0, diffHeight: diffHeight, color: colorHash[key] }
          }
        }
        return { height: 0, diffHeight: diffHeight }
      }
    },
    popup: "all"
  })
  map.addLayer(geoJsonLayer)

  // 绑定事件
  geoJsonLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)

    hideLoading() // 关闭
  })

  // 在layer上绑定监听事件
  geoJsonLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.graphic.attr
    console.log("单击了合并对象中的单个值为", pickedItem)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
