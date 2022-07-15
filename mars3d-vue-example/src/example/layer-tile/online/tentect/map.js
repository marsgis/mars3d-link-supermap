import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.82034, lng: 117.411297, alt: 56459, heading: 0, pitch: -87 },
    highDynamicRange: false
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "腾讯电子",
      icon: "img/basemaps/gaode_vec.png",
      type: "tencent",
      layer: "vec",
      show: true
    },
    {
      name: "腾讯影像",
      icon: "img/basemaps/gaode_img.png",
      type: "group",
      layers: [
        { name: "底图", type: "tencent", layer: "img_d" },
        { name: "注记", type: "tencent", layer: "img_z" }
      ]
    },
    {
      name: "腾讯深蓝色",
      icon: "img/basemaps/bd-c-midnight.png",
      type: "tencent",
      layer: "custom",
      style: "4"
    }
  ]
}

export const eventTarget = new mars3d.BaseClass()

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

// 叠加的图层
let tileLayer

export function addTileLayer() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.TencentLayer({
    layer: "custom",
    style: "4"
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
