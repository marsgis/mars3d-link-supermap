import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.589203, lng: 120.732051, alt: 18446, heading: 2, pitch: -49 }
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

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/lineroad.json" })
    .then(function (json) {
      createEchartsLayer(json.data)
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

/**
 * 创建echart图层
 *
 * @param {object} data 后端接口，获取的数据
 * @returns {void} 无
 */
function createEchartsLayer(data) {
  const options = getEchartsOption(data)
  options.depthTest = false // 是否进行计算深度（大数据时，需要关闭）

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
 * @param {object} data 后端接口数据
 * @return {option} 根据获取的数据创建echart图表的数据
 */
function getEchartsOption(data) {
  const option = {
    animation: false,

    visualMap: {
      type: "piecewise",
      left: "right",
      bottom: 46,
      /* pieces: [
                {min: 15}, // 不指定 max，表示 max 为无限大（Infinity）。
                {min: 12, max: 15},
                {min: 9, max: 12},
                {min: 6, max: 9},
                {min: 3, max: 6},
                {max: 3}     // 不指定 min，表示 min 为无限大（-Infinity）。
        ], */
      min: 0,
      max: 15,
      splitNumber: 5,
      maxOpen: true,
      color: ["red", "yellow", "green"],
      textStyle: {
        color: "#ffffff"
      }
    },
    tooltip: {
      formatter: function (params, ticket, callback) {
        return "拥堵指数:" + params.value
      },
      trigger: "item"
    },
    series: [
      {
        type: "lines",
        coordinateSystem: "mars3dMap",
        polyline: true,
        data: data,
        lineStyle: {
          normal: {
            opacity: 1,
            width: 4
          },
          emphasis: {
            width: 6
          }
        },
        effect: {
          show: true,
          symbolSize: 2,
          color: "white"
        }
      }
    ]
  }

  return option
}
