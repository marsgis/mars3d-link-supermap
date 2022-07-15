import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.823874, lng: 117.223976, alt: 3509, heading: 0, pitch: -90 }
  },
  control: {
    baseLayerPicker: false
  }
}

/**
 * 构造bloom效果对象
 * @type {mars3d.BloomEffect}
 */
let bloomEffect

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  console.log("onMounted执行了")
  map = mapInstance // 记录首次创建的map

  // 构造bloom效果 用于滑动条测试
  bloomEffect = new mars3d.effect.BloomEffect()
  map.addEffect(bloomEffect)

  eventTarget.fire("init", {
    value: 10
  })
  queryTilesetData()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  console.log("onUnmounted执行了")
  map.graphicLayer.clear()
  map.removeEffect(bloomEffect, true)
  bloomEffect = null
  map = null
}

// 绘制矩形（演示map.js与index.vue的交互）
export function drawExtent() {
  map.graphicLayer.clear()
  // 绘制矩形
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      fill: true,
      color: "rgba(255,255,0,0.2)",
      outline: true,
      outlineWidth: 2,
      outlineColor: "rgba(255,255,0,1)"
    },
    success: function (graphic) {
      const rectangle = mars3d.PolyUtil.formatRectangle(graphic._rectangle_draw)
      eventTarget.fire("drawExtent", { extent: JSON.stringify(rectangle) }) // 抛出事件，可以组件中去监听事件
    }
  })
}

// 是否运行地图鼠标交互
export function enableMapMouseController(value) {
  map.setSceneOptions({
    cameraController: {
      enableZoom: value,
      enableTranslate: value,
      enableRotate: value,
      enableTilt: value
    }
  })
}

// 调整亮度 （演示滑动条）
export function updateBrightness(val) {
  bloomEffect.brightness = val
}

// 调整对比度 （演示滑动条）
export function updateContrast(val) {
  bloomEffect.contrast = val
}

// 创建图层
export function createLayer(layer) {
  return mars3d.LayerUtil.create(layer)
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
