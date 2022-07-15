import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.667339, lng: 117.301893, alt: 40357, heading: 2, pitch: -68 },
    highDynamicRange: false
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "百度电子",
      icon: "img/basemaps/gaode_vec.png",
      type: "baidu",
      layer: "vec",
      show: true
    },
    {
      name: "百度影像",
      icon: "img/basemaps/gaode_img.png",
      type: "group",
      layers: [
        { name: "底图", type: "baidu", layer: "img_d" },
        { name: "注记", type: "baidu", layer: "img_z" }
      ]
    },
    {
      name: "百度深蓝色",
      icon: "img/basemaps/bd-c-midnight.png",
      type: "baidu",
      layer: "custom",
      style: "midnight"
    },
    {
      name: "百度黑色",
      icon: "img/basemaps/bd-c-dark.png",
      type: "baidu",
      layer: "custom",
      style: "dark"
    },
    {
      name: "离线百度瓦片(示例)",
      icon: "img/basemaps/arcgis.png",
      type: "baidu",
      url: "//data.mars3d.cn/tile/baiduVec/{z}/{x}/{y}.jpg",
      maximumLevel: 12
    }
  ]
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

  globalNotify("已知问题提示", `(1) 百度瓦片纠偏后在部分瓦片拼接处有文字注记对不齐情况。`)
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
  tileLayer = new mars3d.layer.BaiduLayer({
    layer: "time"
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
