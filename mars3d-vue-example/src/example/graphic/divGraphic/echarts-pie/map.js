import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 32.246011, lng: 119.666969, alt: 317736, heading: 0, pitch: -90 }
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

  // 创建div图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const arrData = [
    {
      name: "南通市",
      totalLength: 233991,
      deepUsedLength: 51077,
      deepUnUsedLength: 131008,
      unDeepUsedLength: 28579,
      unDeepUnUsedLength: 23327,
      lng: 120.8372039,
      lat: 32.000300065
    },
    {
      name: "南京市",
      totalLength: 91025,
      deepUsedLength: 36909,
      deepUnUsedLength: 12551,
      unDeepUsedLength: 28251,
      unDeepUnUsedLength: 13313,
      lng: 118.735996333,
      lat: 32.089238239
    },
    {
      name: "镇江市",
      totalLength: 147431,
      deepUsedLength: 35499,
      deepUnUsedLength: 52026,
      unDeepUsedLength: 18359,
      unDeepUnUsedLength: 41547,
      lng: 119.615400712,
      lat: 32.182042328
    },
    {
      name: "扬州市",
      totalLength: 49649,
      deepUsedLength: 30245,
      deepUnUsedLength: 9140,
      unDeepUsedLength: 8164,
      unDeepUnUsedLength: 2101,
      lng: 119.399151815,
      lat: 32.271322643
    },
    {
      name: "常州市",
      totalLength: 9849,
      deepUsedLength: 3484,
      deepUnUsedLength: 836,
      unDeepUsedLength: 4115,
      unDeepUnUsedLength: 1415,
      lng: 119.984267562,
      lat: 31.971521771
    },
    {
      name: "江阴市",
      totalLength: 23570,
      deepUsedLength: 22365,
      deepUnUsedLength: 1205,
      unDeepUsedLength: 0,
      unDeepUnUsedLength: 0,
      lng: 120.329215931,
      lat: 31.927882063
    }
  ]
  showDivGraphic(arrData)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function showDivGraphic(arr) {
  for (let i = 0; i < arr.length; i++) {
    const deepUnUsed = arr[i].deepUnUsedLength // 国道
    const deepUsed = arr[i].deepUsedLength // 县道
    const total = arr[i].totalLength // 中间显示
    const unDeepUnUsed = arr[i].unDeepUnUsedLength // 铁路
    const unDeepUsed = arr[i].unDeepUsedLength // 高速
    const cityName = arr[i].name // 城市名字
    const point = [arr[i].lng, arr[i].lat] // 位置

    // 白色背景
    const backGroundGraphic = new mars3d.graphic.DivGraphic({
      position: point,
      style: {
        html: '<div style="width:60px;height:60px;border-radius: 50%;background-color: #ffffff; position: relative;"></div>',
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      }
    })
    graphicLayer.addGraphic(backGroundGraphic)

    // div
    const graphic = new mars3d.graphic.DivGraphic({
      position: point,
      style: {
        html: '<div style="width: 100px;height:100px;"></div>',
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      },
      pointerEvents: true
    })
    graphic.on(mars3d.EventType.add, function (e) {
      const dom = e.target.container.firstChild
      const attr = e.target.attr

      const chartChart = echarts.init(dom)

      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}km </br>占比 : {d}%",
          backgroundColor: "rgba(63, 72, 84, 0.7)",
          textStyle: {
            color: "#ffffff"
          }
        },
        title: {
          text: total + "\n Km",
          x: "center",
          y: "center",
          textStyle: {
            fontSize: 14
          }
        },
        color: ["#334b5c", "#6ab0b8", "#d48265", "#c23531"],
        series: [
          {
            name: cityName,
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "40",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: deepUnUsed, name: "国道" },
              { value: deepUsed, name: "县道" },
              { value: unDeepUnUsed, name: "铁路" },
              { value: unDeepUsed, name: "高速" }
            ]
          }
        ]
      }

      chartChart.setOption(option)
    })
    graphicLayer.addGraphic(graphic)
  }
}
