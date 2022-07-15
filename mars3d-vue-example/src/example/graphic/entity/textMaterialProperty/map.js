import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.792325, lng: 121.480055, alt: 146, heading: 198, pitch: -54 }
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

  // 加个模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "水利闸门",
    url: "//data.mars3d.cn/3dtiles/max-fsdzm/tileset.json",
    position: { alt: 15.2 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024
  })
  map.addLayer(tiles3dLayer)

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
  graphicLayer.clear()
}

// wall文字 entity方式
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [121.479914, 29.791249, 32],
      [121.479694, 29.791303, 32]
    ],
    style: {
      diffHeight: 5,
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "水利闸门",
        font_family: "楷体",
        color: "#00ffff"
      }
    },
    attr: { remark: "示例1" }
  })

  graphicLayer.addGraphic(graphic)
}

//  wall文字  primitive方式添加
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [121.479343, 29.791419, 35],
      [121.479197, 29.791474, 35]
    ],
    style: {
      diffHeight: 5,
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "火星科技",
        font_size: 70,
        color: "#3388cc",
        outline: true,
        outlineWidth: 4,
        onCustomCanvas: onCustomCanvas // 对Canvas做自定义处理
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)
}

// 对Canvas做自定义处理,需要返回Promise
function onCustomCanvas(canvas, material) {
  const context = canvas.getContext("2d")
  return Cesium.Resource.createIfNeeded("./img/country/zg.png")
    .fetchImage()
    .then((image) => {
      context.drawImage(image, 5, 5, 20, 20)
      return canvas
    })
}

// rectangle贴地矩形  3dtiles路面文字
function addDemoGraphic3(graphicLayer) {
  const rectangleEntity = new mars3d.graphic.RectangleEntity({
    positions: [
      [121.479989, 29.791162],
      [121.480114, 29.791201]
    ],
    style: {
      classificationType: Cesium.ClassificationType.BOTH,
      rotationDegree: 163,
      clampToGround: true,
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "火星路",
        font_size: 50,
        font_family: "楷体",
        color: "#00ff00",
        stroke: true,
        strokeWidth: 2,
        strokeColor: "#ffffff"
      },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        type: mars3d.EventType.click,
        materialOptions: {
          stroke: true,
          strokeColor: "rgba(255,0,0,0.8)",
          strokeWidth: 5
        }
      }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(rectangleEntity)
}

function addDemoGraphic4(graphicLayer) {
  let rotation = Cesium.Math.toRadians(30)
  function getRotationValue() {
    rotation += 0.005
    return rotation
  }

  const rectangleEntity = new mars3d.graphic.RectangleEntity({
    positions: [
      [121.479593, 29.791632, 13],
      [121.480136, 29.79169, 13]
    ],
    style: {
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "火星科技Mars3D平台",
        font_size: 70,
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        stroke: true,
        strokeWidth: 2,
        strokeColor: new Cesium.Color(1.0, 1.0, 1.0, 0.8)
      },
      rotation: new Cesium.CallbackProperty(getRotationValue, false),
      stRotation: new Cesium.CallbackProperty(getRotationValue, false)
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(rectangleEntity)
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  const diffHeight = result.radius * 0.5

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 45, result.radius)

    const graphic = new mars3d.graphic.WallEntity({
      positions: [pt1, pt2],
      style: {
        diffHeight: diffHeight,
        materialType: mars3d.MaterialType.Text,
        materialOptions: {
          text: "Mars3D三维可视化平台",
          font_family: "楷体",
          color: "#00ffff"
        }
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
    type: "wall",
    maxPointNum: 2,
    style: {
      diffHeight: 5,
      outline: false,
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "Mars3D三维可视化平台",
        font_size: 50,
        color: "#ffff00"
      }
    }
  })
}

// 绘制贴地矩形
export function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "rectangle",
    style: {
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "Mars3D三维可视化平台"
      },
      clampToGround: true
    }
  })
}

// 根据中心点来计算矩形
export function onClickDrawPoint() {
  graphicLayer.startDraw({
    type: "point",
    style: {
      color: "#ffff00",
      clampToGround: true
    },
    success: function (graphic) {
      const position = graphic.positionShow
      const positions = mars3d.PolyUtil.getRectPositionsByCenter({
        center: position,
        width: 60,
        height: 10
      })
      graphic.remove(true)

      const rectangleEntity = new mars3d.graphic.RectangleEntity({
        positions: positions,
        style: {
          materialType: mars3d.MaterialType.Text,
          materialOptions: {
            text: "Mars3D三维可视化平台"
          },
          clampToGround: true
        }
      })
      graphicLayer.addGraphic(rectangleEntity)

      if (graphicLayer.hasEdit) {
        rectangleEntity.startEditing()
      }
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
