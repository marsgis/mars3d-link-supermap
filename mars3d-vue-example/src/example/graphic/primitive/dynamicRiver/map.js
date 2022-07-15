import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 图层

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.422407, lng: 115.820222, alt: 3498, heading: 67, pitch: -32 },
    globe: {
      depthTestAgainstTerrain: true
    }
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
  map = null
  clear()
}

// 立体围墙扩散效果,面状
function addDemoGraphic1() {
  const dynamicRiver = new mars3d.graphic.DynamicRiver({
    positions: [
      [115.906607, 30.441582, 555.9],
      [115.899964, 30.438543, 467.3],
      [115.893105, 30.440714, 374.6],
      [115.88362, 30.443924, 340.7],
      [115.873948, 30.444827, 299],
      [115.864003, 30.442111, 292.2],
      [115.850741, 30.438108, 189.9]
    ],
    style: {
      image: "./img/textures/poly-rivers.png",
      width: 280,
      height: 30,
      speed: 10
    }
  })
  graphicLayer.addGraphic(dynamicRiver)
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

    const graphic = new mars3d.graphic.DynamicRiver({
      positions: [pt1, position, pt2],
      style: {
        image: "./img/textures/poly-rivers.png",
        width: 280,
        height: 30,
        speed: 10
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
    type: "dynamicRiver",
    style: {
      image: "./img/textures/poly-rivers.png",
      width: 280,
      height: 30,
      speed: 10
    }
  })
}

let dynamicRiver
export function getGraphic(graphicId) {
  dynamicRiver = graphicLayer.getGraphicById(graphicId)
  return dynamicRiver
}

// 宽发生改变
export function widthChange(value) {
  if (dynamicRiver) {
    dynamicRiver.width = value
  }
}

// 高发生改变
export function heightChange(value) {
  if (dynamicRiver) {
    dynamicRiver.height = value
  }
}

// 速度发生改变
export function speedChange(value) {
  if (dynamicRiver) {
    dynamicRiver.speed = value
  }
}

let onOff = true
// 升高30米动画
export function addHeight() {
  if (!dynamicRiver) {
    return
  }
  if (!onOff) {
    globalMsg("上次操作未完成")
    return
  }
  dynamicRiver.offsetHeight(30, 5) // 5秒内抬高30米
  throttle()
}

// 下降30米动画
export function lowerHeight() {
  if (!dynamicRiver) {
    return
  }
  if (!onOff) {
    globalMsg("上次操作未完成")
    return
  }
  dynamicRiver.offsetHeight(-30, 5) // 5秒内降低30米
  throttle()
}

function throttle() {
  setTimeout(() => {
    onOff = true
  }, 2000)

  onOff = false
}

// 清除
export function clear() {
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
    }
  ])
}
