import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.808563, lng: 117.187762, alt: 234, heading: 95, pitch: -15 }
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

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  graphicLayer.remove()
  graphicLayer = null
  map = null
}

function addDemoGraphic1() {
  const road = new mars3d.graphic.Road({
    positions: [
      [117.181132, 31.814245, 45.95],
      [117.185542, 31.8125, 43.23],
      [117.190607, 31.810037, 38.95],
      [117.195048, 31.807351, 39.03],
      [117.198338, 31.804961, 39.86],
      [117.201378, 31.802543, 33.1],
      [117.204316, 31.80064, 34.33],
      [117.209094, 31.798011, 33.56],
      [117.212615, 31.796325, 33.75],
      [117.216706, 31.794731, 39.96]
    ],
    style: {
      image: "./img/textures/road.jpg",
      width: 15,
      height: 1
    }
  })
  graphicLayer.addGraphic(road)
}

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

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 315, result.radius)

    const graphic = new mars3d.graphic.Road({
      positions: [pt1, position, pt2],
      style: {
        image: "./img/textures/road.jpg",
        width: result.radius * 0.2,
        height: 30
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 绘制道路
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "road",
    style: {
      image: "./img/textures/road.jpg",
      width: 15,
      height: 1,
      opacity: 1
    }
  })
}
let road
export function getGraphic(GraphicId) {
  road = graphicLayer.getGraphicById(GraphicId)
  return road
}

// 宽发生改变
export function widthChange(value) {
  if (road) {
    road.width = value
  }
}

// 高发生改变
export function heightChange(value) {
  if (road) {
    road.height = value
  }
}




// 清除
export function clearLayer() {
  graphicLayer.clear()
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
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },
    {
      text: "计算长度",
      icon: "fa fa-medium",
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的长度为:" + strDis)
      }
    }
  ])
}
