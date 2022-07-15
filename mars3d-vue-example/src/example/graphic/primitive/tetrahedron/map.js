import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.815928, lng: 117.21376, alt: 683, heading: 61, pitch: -24 }
  }
}

export let graphicLayer

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2017 // 切换至蓝色底图

  // 添加参考三维模型;
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei2/tileset.json",
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    style: {
      color: {
        conditions: [["true", `color("rgba(42, 160, 224, 1)")`]]
      }
    },
    marsJzwStyle: true
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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function addDemoGraphic1(graphicLayer) {
  const tetrahedronPrimitive = new mars3d.graphic.Tetrahedron({
    position: Cesium.Cartesian3.fromDegrees(117.222132, 31.822729, 250),
    style: {
      width: 25,
      height: 40,
      color: "rgba(255,0,0,0.7)",
      moveHeight: 50
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(tetrahedronPrimitive)
}

export function addDemoGraphic2(graphicLayer) {
  const tetrahedronPrimitive = new mars3d.graphic.Tetrahedron({
    position: Cesium.Cartesian3.fromDegrees(117.227581, 31.821564, 250),
    style: {
      width: 20,
      height: 30,
      color: new Cesium.Color(0.8, 0.8, 0, 0.8),
      moveHeight: 40
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(tetrahedronPrimitive)
}

export function addDemoGraphic3(graphicLayer) {
  const tetrahedronPrimitive = new mars3d.graphic.Tetrahedron({
    position: Cesium.Cartesian3.fromDegrees(117.223923, 31.81897, 250),
    style: {
      width: 20,
      height: 30,
      color: new Cesium.Color(0.8, 0.8, 0, 0.8),
      animation: true,
      moveHeight: 30,
      moveDuration: 1,
      rotationAngle: 1
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(tetrahedronPrimitive)
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 1500)
  console.log("生成的测试网格坐标", result)

  const radius = result.radius * 0.3

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.Tetrahedron({
      position: position,
      style: {
        width: radius / 2,
        height: radius,
        moveHeight: radius,
        color: Cesium.Color.fromRandom({ alpha: 0.6 })
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
    type: "tetrahedron",
    style: {
      width: 25,
      height: 40,
      color: "#00ff00",
      moveHeight: 50
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
    }
  ])
}
