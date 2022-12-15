import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.805326, lng: 117.241767, alt: 2281, heading: 357, pitch: -42 }
  },
  terrain: {
    show: false
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map // 创建矢量数据图层

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer) // 在layer上绑定监听事件

  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    console.log("单击了合并对象中的单个值为", pickedItem)
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效 // 加一些演示数据
  // addDemoGraphic1()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
  graphicLayer.remove()
}

export function addDemoGraphic1() {
  const url = "//data.mars3d.cn/file/geojson/buildings-hf.json"
  mars3d.Util.fetchJson({ url: url }).then((data) => {
    const arr = mars3d.Util.geoJsonToGraphics(data, {
      symbol: {
        callback: function (attr) {
          const diffHeight = (attr.floor || 1) * 5

          return {
            height: 0,
            diffHeight: diffHeight,
            color: Cesium.Color.fromRandom({ alpha: 0.4 }) // 随机色
          }
        }
      }
    })

    globalMsg("共加载" + arr.length + "个面") // 多个面对象的合并渲染。

    const graphic = new mars3d.graphic.PolygonCombine({
      instances: arr, // 公共样式
      style: {
        outline: true,
        outlineColor: "#ffffff",
        clampToGround: true
      }, // 高亮时的样式

      highlight: {
        type: mars3d.EventType.click,
        color: Cesium.Color.YELLOW.withAlpha(0.9)
      }
    })
    graphicLayer.addGraphic(graphic)
  })
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  const arrData = []
  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 0, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 72, result.radius)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 144, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 216, result.radius)
    const pt5 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 288, result.radius)
    arrData.push({
      positions: [pt1, pt2, pt3, pt4, pt5],
      style: {
        color: Cesium.Color.fromRandom({ alpha: 0.6 }),
        clampToGround: true
      },
      attr: { index: index }
    })
  } // 多个面对象的合并渲染。

  const graphic = new mars3d.graphic.PolygonCombine({
    instances: arrData, // 高亮时的样式
    highlight: {
      type: mars3d.EventType.click,
      color: Cesium.Color.YELLOW.withAlpha(0.9)
    }
  })
  graphicLayer.addGraphic(graphic)

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

// 取区域内的随机点
function randomPoint() {
  const jd = random(115.955684 * 1000, 117.474003 * 1000) / 1000
  const wd = random(30.7576 * 1000, 32.008782 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
