import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 26.197302, lng: 112.783136, alt: 5933911, heading: 0, pitch: -80 }
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
  const items = [
    {
      level: 1,
      name: "北京",
      label: "beijing",
      value: [116.407395, 39.904211],
      symbol: "",
      symbolSize: [30, 30]
    },
    {
      level: 1,
      symbol: "",
      name: "沈阳",
      label: "langfang",
      category: 0,
      active: true,
      speed: 6,
      value: [122.904763, 41.689105],
      belong: "北京"
    },
    {
      level: 1,
      symbol: "",
      name: "西宁",
      category: 0,
      active: true,
      speed: 6,
      value: [101.4038, 36.8207],
      belong: "北京"
    },
    {
      level: 1,
      symbol: "",
      name: "兰州",
      category: 0,
      active: true,
      speed: 6,
      value: [103.5901, 36.3043],
      belong: "北京"
    },
    {
      level: 1,
      symbol: "",
      name: "杭州",
      category: 0,
      active: true,
      speed: 6,
      value: [119.5313, 29.8773],
      belong: "北京"
    },
    {
      level: 1,
      symbol: "",
      name: "四川",
      category: 0,
      active: true,
      speed: 6,
      value: [103.9526, 30.7617],
      belong: "北京"
    },
    {
      level: 2,
      symbol: "",
      name: "重庆",
      category: 0,
      active: true,
      speed: 6,
      value: [107.7539, 30.1904],
      belong: "四川"
    },
    {
      level: 1,
      symbol: "",
      name: "乌鲁木齐",
      category: 0,
      active: true,
      speed: 6,
      value: [85.865421, 43.452051],
      belong: "北京"
    },
    {
      level: 1,
      symbol: "",
      name: "喀什",
      category: 0,
      active: true,
      speed: 6,
      value: [84.693786, 36.353336],
      belong: "北京"
    },
    {
      level: 1,
      symbol: "",
      name: "温州",
      category: 0,
      active: true,
      speed: 6,
      value: [120.647069, 28.01946],
      belong: "杭州"
    },
    {
      level: 2,
      symbol: "",
      name: "舟山",
      category: 0,
      active: true,
      speed: 6,
      value: [122.2559, 30.2234],
      belong: "杭州"
    }
  ]

  const lineColor = ["#fff", "#f6fb05", "#00fcff"]

  // 城市点位图标
  const symbolList = ["image://img/icon/symbol1.png", "image://img/icon/symbol2.png"]

  // 线上的动态运动点图标
  const pointSymbol = ["image://img/icon/linePoint1.png", "image://img/icon/linePoint2.png"]

  // level = 1的地点添加图标
  items.forEach((el) => {
    el.symbol = symbolList[el.level - 1]
  })

  const dataArr = [[], [], []]
  items.forEach((el) => {
    if (el.belong) {
      items.forEach((element) => {
        if (el.belong === element.name) {
          dataArr[el.level - 1].push([
            {
              coord: element.value
            },
            {
              coord: el.value
            }
          ])
        }
      })
    }
  })

  const seriesOne = [
    {
      type: "effectScatter",
      layout: "none",
      // coordinateSystem: "cartesian2d",
      coordinateSystem: "mars3dMap",
      symbolSize: [20, 20],
      symbolOffset: [0, -10],
      zlevel: 3,
      circular: {
        rotateLabel: true
      },
      label: {
        normal: {
          show: true,
          position: "bottom",
          formatter: "{b}",
          fontSize: 24,
          color: "#fff",
          textBorderColor: "#2aa4e8",
          offset: [0, 20]
        }
      },
      itemStyle: {
        normal: {
          shadowColor: "none"
        }
      },
      data: items
    }
  ]
  const lineSeries = []
  dataArr.forEach((el, index) => {
    lineSeries.push({
      name: "",
      type: "lines",
      // coordinateSystem: "cartesian2d",
      coordinateSystem: "mars3dMap",
      zlevel: 1,
      effect: {
        show: true,
        smooth: false,
        trailLength: 0,
        symbol: pointSymbol[index],
        symbolSize: [10, 30],
        period: 4
      },

      lineStyle: {
        width: 2,
        color: lineColor[index],
        curveness: -0.2
      },
      data: el
    })
  })

  const seriesData = seriesOne.concat(lineSeries)

  const option = {
    animation: false,
    // backgroundColor: '#000',

    series: seriesData
  }
  return option
}
