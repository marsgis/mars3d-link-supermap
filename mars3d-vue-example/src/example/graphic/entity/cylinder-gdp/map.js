import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.286465, lng: 117.620524, alt: 510892, heading: 358, pitch: -50 }
  },
  layers: [
    {
      id: 1987,
      type: "geojson",
      name: "淮海经济区11市",
      url: "//data.mars3d.cn/file/geojson/huaihai.json",
      symbol: {
        styleOptions: {
          materialType: mars3d.MaterialType.PolyGradient,
          materialOptions: {
            color: "#3388cc",
            opacity: 0.7,
            alphaPower: 1.3
          },
          height: 0,
          diffHeight: "{gdp}"
        },
        styleField: "Name",
        styleFieldOptions: {
          济宁市: { materialOptions: { color: "#D4AACE" } },
          临沂市: { materialOptions: { color: "#8DC763" } },
          菏泽市: { materialOptions: { color: "#F7F39A" } },
          枣庄市: { materialOptions: { color: "#F7F39A" } },
          徐州市: { materialOptions: { color: "#96F0F1" } },
          宿迁市: { materialOptions: { color: "#EAC9A8" } },
          连云港市: { materialOptions: { color: "#F7F39A" } },
          商丘市: { materialOptions: { color: "#D4AACE" } },
          宿州市: { materialOptions: { color: "#8DC763" } },
          亳州市: { materialOptions: { color: "#96F0F1" } },
          淮北市: { materialOptions: { color: "#EAC9A8" } }
        }
      },
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  map.basemap = 2017 // 蓝色底图

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/huaihai-jj.json" })
    .then(function (res) {
      conventChartsData(res.data) // 单击显示的popup
      showYearZT(res.data) // 柱状图
      bindHaihuaiPopup()
    })
    .catch(function () {
      globalMsg("获取信息失败，请稍候再试")
    })

  map.on(mars3d.EventType.load, function (event) {
    console.log("矢量数据对象加载完成", event)
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
 * 展示某年的椎体
 *
 * @param {object} data 通过JSON获取的数据
 * @returns {void} 无
 */
function showYearZT(data) {
  const yearArr = Object.keys(data)
  const arr = data[yearArr[0]]

  for (let i = 0; i < arr.length; i += 1) {
    const attr = arr[i]
    const jwd = getJWDByName(attr.name)

    const num1 = attr["第一产业"]
    const num2 = attr["第二产业"]
    const num3 = attr["第三产业"]
    const numall = Number(num1 + num2 + num3).toFixed(2)
    const html = `${attr.name}<br/>
                  <span style="color:#63AEFF">第一产业：${num1}</span><br/>
                  <span style="color:#FFB861">第二产业：${num2}</span><br/>
                  <span style="color:#FF6D5D">第三产业：${num3}</span>`

    const height1 = Math.floor(num1 * 10)
    const height2 = Math.floor(num2 * 10)
    const height3 = Math.floor(num3 * 10)

    const p1 = Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height3 / 2)
    const p2 = Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height3 + height2 / 2)
    const p3 = Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height3 + height2 + height1 / 2)

    // 添加柱体
    createZT(p1, height3, "#63AEFF", html)
    createZT(p2, height2, "#FFB861", html)
    createZT(p3, height1, "#FF6D5D", html)

    // 添加文字
    const graphic = new mars3d.graphic.LabelPrimitive({
      position: Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height1 + height2 + height3),
      style: {
        text: numall,
        font_size: 18,
        font_family: "楷体",
        color: "#00ff00",
        outline: true,
        outlineColor: "#000000",
        outlineWidth: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -20)
      }
    })
    graphicLayer.addGraphic(graphic)
    graphic.bindTooltip(html)
  }
}

//  创建柱体
function createZT(position, len, color, html) {
  const graphic = new mars3d.graphic.CylinderEntity({
    position: position,
    style: {
      length: len,
      topRadius: 6000.0,
      bottomRadius: 6000.0,
      color: color
    }
  })
  graphicLayer.addGraphic(graphic)

  graphic.bindTooltip(html)

  // graphic._position_show = position
  // graphic._length_show = len
  return graphic
}

const cityPosition = [
  { name: "亳州", jwd: [116.203602, 33.496075] },
  { name: "商丘", jwd: [115.871509, 34.297084] },
  { name: "淮北", jwd: [116.688413, 33.689214] },
  { name: "宿州", jwd: [117.234682, 33.740035] },
  { name: "徐州", jwd: [117.70509, 34.350708] },
  { name: "宿迁", jwd: [118.559349, 33.807355] },
  { name: "连云港", jwd: [118.875445, 34.619808] },
  { name: "临沂", jwd: [118.026908, 35.262767] },
  { name: "枣庄", jwd: [117.320268, 35.072555] },
  { name: "济宁", jwd: [116.856599, 35.500232] },
  { name: "菏泽", jwd: [115.716086, 35.05629] }
]

//  根据名称获取坐标
function getJWDByName(name) {
  for (let i = 0; i < cityPosition.length; i += 1) {
    const item = cityPosition[i]
    if (item.name === name) {
      return item.jwd
    }
  }
  return []
}

//= ===============以下是单击显示的echarst图表的相关代码===============
let arrYear
let objCity = {}

// 转换值
function conventChartsData(arrOld) {
  console.log("转换前数据=>", arrOld)

  arrYear = Object.keys(arrOld) // [年份]

  objCity = {} // 十一个城市对应的各年度数据

  for (let a = 0; a < arrYear.length; a++) {
    const arrCity = arrOld[arrYear[a]] // 指定某年的11个城市对应数据

    // 循环十次
    for (let b = 0; b < arrCity.length; b++) {
      const item = arrCity[b]

      if (!objCity[item.code]) {
        objCity[item.code] = []
      }
      objCity[item.code].push(item.GDP)
    }
  }

  console.log("转换完成的数据=>", objCity)
}

function bindHaihuaiPopup() {
  const layerHuaihai = map.getLayerById(1987) // 获取config.json中对应图层

  // 在layer上绑定Popup单击弹窗
  layerHuaihai.bindPopup(
    `<div class="gdpView">
        <div class="gdpCharts" id="gdpCharts"></div>
        <input type="button" class="btnClosePopup closeButton" value="×" />
      </div>`,
    {
      template: false,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    }
  )

  let gdpCharts
  layerHuaihai.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // popup对应的DOM
    console.log("图层上打开了popup", container)

    const option = getCityChartsOptions(event.graphic.attr)
    if (!option) {
      return
    }

    gdpCharts = echarts.init(container.querySelector("#gdpCharts"))
    gdpCharts.setOption(option)
  })
  layerHuaihai.on(mars3d.EventType.popupClose, function (event) {
    const container = event.container // popup对应的DOM
    console.log("图层上移除了popup", container)

    gdpCharts.dispose()
    gdpCharts = null
  })
}

function getCityChartsOptions(attr) {
  const code = attr.code.slice(0, 4)
  const arrGDPvalues = objCity[code]
  if (!arrGDPvalues) {
    globalMsg(attr.Name + " 无经济数据")
    return
  }

  // arrGDPvalues  是点击的城市的数值,需要以[b,0,value]的方式重新排列
  const arrData = []
  for (let b = 0; b < arrGDPvalues.length; b++) {
    arrData[b] = [b, 0, arrGDPvalues[b]]
  }

  const option = {
    visualMap: {
      max: 4500,
      show: false,
      inRange: {
        color: ["#32C5E9", "#67E0E3", "#FFDB5C", "#37A2DA", "#9FE6B8"]
      }
    },
    title: {
      text: attr.Name + "   近五年GDP（亿元）",
      textStyle: { color: "white", fontSize: "17", fontWidth: "normal" },
      top: "10",
      left: "5"
    },
    tooltip: {
      show: "true",
      trigger: "item",
      showContent: "true",
      position: "top",
      fontSize: "12",
      color: "black",
      formatter: function formatter(params) {
        return "GDP:" + params.data[2]
      }
    },
    // x轴是横向，是时间
    xAxis3D: {
      type: "category",
      data: arrYear,
      nameTextStyle: {
        color: "rgb(0, 0, 0, 0.1)"
      },
      // splitLine不可见时仅仅线不可见
      splitLine: {
        show: false
      }
    },
    // y轴被缩小
    yAxis3D: {
      type: "category",
      data: [" "],
      nameTextStyle: {
        color: "rgb(0, 0, 0, 0.1)"
      },
      splitLine: {
        show: false
      }
    },
    // z轴是gdp的值
    zAxis3D: {
      type: "value",
      name: "GDP",
      axisLine: {
        lineStyle: {
          color: "rgb(0, 0, 0, 0.1)"
        }
      },
      nameTextStyle: {
        color: "white",
        fontSize: "18"
      },
      nameGap: "50"
    },
    grid3D: {
      boxWidth: 180, // 缩大放小x轴
      boxDepth: 10, // 缩大放小y轴
      top: "20",
      // left: '50',
      // 視角的設置
      viewControl: {
        alpha: 8,
        beta: 0,
        distance: 162,
        center: [-20, 0, 0]
      },
      axisLabel: {
        color: "white",
        fontSize: 15
      },
      axisPointer: {
        // 坐标轴指示线，就是鼠标移入时，指向x轴，y轴的线
        show: false
      }
    },
    series: [
      {
        type: "bar3D",
        data: arrData,
        shading: "lambert",
        label: {
          position: "top",
          show: true,
          color: "white"
        },
        emphasis: {
          label: {
            color: "white",
            fontSize: "18"
          }
        }
      }
    ]
  }
  return option
}
