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
      type: "kml2json",
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
      type: "kml2json",
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

// flyTo至目标
export function flyToEntity(entity) {
  map.flyTo(entity)
}

function removeLayer() {
  map.trackedEntity = null
  if (graphicLayer) {
    map.removeLayer(graphicLayer, true)
    graphicLayer = null
  }
}

// 示例：
export function shoRailway() {
  removeLayer()

  graphicLayer = new mars3d.layer.Kml2JsonLayer({
    url: "//data.mars3d.cn/file/kml/hftl.kml",
    symbol: function (attr, style, featue) {
      return {
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

  graphicLayer = new mars3d.layer.Kml2JsonLayer({
    name: "路线",
    url: "//data.mars3d.cn/file/kml/bslx.kmz",
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
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

  graphicLayer = new mars3d.layer.Kml2JsonLayer({
    name: "海上安全警告",
    url: "//data.mars3d.cn/file/kml/NAVWARN.kmz",
    symbol: function (attr, style, featue) {
      const geoType = featue.geometry?.type
      if (geoType === "Point") {
        return {
          image: "img/marker/point-red.png",
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          label: {
            text: attr.name,
            font_size: 18,
            color: "#ffffff",
            outline: true,
            outlineColor: "#000000",
            pixelOffsetY: -50,
            scaleByDistance: true,
            scaleByDistance_far: 990000,
            scaleByDistance_farValue: 0.3,
            scaleByDistance_near: 10000,
            scaleByDistance_nearValue: 1
          }
        }
      }
      return style
    },
    popup: "{description}",
    center: { lat: 4.112702, lng: 110.383709, alt: 3269095, heading: 7, pitch: -74 },
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

  graphicLayer = new mars3d.layer.Kml2JsonLayer({
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

  graphicLayer = new mars3d.layer.Kml2JsonLayer({
    name: "全球各国GDP",
    url: "//data.mars3d.cn/file/kml/gdpPerCapita2008.kmz",
    symbol: function (attr, style, featue) {
      const geoType = featue.geometry?.type
      if (geoType === "Point") {
        return {
          type: "label", // 指定用label渲染。
          text: attr.name,
          font_size: 18,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000"
        }
      } else if (geoType === "Polygon") {
        style.extrudedHeight = 1
        // style.diffHeight = featue.geometry?.coordinates[0][0][2]
      }

      return style
    },
    center: { lat: 12.46821, lng: 91.404177, alt: 18969935, heading: 359, pitch: -87 },
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
