import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let underground

export const mapOptions = {
  scene: {
    center: { lat: 31.840106, lng: 117.216768, alt: 554, heading: 0, pitch: -59 },
    globe: {
      depthTestAgainstTerrain: true
    }
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

  addLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addLayer() {
  underground = new mars3d.thing.Underground({
    alpha: 0.5
  })
  map.addThing(underground)

  /* // 地下颜色的个性化处理
  underground.color = Cesium.Color.BLACK
  underground.colorAlphaByDistance = new Cesium.NearFarScalar(1000.0, 0.0, 1000000.0, 1.0) */

  // 加个模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "地下管网",
    url: "//data.mars3d.cn/3dtiles/max-piping/tileset.json",
    position: { lng: 117.215457, lat: 31.843363, alt: -3.6 },
    rotation: { z: 336.7 },
    maximumScreenSpaceError: 2,
    maximumMemoryUsage: 1024,
    highlight: { type: "click", color: "#00FFFF" },
    popup: "all",
    center: { lat: 31.838081, lng: 117.216584, alt: 406, heading: 1, pitch: -34 }
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 黄色盒子
  const graphic = new mars3d.graphic.BoxEntity({
    position: [117.218633, 31.843935, 41.43],
    style: {
      dimensions: new Cesium.Cartesian3(40.0, 30.0, 50.0),
      fill: true,
      color: "#ffff00",
      opacity: 1
    }
  })
  graphicLayer.addGraphic(graphic)

  // 创建gltf模型
  const graphicModel = new mars3d.graphic.ModelEntity({
    position: [117.214494, 31.844015, 30],
    style: {
      url: "//data.mars3d.cn/gltf/mars/firedrill/xiaofangche2.gltf",
      scale: 7,
      minimumPixelSize: 50
    }
  })
  graphicLayer.addGraphic(graphicModel)
}

// 俯视视角
export function centerAtDX1() {
  map.setCameraView({
    y: 31.840106,
    x: 117.216768,
    z: 554.36,
    heading: 0,
    pitch: -59.3,
    roll: 0
  })
}

// 地下视角1
export function centerAtDX2() {
  map.setCameraView({
    y: 31.841263,
    x: 117.21538,
    z: -13.35,
    heading: 40.6,
    pitch: 15.7,
    roll: 0.1
  })
}

// 地下视角2
export function centerAtDX3() {
  map.setCameraView({
    y: 31.838908,
    x: 117.217486,
    z: -63.75,
    heading: 349.2,
    pitch: 18.2,
    roll: 0
  })
}

// 透明度发生改变
export function opacityChange(value) {
  underground.alpha = value
}

// 复选框，是否开启地下模式
export function chkUnderground(value) {
  underground.enabled = value
}
