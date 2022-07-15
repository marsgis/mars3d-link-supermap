import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.810597, lng: 117.220617, alt: 1038, heading: 13, pitch: -30 }
  },
  terrain: {
    show: false
  },
  // 方式1：在创建地球前的参数中配置
  layers: [
    {
      name: "兴趣点",
      type: "arcgis_wfs",
      url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer/1",
      where: " 1=1 ",
      minimumLevel: 16,
      symbol: {
        type: "billboardP",
        styleOptions: {
          image: "img/marker/mark-blue.png",
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          clampToGround: true,
          label: {
            text: "{NAME}",
            font_size: 15,
            color: "#ffffff",
            outline: true,
            outlineColor: "#000000",
            pixelOffsetY: -30,
            distanceDisplayCondition: true,
            distanceDisplayCondition_far: 1500,
            distanceDisplayCondition_near: 0
          }
        }
      },
      popup: "名称：{NAME}<br />地址：{address}",
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

  // 添加演示图层
  addArcGisWFSLayer1()
  addArcGisWFSLayer2()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
function addArcGisWFSLayer1() {
  const changeLevel = 15

  // 瓦片图，对比参考用
  const tileLayer = new mars3d.layer.ArcGisLayer({
    name: "瓦片图层",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer",
    layers: "37",
    popup: "数据：瓦片图层<br />名称：{NAME}<br />层数：{floor}",
    maximumLevel: changeLevel - 1,
    maximumTerrainLevel: changeLevel - 1
  })
  map.addLayer(tileLayer)

  // 动态矢量图
  const wfsLayer = new mars3d.layer.ArcGisWfsLayer({
    name: "建筑物面矢量图层",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer/37",
    where: " NAME like '%合肥%' ",
    minimumLevel: changeLevel,
    symbol: {
      type: "polygonP",
      styleOptions: {
        color: "#FED976",
        outline: false,
        opacity: 1
      }
    },
    buildings: {
      cloumn: "floor"
    },
    debuggerTileInfo: false,
    popup: "数据：矢量图层<br />名称：{NAME}<br />层数：{floor}"
  })
  map.addLayer(wfsLayer)

  // 绑定事件
  wfsLayer.on(mars3d.EventType.loadConfig, function (event) {
    console.log("加载完成服务信息", event)
  })

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

  setTimeout(function () {
    // 测试更换条件
    wfsLayer.setWhere(" 1=1 ")
  }, 10000)
}

// 适合少于1000条的少量数据，一次性请求加载
function addArcGisWFSLayer2() {
  // 一次性加载的wfs图层
  const wfsLayer = new mars3d.layer.ArcGisWfsSingleLayer({
    name: "合肥边界线",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer/41",
    symbol: {
      type: "polyline",
      styleOptions: {
        color: "#39E09B",
        width: 8,
        opacity: 0.8
      }
    },
    popup: "all"
  })
  map.addLayer(wfsLayer)
}

// 图层状态 在组件中进行管理的图层
export function getManagerLayer() {
  return map.getLayerByAttr("建筑物面矢量图层", "name")
}
