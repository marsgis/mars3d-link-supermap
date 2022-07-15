import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.838348, lng: 117.206494, alt: 752, heading: 359, pitch: -54 }
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

  // 三维模型【目前没有全合肥的模型，下面模型为了测试下】
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    type: "3dtiles",
    name: "合肥国家大学科技园",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: -24 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    show: true
  })
  map.addLayer(tilesetLayer)

  map.on(mars3d.EventType.load, () => {
    addWfsLayer()
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addWfsLayer() {
  // 单体化图层【支持geoserver的wfs服务配置dth属性】
  const wfsLayer = new mars3d.layer.WfsLayer({
    name: "建筑物面",
    url: "//server.mars3d.cn/geoserver/mars/wfs",
    layer: "mars:hfjzw",
    parameters: {
      // 支持所有wfs的参数
      maxFeatures: 500
    },
    minimumLevel: 15,
    debuggerTileInfo: false,
    popup: "名称：{NAME}<br />层数：{floor}",
    symbol: {
      type: "polygonP",
      styleOptions: {
        // 单体化默认显示样式
        color: "rgba(255, 255, 255, 0.01)",
        clampToGround: true,
        classification: true,
        buffer: 2,
        // 单体化鼠标移入或单击后高亮的样式
        highlight: {
          // type: mars3d.EventType.click,
          color: "rgba(255,255,0,0.4)"
        }
      }
    },
    show: true
  })
  map.addLayer(wfsLayer)

  // 单体化图层【也支持arcgis的wfs服务配置dth属性】
  //  let wfsLayer = new mars3d.layer.ArcGisWfsLayer({
  //   name: "建筑物面矢量图层",
  //   url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer/37",
  //   minimumLevel: 15,
  //   debuggerTileInfo: false,
  //   popup: "名称：{NAME}<br />层数：{floor}",
  //   symbol: {
  //     type: "polygonP",
  //     styleOptions: {
  //       // 单体化默认显示样式
  //       color: "rgba(255, 255, 255, 0.01)",
  //       clampToGround: true,
  //       classification: true,
  //       // 单体化鼠标移入或单击后高亮的样式
  //       highlight: {
  //         // type: mars3d.EventType.click,
  //         color: "rgba(255,255,0,0.4)"
  //       }
  //     }
  //   }
  // })
  // map.addLayer(wfsLayer)
}
