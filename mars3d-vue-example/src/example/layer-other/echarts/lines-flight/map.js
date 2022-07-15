import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: -0.357253, lng: 85.510429, alt: 18716757, heading: 0, pitch: -90 },
    sceneMode: 2 // 2d地图展示
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
  map.basemap = "蓝色底图"

  // 创建Echarts图层
  createEchartsLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function createEchartsLayer() {
  const options = getEchartsOption()
  const echartsLayer = new mars3d.layer.EchartsLayer(options)
  map.addLayer(echartsLayer)

  // 图表自适应
  window.addEventListener("resize", function () {
    echartsLayer.resize()
  })
}

/**
 *echart图层
 *
 * @return {option} echart图表的数据
 */
function getEchartsOption() {
  const options = {
    animation: false,

    visualMap: { min: 0, max: 15, bottom: "5%", right: "5%", itemHeight: 30, show: true },
    series: [
      {
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        showEffectOn: "render",
        zlevel: 0,
        rippleEffect: { period: 15, scale: 4, brushType: "fill" },
        label: { normal: { show: true, formatter: "{b}", position: "top", offset: [5, 0], color: "#1DE9B6" }, emphasis: { show: true } },
        symbol: "circle",
        itemStyle: { normal: { show: true, shadowBlur: 10, shadowColor: "#333" } },
        data: [
          { key: "中国", name: "中国", latitudeAndLongitude: "110.094854,34.525002", counts: 15, value: [110.094854, 34.525002, 15] },
          { key: "澳大利亚", name: "澳大利亚", latitudeAndLongitude: "150.993137,-33.675509", counts: 6, value: [150.993137, -33.675509, 6] },
          { key: "蒙古", name: "蒙古", latitudeAndLongitude: "106.731711, 48.056936", counts: 3, value: [106.731711, 48.056936, 3] },
          { key: "泰国", name: "泰国", latitudeAndLongitude: "100.52901, 13.814341", counts: 3, value: [100.52901, 13.814341, 3] },
          { key: "韩国", name: "韩国", latitudeAndLongitude: "126.928257, 37.617069", counts: 3, value: [126.928257, 37.617069, 3] },
          { key: "匈牙利", name: "匈牙利", latitudeAndLongitude: "17.108519,48.179162", counts: 3, value: [17.108519, 48.179162, 3] },
          { key: "阿联酋", name: "阿联酋", latitudeAndLongitude: "55.269441,25.204514", counts: 3, value: [55.269441, 25.204514, 3] }
        ]
      },
      {
        type: "lines",
        coordinateSystem: "mars3dMap",
        zlevel: 0,
        effect: { show: true, period: 4, trailLength: 0.2, symbol: "arrow", symbolSize: 5 },
        lineStyle: { normal: { width: 1, opacity: 1, curveness: 0.3 } },
        data: [
          {
            coords: [
              [17.108519, 48.179162],
              [55.269441, 25.204514]
            ],
            value: 1
          },
          {
            coords: [
              [150.993137, -33.675509],
              [126.928257, 37.617069]
            ],
            value: 1
          },
          {
            coords: [
              [55.269441, 25.204514],
              [110.094854, 34.525002]
            ],
            value: 1
          },
          {
            coords: [
              [150.993137, -33.675509],
              [110.094854, 34.525002]
            ],
            value: 1
          },
          {
            coords: [
              [110.094854, 34.525002],
              [106.731711, 48.056936]
            ],
            value: 1
          },
          {
            coords: [
              [126.928257, 37.617069],
              [17.108519, 48.179162]
            ],
            value: 1
          },
          {
            coords: [
              [106.731711, 48.056936],
              [100.52901, 13.814341]
            ],
            value: 1
          },
          {
            coords: [
              [100.52901, 13.814341],
              [150.993137, -33.675509]
            ],
            value: 1
          }
        ]
      }
    ]
  }
  return options
}
