import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.798703, lng: 117.207366, alt: 2033, heading: 31, pitch: -29 }
  },
  terrain: {
    show: false
  },
  layers: [
    {
      name: "合肥教育点",
      type: "wfs",
      url: "//server.mars3d.cn/geoserver/mars/wfs",
      layer: "mars:hfjy",
      parameters: {
        // 支持所有wfs的参数
        maxFeatures: 500
      },
      minimumLevel: 13,
      debuggerTileInfo: false,
      symbol: {
        type: "billboardP",
        styleOptions: {
          image: "img/marker/mark-red.png",
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: true,
          scaleByDistance_far: 20000,
          scaleByDistance_farValue: 0.6,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1,
          clampToGround: true,
          label: {
            text: "{项目名称}",
            font_size: 15,
            color: "#ffffff",
            outline: true,
            outlineColor: "#000000",
            pixelOffsetY: -30,
            distanceDisplayCondition: true,
            distanceDisplayCondition_far: 2000,
            distanceDisplayCondition_near: 0
          }
        }
      },
      popup: "all",
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
  map = mapInstance // 记录首次创建的map
  map.basemap = 2017 // 蓝色底图

  addWmsLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
/**
 * WFS图层
 *
 * @returns {void} 无
 */
function addWmsLayer() {
  const changeLevel = 15

  // 瓦片图，参考用
  const tileLayer = new mars3d.layer.WmsLayer({
    name: "建筑物面WMS",
    type: "wms",
    url: "//server.mars3d.cn/geoserver/mars/wms",
    layers: "mars:hfjzw",
    crs: "EPSG:4326",
    parameters: {
      transparent: "true",
      format: "image/png"
    },
    maximumLevel: changeLevel - 1,
    maximumTerrainLevel: changeLevel - 1,
    popup: "名称：{NAME}<br />层数：{floor}",
    show: true
  })
  map.addLayer(tileLayer)

  const wfsLayer = new mars3d.layer.WfsLayer({
    name: "建筑物面WFS",
    url: "//server.mars3d.cn/geoserver/mars/wfs",
    layer: "mars:hfjzw",
    parameters: {
      // 支持所有wfs的参数
      maxFeatures: 210
    },
    minimumLevel: changeLevel,
    symbol: {
      type: "polygonP",
      styleOptions: {
        color: "#00469c",
        outline: false,
        opacity: 1
      }
    },
    buildings: {
      cloumn: "floor"
    },
    debuggerTileInfo: false,
    popup: "名称：{NAME}<br />层数：{floor}",
    show: true
  })
  map.addLayer(wfsLayer)

  // 绑定事件
  wfsLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })

  let timeTik
  wfsLayer.on(mars3d.EventType.update, function (event) {
    console.log(`图层内数据更新了`, event)

    clearTimeout(timeTik)
    timeTik = setTimeout(() => {
      if (!wfsLayer.isLoading) {
        console.log(`本批次数据加载完成`)
      }
    }, 1000)
  })
}

// 图层状态 在组件中进行管理的图层
export function getManagerLayer() {
  return map.getLayerByAttr("建筑物面WFS", "name")
}
