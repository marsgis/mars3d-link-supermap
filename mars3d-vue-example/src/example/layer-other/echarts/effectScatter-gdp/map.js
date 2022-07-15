import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 13.474941, lng: 117.364073, alt: 2774097, heading: 6, pitch: -62 }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let echartsLayer
export function createEchartsLayer(val) {
  const options = getEchartsOption()
  options.clampToGround = true // 计算贴地高度

  options.pointerEvents = val

  echartsLayer = new mars3d.layer.EchartsLayer(options)
  map.addLayer(echartsLayer)

  window.addEventListener("resize", function () {
    echartsLayer.resize()
  })
}

// 启用echars交互
export function chkPointerEvents(val) {
  echartsLayer.pointerEvents = val
}

/**
 *echart图层
 *
 * @return {option} echart图表的数据
 */
function getEchartsOption() {
  const data = [
    {
      name: "上海",
      value: 19780
    },
    {
      name: "珠海",
      value: 2186
    },
    {
      name: "三亚",
      value: 1135
    },
    {
      name: "惠州",
      value: 1973
    },
    {
      name: "海口",
      value: 2568
    },
    {
      name: "合肥",
      value: 4039
    },
    {
      name: "南京",
      value: 6959
    },
    {
      name: "杭州",
      value: 5632
    },
    {
      name: "苏州",
      value: 6707
    },
    {
      name: "无锡",
      value: 3393
    },
    {
      name: "昆山",
      value: 1894
    },
    {
      name: "广州",
      value: 15769
    },
    {
      name: "深圳",
      value: 8259
    },
    {
      name: "佛山",
      value: 5741
    },
    {
      name: "东莞",
      value: 3030
    },
    {
      name: "福州",
      value: 4542
    },
    {
      name: "厦门",
      value: 3329
    },
    {
      name: "南宁",
      value: 3157
    },
    {
      name: "郑州",
      value: 6690
    },
    {
      name: "武汉",
      value: 8678
    },
    {
      name: "长沙",
      value: 5303
    },
    {
      name: "南昌",
      value: 3025
    },
    {
      name: "北京",
      value: 20259
    },
    {
      name: "长春",
      value: 3016
    },
    {
      name: "大连",
      value: 3202
    },
    {
      name: "沈阳",
      value: 4540
    },
    {
      name: "哈尔滨",
      value: 3141
    },
    {
      name: "天津",
      value: 8626
    },
    {
      name: "济南",
      value: 4361
    },
    {
      name: "青岛",
      value: 6667
    },
    {
      name: "太原",
      value: 4080
    },
    {
      name: "石家庄",
      value: 6137
    },
    {
      name: "西安",
      value: 6991
    },
    {
      name: "成都",
      value: 13873
    },
    {
      name: "重庆",
      value: 13283
    },
    {
      name: "昆明",
      value: 4633
    }
  ]

  const geoCoordMap = {
    上海: [121.48, 31.22],
    珠海: [113.52, 22.3],
    三亚: [109.31, 18.14],
    惠州: [114.4, 23.09],
    海口: [110.35, 20.02],
    合肥: [117.27, 31.86],
    南京: [118.78, 32.04],
    杭州: [120.19, 30.26],
    苏州: [120.62, 31.32],
    无锡: [120.29, 31.59],
    昆山: [120.95, 31.39],
    广州: [113.23, 23.16],
    深圳: [114.07, 22.62],
    佛山: [113.11, 23.05],
    东莞: [113.75, 23.04],
    福州: [119.3, 26.08],
    厦门: [118.1, 24.46],
    南宁: [108.33, 22.84],
    郑州: [113.65, 34.76],
    武汉: [114.31, 30.52],
    长沙: [113, 28.21],
    南昌: [115.89, 28.68],
    北京: [116.46, 39.92],
    长春: [125.35, 43.88],
    大连: [121.62, 38.92],
    沈阳: [123.38, 41.8],
    哈尔滨: [126.63, 45.75],
    天津: [117.2, 39.13],
    济南: [117, 36.65],
    青岛: [120.33, 36.07],
    太原: [112.53, 37.87],
    石家庄: [114.48, 38.03],
    西安: [108.95, 34.27],
    成都: [104.06, 30.67],
    重庆: [106.54, 29.59],
    昆明: [102.73, 25.04]
  }

  // 在echart图表中展示图点
  const convertData = function (data) {
    const res = []
    for (let i = 0; i < data.length; i++) {
      const geoCoord = geoCoordMap[data[i].name]
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value)
        })
      }
    }
    return res
  }

  // 图表的数字从大到小向下排序
  data.sort(function (a, b) {
    return a.value - b.value
  })

  const categoryData = []
  const barData = []
  let sum = 0
  const count = data.length

  for (let i = 0; i < count; i++) {
    categoryData.push(data[i].name)
    barData.push(data[i].value)
    sum += data[i].value
  }

  const option = {
    animation: false,
    backgroundColor: "rgba(17, 19, 42, 0.3)",
    title: [
      {
        text: "散点图态势",
        subtext: "san dian tu taishi",
        left: "center",
        textStyle: {
          color: "#fff"
        },
        subtextStyle: {
          color: "yellow",
          fontWeight: "bold"
        }
      },
      {
        id: "statistic",
        text: count ? "平均: " + parseInt((sum / count).toFixed(4)) : "",
        right: 120,
        top: 40,
        width: 100,
        textStyle: {
          color: "#fff"
        },
        fontSize: 16
      }
    ],

    tooltip: {
      trigger: "item"
    },
    grid: {
      right: 40,
      top: 100,
      bottom: 40,
      width: "30%"
    },
    xAxis: {
      type: "value",
      scale: true,
      position: "top",
      boundaryGap: false,
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        margin: 2,
        color: "#aaa"
      }
    },
    yAxis: {
      type: "category",
      nameGap: 16,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#ddd"
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#ddd"
        }
      },
      axisLabel: {
        interval: 0,
        color: "#ddd"
      },
      data: categoryData
    },
    series: [
      {
        // 散点图
        type: "scatter",
        coordinateSystem: "mars3dMap",
        data: convertData(data),
        symbolSize: function (val) {
          const size = (val[2] / 500) * 1.5
          return Math.max(size, 8)
        },
        label: {
          formatter: "{b}",
          position: "right",
          show: false
        },
        itemStyle: {
          color: "#FF8C00",
          position: "right",
          show: true
        }
      },
      {
        // 特效散点图
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        data: convertData(data),
        symbolSize: function (val) {
          const size = val[2] / 500
          return Math.max(size, 8)
        },
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke"
        },
        hoverAnimation: true,
        label: {
          formatter: "{b}",
          position: "right",
          color: "inherit",
          show: true
        },
        itemStyle: {
          color: "#f4e925",
          shadowBlur: 50,
          shadowColor: "#EE0000"
        },
        zlevel: 1
      },
      {
        id: "bar",
        zlevel: 2,
        type: "bar",
        symbol: "none",
        itemStyle: {
          color: "#ddb926"
        },
        data: data
      }
    ]
  }

  return option
}
