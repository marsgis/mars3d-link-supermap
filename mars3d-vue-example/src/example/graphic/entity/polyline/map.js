import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.471758, lng: 117.20494, alt: 47660, heading: 4, pitch: -45 }
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
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
  addDemoGraphic9(graphicLayer)
  addDemoGraphic10(graphicLayer)
  addDemoGraphic11(graphicLayer)
  addDemoGraphic12(graphicLayer)
  addDemoGraphic13(graphicLayer)
  addDemoGraphic14(graphicLayer)
  addDemoGraphic15(graphicLayer)
  addDemoGraphic16(graphicLayer)
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

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.220337, 31.832987, 42.8],
      [117.220242, 31.835234, 45.6],
      [117.216263, 31.835251, 39.3],
      [117.217219, 31.819929, 35.8],
      [117.223096, 31.818342, 29.8],
      [117.249686, 31.818964, 40.1],
      [117.263171, 31.816664, 35.2],
      [117.278695, 31.816107, 35.5],
      [117.279826, 31.804185, 34.5],
      [117.286308, 31.804112, 29.2],
      [117.28621, 31.801059, 24.6]
    ],
    style: {
      width: 5,
      color: "#3388ff",

      label: { text: "鼠标移入会高亮", pixelOffsetY: -30 },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        color: "#ff0000"
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)

  // 演示个性化处理graphic
  // initGraphicManager(graphic)
}

// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 3.在graphic上绑定监听事件
  // graphic.on(mars3d.EventType.click, function (event) {
  //   console.log("监听graphic，单击了矢量对象", event)
  // })
  // 绑定Tooltip
  // graphic.bindTooltip('我是graphic上绑定的Tooltip') //.openTooltip()

  // 绑定Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">我是graphic上绑定的Popup </th>
            </tr>
            <tr>
              <td>提示：</td>
              <td>这只是测试信息，可以任意html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  // 绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "删除对象[graphic绑定的]",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])

  // 测试 颜色闪烁
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, // 闪烁时长（秒）
      maxAlpha: 0.5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        // 结束后回调
      }
    })
  }
}

// 有衬色边线,附带的label演示，导出geojson，加载geojson
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.172852, 31.862736, 33.69],
      [117.251461, 31.856011, 26.44]
    ],
    style: {
      width: 6,
      materialType: mars3d.MaterialType.PolylineOutline,
      materialOptions: {
        color: Cesium.Color.ORANGE,
        outlineWidth: 2,
        outlineColor: Cesium.Color.BLACK
      },
      label: {
        text: "我是原始线",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)

  // graphic转geojson
  const geojson = graphic.toGeoJSON()
  console.log("转换后的geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}

// 添加单个geojson为graphic，多个直接用graphicLayer.loadGeoJSON
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // 新的坐标
  graphicCopy.positions = [
    [117.172852, 31.872736, 33.69],
    [117.251461, 31.866011, 26.44]
  ]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "我是转换后生成的"
  graphicLayer.addGraphic(graphicCopy)
}

// 箭头线
function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.358187, 31.838662, 12.23],
      [117.4384, 31.819405, 11.78]
    ],
    style: {
      width: 8,
      clampToGround: true,
      materialType: mars3d.MaterialType.PolylineArrow,
      materialOptions: {
        color: Cesium.Color.YELLOW
      }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic)
}

// 虚线
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.348938, 31.805369, 7.63],
      [117.429496, 31.786715, 8.41]
    ],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: Cesium.Color.CYAN,
        dashLength: 8.0
      }
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic)
}

// 虚线 ，双色间隔
function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.313682, 31.7416, 10.85],
      [117.311934, 31.774753, 19.71],
      [117.305473, 31.800304, 23.86]
    ],
    style: {
      width: 5,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: Cesium.Color.BLUE,
        gapColor: Cesium.Color.YELLOW,
        dashPattern: parseInt("1111000000", 2)
      }
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.169646, 31.769171],
      [117.194579, 31.806466]
    ],
    style: {
      width: 5,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "#00ff00",
        image: "img/textures/line-pulse.png",
        speed: 3
      }
    },
    attr: { remark: "示例6" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic7(graphicLayer) {
  const startPoint = Cesium.Cartesian3.fromDegrees(117.025419, 32.00651, 51.2)
  const endPoint = Cesium.Cartesian3.fromDegrees(117.323963, 32.050384, 33.8)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // 计算曲线点

  const graphic = new mars3d.graphic.PolylineEntity({
    positions: positions,
    style: {
      width: 8,
      // 动画线材质
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/line-gradual.png",
        color: "#66bd63",
        repeat: new Cesium.Cartesian2(2.0, 1.0),
        speed: 25
      }
    },
    attr: { remark: "示例7" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic8(graphicLayer) {
  const startPoint = Cesium.Cartesian3.fromDegrees(117.128446, 31.943352, 42.31)
  const endPoint = Cesium.Cartesian3.fromDegrees(117.410216, 31.975375, 37.53)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // 计算曲线点

  const graphic = new mars3d.graphic.PolylineEntity({
    positions: positions,
    style: {
      width: 10,
      // 动画线材质
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/line-arrow-blue.png",
        color: "#1a9850",
        mixt: true,
        speed: 20,
        repeat: new Cesium.Cartesian2(5, 1)
      }
    },
    attr: { remark: "示例8" }
  })
  graphicLayer.addGraphic(graphic)
}

// 演示CallbackProperty属性
function addDemoGraphic9(graphicLayer) {
  const startPoint = Cesium.Cartesian3.fromDegrees(117.281455, 31.896386, 22.64)
  const endPoint = Cesium.Cartesian3.fromDegrees(117.528249, 31.921552, 43.3)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // 计算曲线点

  const graphic = new mars3d.graphic.PolylineEntity({
    positions: positions,
    style: {
      width: 5,
      materialType: mars3d.MaterialType.LineFlowColor,
      materialOptions: {
        color: "#00ffff",
        speed: 10,
        percent: 0.15,
        alpha: 0.2
      }
    },
    attr: { remark: "示例9" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic10(graphicLayer) {
  const startPoint = Cesium.Cartesian3.fromDegrees(116.96385, 32.089068, 38.1)
  const endPoint = Cesium.Cartesian3.fromDegrees(117.299257, 32.137552, 40)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // 计算曲线点

  const graphic = new mars3d.graphic.PolylineEntity({
    positions: positions,
    style: {
      width: 10,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/line-colour.png",
        speed: 10
      }
    },
    attr: { remark: "示例10" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic11(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.086107, 31.848306, 40.6],
      [117.145698, 31.798726, 22.6]
    ],
    style: {
      width: 10,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: Cesium.Color.AQUA,
        image: "./img/textures/arrow-h.png",
        repeat: new Cesium.Cartesian2(20, 1),
        speed: 30
      }
    },
    attr: { remark: "示例11" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic12(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.037815, 31.799497, 39.1],
      [117.097695, 31.742135, 22.5]
    ],
    style: {
      width: 18,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "#a6d96a",
        repeat: new Cesium.Cartesian2(4.0, 1.0),
        image: "img/textures/line-arrow-dovetail.png",
        speed: 20
      }
    },
    attr: { remark: "示例12" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic13(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.057761, 31.81993, 33.3],
      [117.121986, 31.77118, 19.3]
    ],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: Cesium.Color.CHARTREUSE,
        image: "img/textures/line-color-yellow.png",
        speed: 25
      }
    },
    attr: { remark: "示例13" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic14(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.009827, 31.776642, 42],
      [117.100274, 31.69459, 37.4]
    ],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "rgba(89,249,255,0.8)",
        image: "img/textures/line-tarans.png",
        speed: 8
      }
    },
    attr: { remark: "示例14" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic15(graphicLayer) {
  const positions = [
    [117.225254, 31.743174, 22.5],
    [117.333836, 31.743008, 7.4],
    [117.333411, 31.715264, 2.7],
    [117.31401, 31.715658, 4.3],
    [117.314371, 31.727136, 5.4],
    [117.297682, 31.727056, 7.2],
    [117.296586, 31.692789, 3.4],
    [117.279685, 31.693365, 7.1],
    [117.280136, 31.726877, 11.4],
    [117.225741, 31.726757, 20.2],
    [117.225387, 31.743153, 22.5]
  ]

  const graphic = new mars3d.graphic.PolylineEntity({
    positions: mars3d.PolyUtil.interLine(positions, { minDistance: "auto" }), // 切分坐标，使流动材质均匀些
    style: {
      width: 7,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "/img/textures/line-interval.png",
        axisY: false,
        repeat: new Cesium.Cartesian2(10.0, 1.0),
        color: "#ffffff",
        speed: 10
      }
    },
    attr: { remark: "示例15" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic16(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [116.929192, 31.891959, 32.8],
      [116.960064, 31.883802, 35.7],
      [116.948047, 31.868749, 33.7]
    ],
    style: {
      width: 3,
      color: "#ff0000"
    },
    attr: { remark: "示例16" }
  })
  graphicLayer.addGraphic(graphic)

  // 动态平滑追加点
  const positions_draw = graphic.setCallbackPositions() // 切换坐标为动态回调模式
  setInterval(() => {
    const position = new mars3d.LngLatPoint(116.979661 + Math.random() * 0.01, 31.863542 + Math.random() * 0.01, 38).toCartesian()
    positions_draw.push(position) // 追加点
  }, 3000)
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

    const graphic = new mars3d.graphic.PolylineEntity({
      positions: [pt1, position, pt2],
      style: {
        width: 3.0,
        color: Cesium.Color.fromRandom({ alpha: 1.0 })
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
    type: "polyline",
    // maxPointNum: 2, //可以限定最大点数，2个点绘制后自动结束
    style: {
      color: "#55ff33",
      width: 3,
      clampToGround: false,
      label: {
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    }
  })
}

// 开始绘制
export function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#ff0000",
      width: 3,
      closure: true
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
