import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tilesetClip
let queryGaodePOI

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.623553, lng: 117.322405, alt: 123536, heading: 359, pitch: -81 }
  },
  control: {
    baseLayerPicker: false
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

  queryTilesetData()
  queryGaodePOI = new mars3d.query.GaodePOI()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function createLayer(layers) {
  return mars3d.LayerUtil.create(layers) // 创建图层
}

// 添加矢量数据图层
export function addLayer(layer) {
  map.addLayer(layer)
  layer.flyTo()
}

// 取消勾选移除图层
export function removeLayer(layer) {
  map.removeLayer(layer)
}

// export function cutModel(layer) {
//   // 3d模型裁剪
//   const tilesetPlanClip = new mars3d.thing.TilesetClip({
//     layer: layer,
//     clipOutSide: true, // 外裁剪
//     positions: [
//       [117.196484, 31.803549],
//       [117.196484, 31.835931],
//       [117.247038, 31.835931],
//       [117.247038, 31.803549]
//     ]
//   })
//   map.addThing(tilesetPlanClip)
// }

export function cutModel(layer) {
  // 3d模型裁剪
  tilesetClip = new mars3d.thing.TilesetClip({
    layer: layer,
    clipOutSide: false, // 内裁剪
    positions: [
      [117.217052, 31.828226, 33],
      [117.226442, 31.826613, 36.3],
      [117.226796, 31.807994, 21.8],
      [117.209922, 31.808607, 34.8],
      [117.209823, 31.816096, 23.9],
      [117.214736, 31.816278, 34],
      [117.214412, 31.82334, 33.6],
      [117.216856, 31.823559, 28.4]
    ]
  })
  map.addThing(tilesetClip)
}

// 数据获取
function queryTilesetData() {
  mars3d.Util.fetchJson({ url: "config/tileset.json" })
    .then(function (arr) {
      const modelData = arr.layers
      eventTarget.fire("loadTypeList", { modelData })
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}
