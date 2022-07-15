import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 18.188973, lng: 112.70603, alt: 5647407, heading: 352, pitch: -76 }
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
  // options.pointerEvents = true // 使用单击

  const echartsLayer = new mars3d.layer.EchartsLayer(options)
  map.addLayer(echartsLayer)

  if (options.pointerEvents) {
    echartsLayer.on("click", function (event) {
      console.log("单击了图层", event)
    })
  }

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
  const beijinCoord = [116.407395, 39.904211]

  const geoCoorddata = {
    合肥: [117.399043, 31.741401],
    深圳: [114.057865, 22.543096],
    乌鲁木齐: [87.405386, 41.779595]
  }

  const symbolPoint = "image://img/icon/symbol1.png"
  const linePoint = "image://img/icon/linePoint1.png"

  const pointArr = []
  for (const key in geoCoorddata) {
    pointArr.push({
      name: key,
      value: geoCoorddata[key],
      symbol: symbolPoint
    })
  }

  const option = {
    animation: false,

    series: [
      {
        name: "",
        type: "lines",
        coordinateSystem: "mars3dMap",
        zlevel: 1,
        data: [
          {
            name: "合肥",
            toname: "北京",
            coords: [geoCoorddata["合肥"], beijinCoord]
          },
          {
            name: "深圳",
            toname: "北京",
            coords: [geoCoorddata["深圳"], beijinCoord]
          },
          {
            name: "乌鲁木齐",
            toname: "北京",
            coords: [geoCoorddata["乌鲁木齐"], beijinCoord]
          }
        ],
        // 线上面的动态特效
        effect: {
          show: true,
          smooth: false,
          trailLength: 0,
          symbol: linePoint,
          symbolSize: [10, 30],
          period: 4
        },
        lineStyle: {
          normal: {
            width: 1,
            color: "#ffffff",
            curveness: 0.2
          }
        }
      },
      {
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        zlevel: 3,
        data: [
          {
            name: "北京",
            value: beijinCoord.concat(200)
          }
        ],
        rippleEffect: {
          period: 10,
          scale: 5,
          brushType: "fill"
        }
      },
      {
        type: "effectScatter",
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
            fontSize: 18,
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
        data: pointArr
      }
    ]
  }
  return option
}
