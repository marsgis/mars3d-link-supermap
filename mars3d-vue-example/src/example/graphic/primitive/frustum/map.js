import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
let graphicFrustum

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.808451, lng: 116.295952, alt: 15993, heading: 2, pitch: -29 }
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
  const position = [116.359147, 30.990366, 6000]

  // 加个飞机
  const graphicFJ = new mars3d.graphic.ModelPrimitive({
    position: position,
    style: {
      url: "//data.mars3d.cn/gltf/mars/feiji.glb",
      scale: 1,
      minimumPixelSize: 50,
      heading: 150
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphicFJ)

  // 四凌锥追踪体
  graphicFrustum = new mars3d.graphic.FrustumPrimitive({
    position: position,
    targetPosition: [116.317411, 30.972581, 1439.7], // 可选
    style: {
      angle: 10,
      // length: 4000, //targetPosition存在时无需传
      color: "#02ff00",
      opacity: 0.4,
      outline: true,
      outlineColor: "#ffffff",
      outlineOpacity: 1.0
    }
  })
  graphicLayer.addGraphic(graphicFrustum)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.FrustumPrimitive({
    position: [116.25813, 30.983059, 5000],
    style: {
      angle: 7,
      length: 4000,
      color: "#FF0000",
      opacity: 0.4,
      outline: true,
      outlineColor: "#ffffff",
      outlineOpacity: 1.0,

      label: { text: "鼠标移入会高亮", pixelOffsetY: -30 },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3(graphicLayer) {
  // 加个卫星
  const graphicFJ = new mars3d.graphic.ModelPrimitive({
    position: [116.303349, 31.070789, 7000],
    style: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 50,
      heading: 70
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphicFJ)

  const graphic = new mars3d.graphic.FrustumPrimitive({
    position: [116.303349, 31.070789, 7000],
    style: {
      angle: 10,
      angle2: 0.01,
      length: 7000,
      heading: 70,
      color: "#00ffff",
      opacity: 0.7
    }
  })
  graphicLayer.addGraphic(graphic)
}

// 追踪目标点
export function onClickSelPoint() {
  map.graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 8,
      color: "#ffff00"
    },
    success: function (graphic) {
      const position = graphic.positionShow
      map.graphicLayer.clear()

      graphicFrustum.targetPosition = position
    }
  })
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 1000)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.FrustumPrimitive({
      position: position,
      style: {
        angle: 10,
        angle2: 5,
        length: result.radius * 2,
        heading: Math.random() * 100,
        pitch: 40,
        color: Cesium.Color.fromRandom({ alpha: 0.6 })
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
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

// 开始绘制
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "frustum",
    style: {
      angle: 10,
      angle2: 5,
      length: 1000,
      color: "#00ffff",
      opacity: 0.7
    }
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
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}
