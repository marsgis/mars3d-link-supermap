import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.808137, lng: 116.411699, alt: 23221, heading: 347, pitch: -40 },
    clock: {
      currentTime: "2021-07-01 10:45:00"
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
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

// 静态的位置
function addDemoGraphic1(graphicLayer) {
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: [116.327881, 31.018378, 5000],
    targetPosition: [116.311135, 30.998408, 1264.9], // 可选
    style: {
      slices: 4, // 四凌锥
      // length: 4000,//targetPosition存在时无需传
      angle: 5, // 半场角度
      color: "#ff0000",
      opacity: 0.3,

      label: { text: "鼠标移入会高亮" },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(coneTrack)
}

// 静态的位置
let coneTrack
function addDemoGraphic2(graphicLayer) {
  const position = [116.28782, 30.971557, 5000]
  // 加个飞机
  const graphic = new mars3d.graphic.ModelPrimitive({
    position: position,
    style: {
      url: "//data.mars3d.cn/gltf/mars/feiji.glb",
      scale: 1,
      minimumPixelSize: 50
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)

  // 圆锥追踪体
  coneTrack = new mars3d.graphic.ConeTrack({
    position: position,
    // targetPosition: [116.317411, 30.972581, 1439.7], // 可选
    style: {
      length: 4000,
      angle: 5, // 半场角度
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#02ff00"
      }
    }
  })
  graphicLayer.addGraphic(coneTrack)
}

// 修改飞机追踪的目标点
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

      coneTrack.targetPosition = position
    }
  })
}

// 动态的位置
function addDemoGraphic3(graphicLayer) {
  const propertyFJ = getSampledPositionProperty([
    [116.364307, 31.03778, 5000],
    [116.42794, 31.064786, 5000],
    [116.474002, 31.003825, 5000],
    [116.432393, 30.951142, 5000],
    [116.368497, 30.969006, 5000],
    [116.364307, 31.03778, 5000]
  ])

  // 飞机
  const graphicModel = new mars3d.graphic.ModelEntity({
    position: propertyFJ,
    orientation: new Cesium.VelocityOrientationProperty(propertyFJ),
    style: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.3,
      minimumPixelSize: 30
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphicModel)

  // 汽车
  const propertyQC = getSampledPositionProperty([
    [116.391268, 30.956038, 827.2],
    [116.37934, 30.980835, 898.1],
    [116.382514, 30.999031, 921.5],
    [116.40338, 31.009258, 1214],
    [116.412254, 31.021635, 1224.1],
    [116.432328, 31.045508, 804.3]
  ])
  const graphicQC = new mars3d.graphic.PathEntity({
    position: propertyQC,
    orientation: new Cesium.VelocityOrientationProperty(propertyQC),
    style: {
      width: 1,
      color: "#ffff00",
      opacity: 0.4,
      leadTime: 0
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.5,
      minimumPixelSize: 50
    }
  })
  graphicLayer.addGraphic(graphicQC)

  // 圆锥追踪体（动态position=>动态targetPosition）
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: propertyFJ,
    targetPosition: propertyQC,
    style: {
      // length: 4000, //targetPosition存在时无需传
      angle: 3, // 半场角度
      // 自定义扩散波纹纹理
      materialType: mars3d.MaterialType.CylinderWave,
      materialOptions: {
        color: "#ffff00",
        repeat: 30.0,
        thickness: 0.2
      }
    }
  })
  graphicLayer.addGraphic(coneTrack)
}

// 计算演示的SampledPositionProperty轨迹
function getSampledPositionProperty(points) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const start = map.clock.currentTime
  const positions = mars3d.LngLatArray.toCartesians(points)
  for (let i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(start, i * 20, new Cesium.JulianDate())
    const position = positions[i]
    property.addSample(time, position)
  }
  return property
}

function addDemoGraphic4(graphicLayer) {
  const model = new mars3d.graphic.ModelEntity({
    name: "地面站模型",
    position: [117.170264, 31.840312, 258],
    style: {
      url: "//data.mars3d.cn/gltf/mars/leida.glb",
      scale: 1,
      minimumPixelSize: 40,
      clampToGround: true
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(model)

  // 卫星
  const weixin = new mars3d.graphic.Satellite({
    name: "GAOFEN 1",
    tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
    tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90,
      autoHeading: true,
      show: true
    },
    path: { color: "#00ff00", opacity: 0.5, width: 1, show: true }
  })
  graphicLayer.addGraphic(weixin)

  const coneTrack = new mars3d.graphic.ConeTrack({
    position: model.position,
    targetPosition: weixin.property,
    style: {
      angle: 1, // 半场角度
      color: "#ff0000",
      opacity: 0.4
    }
  })
  graphicLayer.addGraphic(coneTrack)
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

    const graphic = new mars3d.graphic.ConeTrack({
      position: position,
      style: {
        length: result.radius * 2,
        topRadius: 0.0,
        bottomRadius: result.radius,
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
