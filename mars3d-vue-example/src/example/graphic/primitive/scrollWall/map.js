import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.779398, lng: 117.314306, alt: 5949, heading: 340, pitch: -39 }
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

  map.basemap = 2017 // 蓝色底图

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
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  // 走马灯围墙效果
  const scrollWall = new mars3d.graphic.ScrollWall({
    positions: [
      [117.268479, 31.836646, 25.53],
      [117.282362, 31.827581, 34.28],
      [117.275399, 31.813784, 30.59],
      [117.256533, 31.817975, 31.95],
      [117.254811, 31.830772, 35.99]
    ],
    style: {
      diffHeight: 500, // 高度
      color: "#f2fa19",
      speed: 10,
      reverse: false, // 方向：true往上、false往下

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        color: "#ff0000"
      }
    },
    attr: { remark: "示例1", xiaoguo: "鼠标移入时展示高亮效果" }
  })
  graphicLayer.addGraphic(scrollWall)
}

function addDemoGraphic2(graphicLayer) {
  // 走马灯围墙效果
  const scrollWall = new mars3d.graphic.ScrollWall({
    positions: [
      [117.269712, 31.883547, 22.12],
      [117.303505, 31.881174, 16.89],
      [117.297216, 31.852026, 15.2],
      [117.270889, 31.854476, 21.75]
    ],
    style: {
      diffHeight: 500, // 高度
      color: "#00ff00",
      speed: 10,
      reverse: true // 方向：true往上、false往下
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(scrollWall)
}

function addDemoGraphic3(graphicLayer) {
  // 走马灯围墙效果
  const scrollWall = new mars3d.graphic.ScrollWall({
    positions: [
      [117.319966, 31.842082, 12.29],
      [117.330034, 31.835286, 11.07],
      [117.330576, 31.823452, 11.01],
      [117.311457, 31.821023, 17.11],
      [117.308954, 31.828975, 16.29]
    ],
    style: {
      diffHeight: 500, // 高度
      color: "#f33349",
      style: 2, // 效果2，默认是1
      speed: 10
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(scrollWall)
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

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 0, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 72, result.radius)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 144, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 216, result.radius)
    const pt5 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 288, result.radius)

    const graphic = new mars3d.graphic.ScrollWall({
      positions: [pt1, pt2, pt3, pt4, pt5],
      style: {
        diffHeight: result.radius,
        color: Cesium.Color.fromRandom({ alpha: 0.6 }),
        style: j % 2,
        reverse: j % 1 // 方向：true往上、false往下
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
    type: "scrollWall",
    style: {
      color: "#55ff33",
      opacity: 0.8,
      diffHeight: 800,
      reverse: false, // 方向：true往上、false往下
      speed: 10
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
    },
   {
      text: "计算围合面积",
      icon: "fa fa-reorder",
      show: (event) => {
        return event.graphic?.positionsShow?.length > 2
      },
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("该对象的面积为:" + strArea)
      }
    }
  ])
}
