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

  globalNotify("已知问题提示", `因为使用clippingPlanes接口，绘制面时，有些绘制的角度存在效果不对`)

  // 加模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "县城社区",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 11.5 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    skipLevelOfDetail: true,
    preferLeaves: true,
    dynamicScreenSpaceError: true,
    cullWithChildrenBounds: false,
    luminanceAtZenith: 0.6,
    center: { lat: 28.440675, lng: 119.487735, alt: 639, heading: 269, pitch: -38 },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // 3d模型裁剪
  tilesetPlanClip = new mars3d.thing.TilesetPlanClip({
    layer: tilesetLayer,
    clipOutSide: false,
    edgeColor: Cesium.Color.GREY,
    edgeWidth: 2.0
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

      // 加入positions才能使3d裁剪确定位置，生效
      tilesetPlanClip.positions = positions
    }
  })
}

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

export function drawExtent() {
  tilesetPlanClip.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
      // clampToGround: true
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.PointTrans.cartesians2lonlats(positions))) // 方便测试拷贝坐标

      tilesetPlanClip.positions = positions
    }
  })
}

export function drawExtent2() {
  tilesetPlanClip.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
      // clampToGround: true
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      tilesetPlanClip.clipOutSide = true
      tilesetPlanClip.positions = positions

      console.log("绘制坐标为", JSON.stringify(mars3d.PointTrans.cartesians2lonlats(positions))) // 方便测试拷贝坐标
    }
  })
}

export function clear() {
  tilesetPlanClip.clear()
}
