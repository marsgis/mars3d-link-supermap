import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.799033, lng: 117.177563, alt: 4324.03, heading: 0, pitch: -45, roll: 0 },
    fxaa: true
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  showShanghaiDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function removeLayer() {
  map.trackedEntity = null
  if (graphicLayer) {
    map.removeLayer(graphicLayer, true)
    graphicLayer = null
  }

  // 重置状态
  eventTarget.fire("defuatData", {
    enabledShowHide: true,
    enabledPopup: true,
    enabledTooltip: false,
    enabledRightMenu: false
  })
}

// 示例：上海
export function showShanghaiDemo() {
  removeLayer()

  // 创建gltf模型，
  graphicLayer = new mars3d.layer.GraphicLayer({
    name: "上海浦东",
    data: [
      {
        type: "modelP",
        position: [121.507762, 31.233975, 200],
        style: {
          url: "//data.mars3d.cn/gltf/mars/shanghai/scene.gltf",
          scale: 520,
          heading: 215
        }
      }
    ],
    center: { lat: 31.251138, lng: 121.463588, alt: 1729.97, heading: 110.7, pitch: -25, roll: 0.2 },
    popup: "上海浦东模型",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：骨骼动画
export function showDonghuaDemo() {
  removeLayer()

  // 创建gltf模型
  graphicLayer = new mars3d.layer.GraphicLayer({
    name: "骨骼动画",
    data: [
      {
        type: "modelP",
        position: [117.170624, 31.840666, 278.66],
        style: {
          url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
          scale: 200,
          heading: 270
        }
      },
      {
        type: "modelP",
        position: [117.184442, 31.842172, 33.92],
        style: {
          url: "//data.mars3d.cn/gltf/mars/firedrill/xiaofangyuan-run.gltf",
          scale: 300
        }
      }
    ],
    center: { lat: 31.817737, lng: 117.179117, alt: 1810, heading: 0, pitch: -30, roll: 0 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 风力发电机
export function showFenliDemo() {
  removeLayer()

  const positions = [
    { lng: 112.227630577, lat: 39.0613382363999, alt: 1815 },
    { lng: 112.229302206, lat: 39.0579481036999, alt: 1827 },
    { lng: 112.226596341, lat: 39.0584773033999, alt: 1849 },
    { lng: 112.22511174, lat: 39.0574840383999, alt: 1866 },
    { lng: 112.225476722, lat: 39.0550566812, alt: 1866 },
    { lng: 112.225643865, lat: 39.0532631538, alt: 1899 },
    { lng: 112.229228645, lat: 39.0525930380999, alt: 1880 },
    { lng: 112.224976033, lat: 39.0502488098, alt: 1926 },
    { lng: 112.225661372999, lat: 39.0484097539999, alt: 1948 },
    { lng: 112.229409737, lat: 39.0474211486, alt: 1910 },
    { lng: 112.224894212, lat: 39.0464248147999, alt: 1983 },
    { lng: 112.224022809, lat: 39.0436919592999, alt: 2036 },
    { lng: 112.224492463, lat: 39.0413040158, alt: 2036 },
    { lng: 112.223470676999, lat: 39.0381470684, alt: 2038 },
    { lng: 112.220336836, lat: 39.039450506, alt: 2071 },
    { lng: 112.221019662, lat: 39.0367113260999, alt: 2063 },
    { lng: 112.221282611, lat: 39.045567662, alt: 2026 },
    { lng: 112.221147308, lat: 39.0439265946, alt: 2048 },
    { lng: 112.2216533, lat: 39.041840792, alt: 2056 },
    { lng: 112.222813848, lat: 39.0343489941, alt: 2075 },
    { lng: 112.225573092, lat: 39.0307660108, alt: 2015 },
    { lng: 112.220069655, lat: 39.0323883292, alt: 2022 },
    { lng: 112.217448043999, lat: 39.0310627231, alt: 2021 },
    { lng: 112.230322327, lat: 39.0281575923999, alt: 1965 }
  ]

  const arr = []
  positions.forEach((item) => {
    arr.push({
      type: "modelP",
      position: item,
      style: {
        url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
        scale: 40,
        heading: 135,
        minimumPixelSize: 30,
        clampToGround: true
      }
    })
  })

  // 创建gltf模型
  graphicLayer = new mars3d.layer.GraphicLayer({
    name: "风力发电机",
    data: arr,
    center: { lat: 39.066518, lng: 112.245269, alt: 2913, heading: 226, pitch: -21, roll: 0 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 光伏电场
export function showGuangfu() {
  removeLayer()

  // 创建图层
  graphicLayer = new mars3d.layer.GraphicLayer({
    name: "光伏电场",
    center: { lat: 42.786315, lng: 93.105225, alt: 2095, heading: 57, pitch: -44 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })

  // 构造数据
  const longitudeString = 93.1214
  const latitudeString = 42.7863
  const height = 678
  const heading = 0
  // 光伏电厂位置太阳能电池板位置
  for (let i = 0; i < 120; i++) {
    let point
    if (i < 20) {
      point = { lng: longitudeString, lat: latitudeString + i / 1000, alt: height }
    } else if (i < 40) {
      point = { lng: longitudeString - 0.00082, lat: latitudeString + (i - 20) / 1000, alt: height }
    } else if (i < 60) {
      point = { lng: longitudeString - 0.00164, lat: latitudeString + (i - 40) / 1000, alt: height }
    } else if (i < 80) {
      point = { lng: longitudeString - 0.00256, lat: latitudeString + (i - 60) / 1000, alt: height }
    } else if (i < 100) {
      point = { lng: longitudeString - 0.00338, lat: latitudeString + (i - 80) / 1000, alt: height }
    } else if (i < 120) {
      point = { lng: longitudeString - 0.0042, lat: latitudeString + (i - 100) / 1000, alt: height }
    }

    const graphic = new mars3d.graphic.ModelPrimitive({
      name: "风机",
      position: point,
      style: {
        url: "//data.mars3d.cn/gltf/mars/taiyang/taiyang.gltf",
        scale: 1,
        heading: heading,
        minimumPixelSize: 30,
        clampToGround: true
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}
