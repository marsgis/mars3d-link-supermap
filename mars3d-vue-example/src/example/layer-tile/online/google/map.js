import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.675177, lng: 117.323257, alt: 81193, heading: 0, pitch: -79 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "谷歌影像",
      icon: "img/basemaps/google_img.png",
      type: "xyz",
      url: "https://boxa.earthol.com/map.jpg?lyrs=y&gl=cn&x={x}&y={y}&z={z}",
      chinaCRS: mars3d.ChinaCRS.GCJ02,
      show: true
    },
    {
      name: "谷歌影像(WGS84)",
      icon: "img/basemaps/google_img.png",
      type: "google",
      layer: "img_d",
      chinaCRS: mars3d.ChinaCRS.WGS84
    },
    {
      name: "谷歌影像",
      icon: "img/basemaps/esriWorldImagery.png",
      type: "group",
      layers: [
        { name: "底图", type: "google", layer: "img_d", chinaCRS: mars3d.ChinaCRS.GCJ02 },
        { name: "注记", type: "google", layer: "img_d", chinaCRS: mars3d.ChinaCRS.GCJ02 }
      ]
    },
    {
      name: "谷歌电子",
      icon: "img/basemaps/google_vec.png",
      type: "google",
      layer: "vec",
      chinaCRS: mars3d.ChinaCRS.GCJ02
    },
    {
      name: "谷歌地形",
      icon: "img/basemaps/stamenWatercolor.png",
      type: "google",
      layer: "ter",
      chinaCRS: mars3d.ChinaCRS.GCJ02
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

  globalNotify("已知问题提示", `按国家测绘主管部门的通知,  目前国家相关部门对未经审核批准的谷歌等地图做了封锁及下架，目前谷歌地图服务暂不可用`)


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
  tileLayer = new mars3d.layer.GoogleLayer({
    name: "谷歌地形",
    layer: "ter",
    chinaCRS: mars3d.ChinaCRS.GCJ02
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
