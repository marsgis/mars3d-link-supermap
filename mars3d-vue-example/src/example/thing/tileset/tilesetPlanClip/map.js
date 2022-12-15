import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tilesetLayer

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "教学楼",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 1024,

    // 可传入TilesetPlanClip构造参数，下面是演示裁剪区域
    planClip: {
      positions: [
        [117.251193, 31.843689, 47.7],
        [117.251384, 31.843689, 47.7],
        [117.251384, 31.843746, 47.7],
        [117.251193, 31.843746, 47.7]
      ],
      edgeColor: Cesium.Color.GREY,
      edgeWidth: 2.0
      // showPlane: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)
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
  tilesetLayer.planClip.clear()

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
      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      tilesetLayer.planClip.positions = positions
    }
  })
}

// 绘制矩形
export function drawExtent() {
  tilesetLayer.planClip.clear()

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
      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      tilesetLayer.planClip.positions = positions
    }
  })
}

// 绘制面
export function drawPoly() {
  tilesetLayer.planClip.clear()

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
      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      tilesetLayer.planClip.positions = positions
    }
  })
}
// 绘制面(外切)
export function drawPoly2() {
  tilesetLayer.planClip.clear()
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
      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      tilesetLayer.planClip.clipOutSide = true
      tilesetLayer.planClip.positions = positions
    }
  })
}

// 更改切换方向
export function clippingType(type) {
  tilesetLayer.planClip.type = mars3d.ClipType[type]
}

// 距离
export function rangeDistance(value) {
  tilesetLayer.planClip.distance = value
}
// 偏移量
export function rangeNormalZ(value) {
  tilesetLayer.planClip.normalZ = value
}

export function clear() {
  tilesetLayer.planClip.clear()
}
