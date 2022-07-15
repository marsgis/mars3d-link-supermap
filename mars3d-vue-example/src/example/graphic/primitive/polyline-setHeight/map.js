import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 39.800803, lng: 116.34344, alt: 6521, heading: 0, pitch: -45 }
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

  map.basemap = "黑色底图"

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addDemoGraphics(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphics(graphicLayer) {
  // 颜色
  const colors = ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"].reverse()

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/bj-bus.json" })
    .then(function (res) {
      const arr = mars3d.Util.geoJsonToGraphics(res) // 解析geojson
      arr.forEach((item, index) => {
        const i = index % colors.length

        const color = colors[i]
        const height = i * 80 + 50

        const graphic = new mars3d.graphic.PolylinePrimitive({
          positions: item.positions,
          style: {
            width: 3,
            color: color,
            opacity: 0.8,
            setHeight: height
          },
          attr: item.attr
        })
        graphicLayer.addGraphic(graphic)
      })
    })
    .catch(function (error) {
      console.log("获取单个卡车详情失败", error)
    })
}
