import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.841762, lng: 116.26537, alt: 3281, heading: 39, pitch: -63 }
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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function removeAll() {
  map.graphicLayer.clear()

  clearInterResult()
}

/**
 * 面插值
 *
 * @export
 * @param {number} val 步长
 * @returns {void}
 */
export function interPolygon(val) {
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#29cf34",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      mars3d.PolyUtil.interPolygon({
        scene: map.scene,
        positions: positions,
        splitNum: val // splitNum插值分割的个数
      }).then((resultInter) => {
        showInterResult(resultInter.list)
      })
    }
  })
}

/**
 * 线插值
 *
 * @export
 * @param {number} val 步长
 * @returns {void}
 */
export function interLine(val) {
  map.graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#55ff33",
      width: 3
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      const arrLine = mars3d.PolyUtil.interLine(positions, {
        splitNum: val // 插值分割的个数
      })

      showInterLineResult(arrLine)
    }
  })
}

/**
 * 线插值(高度等分)
 *
 * @export
 * @param {number} val 步长
 * @returns {void}
 */
export function interPolyline(val) {
  map.graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#55ff33",
      width: 3,
      clampToGround: true
    },
    success: function (graphic) {
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      const arrLine = mars3d.PolyUtil.interPolyline({
        scene: map.scene,
        positions: positions,
        splitNum: val // 插值分割的个数
      })

      showInterLineResult(arrLine)
    }
  })
}

// 显示mars3d.polygon.interPolygon处理后的面内插值分析结果，主要用于测试对比

// 显示面的插值计算结果，方便比较分析
let interGraphicLayer

function clearInterResult() {
  if (!interGraphicLayer) {
    interGraphicLayer = new mars3d.layer.GraphicLayer()

    map.addLayer(interGraphicLayer)
  }

  interGraphicLayer.clear()
}

function showInterResult(list) {
  // 分析结果用于测试分析的，不做太多处理，直接清除之前的，只保留一个
  clearInterResult()

  let pt1, pt2, pt3
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]

    pt1 = item.point1.pointDM
    pt2 = item.point2.pointDM
    pt3 = item.point3.pointDM

    // 点
    for (const pt of [item.point1, item.point2, item.point3]) {
      const graphic = new mars3d.graphic.PointPrimitive({
        position: pt.pointDM,
        style: {
          pixelSize: 9,
          color: Cesium.Color.fromCssColorString("#ff0000").withAlpha(0.5)
        }
      })
      interGraphicLayer.addGraphic(graphic)

      graphic.bindTooltip("点高度:" + mars3d.MeasureUtil.formatDistance(pt.height))
    }

    // 横截面面积
    item.area = item.area || mars3d.MeasureUtil.getTriangleArea(pt1, pt2, pt3)

    // 三角网及边线
    const positions = [pt1, pt2, pt3, pt1]

    // 三角网面（单击用）
    const primitivePoly = new mars3d.graphic.PolygonPrimitive({
      positions: positions,
      style: {
        color: Cesium.Color.fromCssColorString("#ffffff").withAlpha(0.01)
      }
    })
    interGraphicLayer.addGraphic(primitivePoly)
    primitivePoly.bindTooltip("三角面积:" + mars3d.MeasureUtil.formatArea(item.area) + "(第" + i + "个)")

    // 三角网边线
    const primitiveLine = new mars3d.graphic.PolylinePrimitive({
      positions: positions,
      style: {
        width: 1,
        color: Cesium.Color.fromCssColorString("#ffff00").withAlpha(0.3)
      }
    })
    interGraphicLayer.addGraphic(primitiveLine)
  }
}

// 在f80_interPoly等示例中使用
function showInterLineResult(list) {
  // 分析结果用于测试分析的，不做太多处理，直接清除之前的，只保留最后一个
  clearInterResult()

  const colorList = [Cesium.Color.fromCssColorString("#ffff00"), Cesium.Color.fromCssColorString("#00ffff")]

  for (let i = 1, len = list.length; i < len; i++) {
    const pt1 = list[i - 1]
    const pt2 = list[i]

    const color = colorList[i % 2]

    const graphic = new mars3d.graphic.PolylineEntity({
      positions: [pt1, pt2],
      style: {
        width: 3,
        material: color,
        depthFailMaterial: color.withAlpha(0.3)
      }
    })
    interGraphicLayer.addGraphic(graphic)
    graphic.bindTooltip("长度:" + mars3d.MeasureUtil.formatDistance(Cesium.Cartesian3.distance(pt1, pt2)) + "(第" + i + "段)")
  }
}
