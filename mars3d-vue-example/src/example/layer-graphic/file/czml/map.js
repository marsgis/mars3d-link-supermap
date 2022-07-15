import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.623244, lng: 123.508771, alt: 345435, heading: 0, pitch: -48 }
    // cameraController: {
    //   maximumZoomDistance: 500000000,
    // },
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true,
    compass: { top: "10px", left: "5px" }
  }
}

export const eventTarget = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式

  // url传入模型地址
  const type = mars3d.Util.getRequestByName("data")
  switch (type) {
    case "feiji":
      showAircraft()
      break
    case "chuanbo":
      showShip()
      break
    case "huojian":
      showRocket()
      break
    default:
      showAircraft()
      break
  }
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

// 示例：
export function showAircraft() {
  removeLayer()

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "飞行编队",
    url: "//data.mars3d.cn/file/czml/flight.czml",
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("数据加载完成", data)
    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：
export function showCar() {
  removeLayer()

  map.setCameraView({ lat: 40.893923, lng: 121.917192, alt: 691, heading: 64, pitch: -46 })

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "汽车",
    url: "//data.mars3d.cn/file/czml/car.czml"
    // flyTo: true,
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("数据加载完成", data)
    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：
export function showShip() {
  removeLayer()

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "船舶编队",
    url: "//data.mars3d.cn/file/czml/ship.czml",
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("数据加载完成", data)
    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：
export function showBDSatellite() {
  removeLayer()

  // 更新地球参数
  map.setSceneOptions({
    cameraController: {
      maximumZoomDistance: 500000000
    }
  })

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "北斗卫星",
    url: "//data.mars3d.cn/file/czml/satellite.czml",
    center: { lng: 10, lat: 111.833884, z: 150000000, heading: 0, pitch: -90, roll: 0 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("数据加载完成", data)

    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

export function showSatellite() {
  removeLayer()

  // 更新地球参数
  map.setSceneOptions({
    cameraController: {
      maximumZoomDistance: 500000000
    }
  })

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "卫星",
    url: "//data.mars3d.cn/file/czml/satellite-simple.czml",
    center: { lat: -20.236138, lng: -144.262661, alt: 41875827, heading: 339, pitch: -90 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("数据加载完成", data)

    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：
export function showRocket() {
  removeLayer()

  map.basemap = "ArcGIS影像"
  map.setCameraView({ lat: 28.561843, lng: -80.577575, alt: 630, heading: 359, pitch: -85 })

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "火箭发射",
    url: "//data.mars3d.cn/file/czml/space.czml",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("数据加载完成", data)
    // 火星发射时，锁定火箭模型对象
    map.trackedEntity = data.dataSource.entities.getById("Vulcan")

    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：
export function showFireDrill() {
  removeLayer()

  map.setCameraView({ lat: 32.891559, lng: 117.360875, alt: 378, heading: 18, pitch: -62 })

  graphicLayer = new mars3d.layer.CzmlLayer({
    name: "消防演练",
    url: "//data.mars3d.cn/file/czml/firedrill.czml"
    // flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (data) {
    console.log("数据加载完成", data)
    eventTarget.fire("loadGraphicLayer", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}
