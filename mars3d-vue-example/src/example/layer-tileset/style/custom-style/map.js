import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tilesetLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.658282, lng: 117.070076, alt: 521, heading: 94, pitch: -33 }
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

  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "石化工厂",
    url: "//data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: 24.6 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    highlight: { type: "click", outlineEffect: true, width: 8, color: "#FFFF00" },
    popup: "all"
  })
  map.addLayer(tilesetLayer)

  // 从数据库读取属性后，按下面格式组织好赋值即可[不适合大模型]
  tilesetLayer.setProperties("id", [
    {
      id: "55a7cf9c71f1c9c495413f934dd1a158",
      name: "大烟囱1 - 我是setProperties更新的", // 修改原有属性
      column1: "我是setProperties更新的", // 新增的属性
      testStyle: true // 新增的属性
    },
    {
      id: "559cb990c9dffd8675f6bc2186971dc2",
      name: "大烟囱2 - 我是setProperties更新的", // 修改原有属性
      column1: "我是setProperties更新的", // 新增的属性
      testStyle: true // 新增的属性
    }
  ])

  // 还原或删除赋予的属性
  // setTimeout(() => {
  //   tilesetLayer.setProperties()// 清除所有
  //   tilesetLayer.setProperties("id", [
  //     {
  //       id: "55a7cf9c71f1c9c495413f934dd1a158"
  //     }
  //   ])
  // }, 5000)

  // style回调方法
  tilesetLayer.style = function (event) {
    const attr = event.properties

    // 下面可以根据属性做各类判断后返回不同颜色，隐藏的可以透明度为0
    if (attr.testStyle) {
      return "rgba(255,0,0,1)"
    }
    if (attr.id === "f106b7f99d2cb30c3db1c3cc0fde9ccb") {
      return "rgba(0,255,255,1)"
    }
    if (attr.name === "Obj3d66-771819-1-938") {
      return "rgba(0,255,0,1)"
    }

    return "rgba(255,255,255,0.7)"
  }

  // 还原或删除赋予的样式
  // setTimeout(() => {
  //   tilesetLayer.style = undefined
  // }, 5000)

}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
