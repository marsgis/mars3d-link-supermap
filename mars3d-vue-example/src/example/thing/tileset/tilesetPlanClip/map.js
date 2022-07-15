import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tilesetPlanClip

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "教学楼",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 1024,
    // highlight: { type: "click", color: "#00FFFF" },
    // popup: "all",
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  tilesetPlanClip = new mars3d.thing.TilesetPlanClip({
    layer: tilesetLayer,
    clipOutSide: false,
    edgeColor: Cesium.Color.GREY,
    edgeWidth: 2.0,
    showPlane: true
  })
  map.addThing(tilesetPlanClip)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 绘制线
export function drawLine() {
  tilesetPlanClip.clear()

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

      tilesetPlanClip.positions = positions
    }
  })
}

// 绘制矩形
export function drawExtent() {
  tilesetPlanClip.clear()

  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      tilesetPlanClip.positions = positions
    }
  })
}

// 绘制面
export function drawPoly() {
  tilesetPlanClip.clear()

  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      clampToGround: true
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      tilesetPlanClip.positions = positions
    }
  })
}
// 绘制面(外切)
export function drawPoly2() {
  tilesetPlanClip.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      clampToGround: true
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      tilesetPlanClip.clipOutSide = true
      tilesetPlanClip.positions = positions
    }
  })
}

// 更改切换方向
export function clippingType(type) {
  tilesetPlanClip.type = mars3d.ClipType[type]
}

// 距离
export function rangeDistance(value) {
  tilesetPlanClip.distance = value
}
// 偏移量
export function rangeNormalZ(value) {
  tilesetPlanClip.normalZ = value
}

export function clear() {
  tilesetPlanClip.clear()
}
