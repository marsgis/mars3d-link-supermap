import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let modelPlanClip

export const mapOptions = {
  scene: {
    center: { lat: 31.841619, lng: 117.140395, alt: 1259, heading: 90, pitch: -51 },
    fxaa: true
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
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加模型
  const graphic = new mars3d.graphic.ModelPrimitive({
    position: [117.150365, 31.841954, 50.26],
    style: {
      url: "//data.mars3d.cn/gltf/mars/dikuai/d1.gltf",
      scale: 1
    }
  })
  graphicLayer.addGraphic(graphic)

  modelPlanClip = new mars3d.thing.ModelPlanClip({
    graphic: graphic,
    height: 1, // 开挖的深度
    clipOutSide: false,
    edgeColor: Cesium.Color.GREY,
    edgeWidth: 2.0
  })
  map.addThing(modelPlanClip)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function rangeDistance(value) {
  modelPlanClip.distance = value
}

export function rangeNormalZ(value) {
  modelPlanClip.normalZ = value
}

// 更改切换方向
export function clippingType(type) {
  modelPlanClip.type = mars3d.ClipType[type]
}

// 绘制线
export function drawLine() {
  modelPlanClip.clear()

  map.graphicLayer.startDraw({
    type: "polyline",
    maxPointNum: 2,
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      modelPlanClip.positions = positions
    }
  })
}
// 绘制矩形
export function drawExtent() {
  modelPlanClip.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: true,
      outlineWidth: 2,
      addHeight: 0.5
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      modelPlanClip.positions = positions
    }
  })
}

// 绘制面
export function drawPoly() {
  modelPlanClip.clear()

  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      addHeight: 0.5
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      modelPlanClip.positions = positions
    }
  })
}
// 绘制面(外切)
export function drawPoly2() {
  modelPlanClip.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      addHeight: 0.5
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      modelPlanClip.clipOutSide = true
      modelPlanClip.positions = positions
    }
  })
}

export function clear() {
  modelPlanClip.clear()
}
