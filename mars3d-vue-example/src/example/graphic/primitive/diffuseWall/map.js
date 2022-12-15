import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.188596, lng: 121.474422, alt: 4541, heading: 15, pitch: -40 }
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

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "上海市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-shanghai/tileset.json",
    maximumScreenSpaceError: 8,
    maximumMemoryUsage: 1024,
    marsJzwStyle: true,
    style: {
      color: {
        conditions: [["true", "rgb(3, 104, 255)"]]
      }
    },
    popup: "all"
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
  addDemoGraphic1()
  addDemoGraphic2()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 立体围墙扩散效果,面状
function addDemoGraphic1() {
  const diffuseWallGlow = new mars3d.graphic.DiffuseWall({
    positions: [
      [121.475616, 31.255374, 5.87],
      [121.482578, 31.248681, 10.85],
      [121.479447, 31.240235, 14.25],
      [121.470002, 31.240496, 12.92],
      [121.46538, 31.249206, 9.53],
      [121.475616, 31.255374, 5.87]
    ],
    style: {
      color: "#ffff00",
      diffHeight: 2000, // 高度
      speed: 10, // 速度

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        color: "#ff0000"
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(diffuseWallGlow)

}

// 立体围墙扩散效果,圆状
function addDemoGraphic2() {
  const circleDiffuseWallGlow = new mars3d.graphic.DiffuseWall({
    position: Cesium.Cartesian3.fromDegrees(121.504242, 31.23805, 27.88), // 圆中心点
    style: {
      diffHeight: 2000, // 高度
      radius: 600, // 半径
      color: "#ff0000",
      speed: 10 // 速度
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(circleDiffuseWallGlow)

  // setInterval(() => {
  //   circleDiffuseWallGlow.uniforms.color = Cesium.Color.fromRandom({ alpha: 0.6 })
  // }, 500)
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

    const graphic = new mars3d.graphic.DiffuseWall({
      positions: [pt1, pt2, pt3, pt4, pt5],
      style: {
        diffHeight: result.radius * 2,
        color: "#ff0000"
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
    type: "diffuseWall",
    style: {
      color: "#55ff33",
      opacity: 0.8,
      diffHeight: 800,
      speed: 10 // 速度
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
    }
  ])
}
