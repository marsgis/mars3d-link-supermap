import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 14.741847, lng: 108.420914, alt: 10003793, heading: 0, pitch: -83 }
  },
  basemaps: [
    {
      pid: 10,
      name: "卫星地图",
      type: "xyz",
      icon: "img/basemaps/mapboxSatellite.png",
      url: "//data.mars3d.cn/tile/googleImg/{z}/{x}/{y}.jpg",
      minimumLevel: 0,
      maximumLevel: 12,
      show: true
    },
    {
      pid: 10,
      name: "单张图片",
      icon: "img/basemaps/offline.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/world.jpg"
    }
  ],
  layers: [
    {
      name: "卫星注记",
      type: "xyz",
      url: "//data.mars3d.cn/tile/tdtImgZj/{z}/{x}/{y}.png",
      minimumLevel: 0,
      maximumLevel: 12,
      show: true
    }
  ]
}
/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
