import * as mars3d from "mars3d"
import { HuxingLayer } from "./HuxingLayer.js"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.820474, lng: 117.178655, alt: 326, heading: 24, pitch: -45 }
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

  // HuxingLayer类定义在HuxingLayer.js
  graphicLayer = new HuxingLayer({
    url: "//data.mars3d.cn/file/geojson/huxing.json"
  })
  map.addLayer(graphicLayer)

  // 可以绑定Popup弹窗，回调方法中任意处理
  // layer.bindPopup(function (event) {
  //   let item = event.graphic.attr;
  //   if (!item) {
  //     return false;
  //   }
  //   return mars3d.Util.getTemplateHtml({
  //     title: "楼栋",
  //     attr: item,
  //     template: [
  //       { field: "CH", name: "层号" },
  //       { field: "DYH", name: "单元" },
  //       { field: "FH", name: "房号" },
  //       { field: "WZ", name: "位置" },
  //     ],
  //   });
  // });
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
