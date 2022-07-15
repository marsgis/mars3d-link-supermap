import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.614035, lng: 117.292184, alt: 25686, heading: 0, pitch: -44 }
  },
  layers: [
    {
      name: "国境线",
      type: "kml",
      url: "//data.mars3d.cn/file/kml/countryboundary.kml",
      symbol: {
        styleOptions: {
          color: "#FED976",
          width: 2
        }
      },
      popup: "all",
      show: true
    },
    {
      name: "省界线",
      type: "kml",
      url: "//data.mars3d.cn/file/kml/province.kml",
      symbol: {
        styleOptions: {
          color: "#00FF00",
          width: 2
        }
      },
      popup: "all",
      show: true
    }
  ]
}

export const treeEvent = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
  shoRailway()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function removeLayer() {
  map.trackedEntity = null
  if (graphicLayer) {
    map.removeLayer(graphicLayer, true)
    graphicLayer = null
  }
}
// flyTo至目标
export function flyToEntity(entity) {
  map.flyTo(entity)
}

// 示例：
export function shoRailway() {
  removeLayer()

  graphicLayer = new mars3d.layer.KmlLayer({
    url: "//data.mars3d.cn/file/kml/hftl.kml",
    symbol: {
      styleOptions: {
        color: "#00ffff",
        opacity: 0.8,
        width: 3,
        arcType: Cesium.ArcType.GEODESIC,
        clampToGround: true,
        // 标记文字
        label: {
          text: "{name}",
          opacity: 1,
          font_size: 30,
          color: "#ffffff",

          font_family: "楷体",
          outline: true,
          outlineColor: "#000000",
          outlineWidth: 3,

          scaleByDistance: true,
          scaleByDistance_far: 20000,
          scaleByDistance_farValue: 0.1,
          scaleByDistance_near: 100,
          scaleByDistance_nearValue: 1,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 20000)
        }
      }
    },
    center: { lat: 31.653222, lng: 117.273592, alt: 35183, heading: 358, pitch: -63 },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)

    const data = event.list
    treeEvent.fire("tree", { treeData: data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：
export function showExpressway() {
  removeLayer()

  graphicLayer = new mars3d.layer.KmlLayer({
    name: "路线",
    url: "//data.mars3d.cn/file/kml/bslx.kmz",
    symbol: {
      styleOptions: {
        font_family: "楷体",
        arcType: Cesium.ArcType.GEODESIC,
        clampToGround: true
      }
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)

    const data = event.list
    treeEvent.fire("tree", { treeData: data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：
export function showSafetyNotice() {
  removeLayer()

  graphicLayer = new mars3d.layer.KmlLayer({
    name: "海上安全警告",
    url: "//data.mars3d.cn/file/kml/NAVWARN.kmz",
    popup: "{description}",
    center: { lat: 3.851186, lng: 110.508244, alt: 3510625, heading: 7, pitch: -74 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)

    const data = event.list
    treeEvent.fire("tree", { treeData: data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：
export function showMeteorological() {
  removeLayer()

  graphicLayer = new mars3d.layer.KmlLayer({
    name: "气象数据",
    url: "//data.mars3d.cn/file/kml/dg8.kml",
    opacity: 0.7,
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)

    const data = event.list
    treeEvent.fire("tree", { treeData: data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：
export function showGDP() {
  removeLayer()

  graphicLayer = new mars3d.layer.KmlLayer({
    name: "全球各国GDP",
    url: "//data.mars3d.cn/file/kml/gdpPerCapita2008.kmz",
    center: { lat: 5.723953, lng: 90.735755, alt: 24143420, heading: 359, pitch: -87 },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)

    const data = event.list
    treeEvent.fire("tree", { treeData: data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}
