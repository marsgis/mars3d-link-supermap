import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.851048, lng: 117.477098, alt: 1294279, heading: 358, pitch: -87 }
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

  // 加载气象
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/windpoint.json" })
    .then(function (res) {
      showWindLine(res.data)
    })
    .catch(function () {
      globalMsg("实时查询气象信息失败，请稍候再试")
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 流场线
function showWindLine(arr) {
  const arrData = []
  const radius = 12000
  const lineMaterial = mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
    image: "img/textures/line-arrow-right.png",
    color: "#00ff00",
    speed: 30
  })
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    const position = Cesium.Cartesian3.fromDegrees(item.x, item.y, 0)
    const angle = 180 - item.dir

    let pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, angle, radius)
    pt1 = mars3d.PointUtil.setPositionsHeight(pt1, 0)

    arrData.push({
      positions: [position, pt1],
      style: {
        width: 8,
        material: lineMaterial // 动画线材质
      },
      attr: item
    })
  }

  // 多个线对象的合并渲染。
  const graphic = new mars3d.graphic.PolylineCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(graphic)
}

// 按单个线渲染，效率差些
/* function showWindLine(arr) {
  // 创建矢量数据图层
  let graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  let lineMaterial = mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
    image: "img/textures/line-arrow-right.png",
    color: "#00ff00",
    speed: 30
  })

  let radius = 12000
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    let position = Cesium.Cartesian3.fromDegrees(item.x, item.y, 0)
    let angle = 180 - item.dir

    let pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, angle, radius)
    pt1 = mars3d.PointUtil.setPositionsHeight(pt1, 0)

    let graphic = new mars3d.graphic.PolylinePrimitive({
      positions: [position, pt1],
      style: {
        width: 8,
        material: lineMaterial // 动画线材质
      }
    })
    graphic.bindPopup(`${angle}`)
    graphicLayer.addGraphic(graphic)
  }
} */

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
