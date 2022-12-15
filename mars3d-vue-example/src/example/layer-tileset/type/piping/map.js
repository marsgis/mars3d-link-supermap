import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let underground
let terrainPlanClip

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.839437, lng: 117.216104, alt: 554, heading: 359, pitch: -55 },
    baseColor: "rgba(0,0,0.0,0.5)",
    globe: {
      depthTestAgainstTerrain: true
    }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 加个模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "地下管网",
    url: "//data.mars3d.cn/3dtiles/max-piping/tileset.json",
    position: { lng: 117.215457, lat: 31.843363, alt: -3.6 },
    rotation: { z: 336.7 },
    maximumScreenSpaceError: 2,
    maximumMemoryUsage: 1024,
    highlight: { type: "click", outlineEffect: true, width: 8, color: "#FFFF00" },
    popup: "all",
    center: { lat: 31.838081, lng: 117.216584, alt: 406, heading: 1, pitch: -34 }
  })
  map.addLayer(tiles3dLayer)

  terrainClips(30)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function centerAtDX1() {
  map.setCameraView({
    lat: 31.840106,
    lng: 117.216768,
    alt: 554.36,
    heading: 0,
    pitch: -59.3,
    roll: 0
  })
}

export function centerAtDX2() {
  map.setCameraView({
    lat: 31.841263,
    lng: 117.21538,
    alt: -13.35,
    heading: 40.6,
    pitch: 15.7,
    roll: 0.1
  })
}

// 是否开启地下模式
export function chkUnderground(val, alphaVal) {
  // 地下模式
  if (!underground) {
    underground = new mars3d.thing.Underground({
      alpha: alphaVal,
      enabled: val
    })
    map.addThing(underground)
  }

  underground.enabled = val
}

// 透明度发生改变
export function alphaChange(value) {
  if (underground) {
    underground.alpha = value
  }
}
// 是否开挖
export function chkClippingPlanes(val) {
  terrainPlanClip.enabled = val
}

export function terrainClips(heightVal) {
  // 挖地区域
  terrainPlanClip = new mars3d.thing.TerrainClip({
    positions: [
      [117.214769, 31.842048, 42.63],
      [117.217764, 31.842048, 42.63],
      [117.217764, 31.843312, 42.63],
      [117.214769, 31.843312, 42.63]
    ],
    diffHeight: heightVal, // 高度
    image: "./img/textures/poly-stone.jpg",
    imageBottom: "./img/textures/poly-soil.jpg",
    splitNum: 50 // 井边界插值数
  })
  map.addThing(terrainPlanClip)

}

export function heightChange(num) {
  terrainPlanClip.diffHeight = num
}

// 绘制矩形
export function drawExtent() {
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      terrainPlanClip.clear()
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      // 挖地区域
      terrainPlanClip.positions = positions
    }
  })
}

// 绘制多边形
export function drawPolygon() {
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      clampToGround: true
    },
    success: function (graphic) {
      terrainPlanClip.clear()
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      // 挖地区域
      terrainPlanClip.positions = positions
    }
  })
}

export function clearWJ() {
  terrainPlanClip.clear() // 清除挖地区域
}

function distanceChange(value) {
  terrainPlanClip.distance = value
}
