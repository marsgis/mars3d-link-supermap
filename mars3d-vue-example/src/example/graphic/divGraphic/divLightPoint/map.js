import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.314417, lng: 118.82149, alt: 78939, heading: 358, pitch: -46 }
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
  map.basemap = 2017

  // 显示边界
  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "南京市",
    url: "//data.mars3d.cn/file/geojson/areas/320100_full.json",
    symbol: {
      type: "wall",
      styleOptions: {
        diffHeight: 800, // 墙高
        outline: false,
        materialType: mars3d.MaterialType.LineFlow,
        materialOptions: {
          speed: 10, // 速度
          image: "img/textures/fence.png", // 图片
          repeatX: 1, // 重复数量
          axisY: true, // 竖直方向
          color: "#00ffff", // 颜色
          opacity: 0.6 // 透明度
        },
        label: {
          text: "{name}",
          font_size: 18,
          color: "#ffffff",
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 500000,
          distanceDisplayCondition_near: 0,

          position: "center",
          setHeight: 900
        }
      }
    },
    popup: "{name}"
  })
  map.addLayer(geoJsonLayer)

  // 创建DIV数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 显示高校点
function addDemoGraphic1(graphicLayer) {
  const pointColorArr = ["#f33349", "#f79a2c", "#f2fa19", "#95e40c", "#1ffee6"]
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/gaoxiao.json" })
    .then(function (arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i]
        const postions = item["经纬度"].split(",") // 取到经纬度坐标
        if (postions.length !== 2) {
          continue
        }

        const lng = Number(postions[0])
        const lat = Number(postions[1])
        const pointColor = pointColorArr[i % pointColorArr.length]

        const graphic = new mars3d.graphic.DivLightPoint({
          name: item["高校名称"],
          position: Cesium.Cartesian3.fromDegrees(lng, lat),
          style: {
            color: pointColor,
            size: item["主管部门"] === "教育部" ? 15 : 10,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000) // 按视距距离显示
            // label: {
            //   text: item["高校名称"], // 内容
            //   color: "#ffffff"
            // }
          },
          attr: item
        })
        graphicLayer.addGraphic(graphic)
      }
      eventTarget.fire("addTableData", { graphicLayer })
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

// BusineDataLayer 业务数据(通过API接口获取)图层
// function addDemoGraphic2() {
//   const dataLayer = new mars3d.layer.BusineDataLayer({
//     url: "//data.mars3d.cn/file/apidemo/gaoxiao.json",
//     symbol: {
//       type: "divLightPoint",
//       styleOptions: {
//         color: "#f33349",
//         size: 10,
//         distanceDisplayCondition: true,
//         distanceDisplayCondition_far: 200000,
//         distanceDisplayCondition_near: 0
//       }
//     },
//     // 自定义解析坐标
//     formatPosition: (attr, graphic) => {
//       const postion = attr["经纬度"].split(",") // 取到经纬度坐标
//       if (postion.length !== 2) {
//         return null
//       } else {
//         return postion
//       }
//     },
//     popup: "all"
//   })
//   map.addLayer(dataLayer)
// }

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.DivLightPoint({
      position: position,
      style: {
        color: "#f33349"
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "divLightPoint",
    style: {
      color: "#f33349"
    }
  })
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
  })
}

// 绑定右键菜单
export function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        graphic.stopEditing()
        graphicLayer.removeGraphic(graphic)
      }
    }
  ])
}
