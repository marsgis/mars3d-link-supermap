import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.170953, lng: 121.485939, alt: 7473, heading: 10, pitch: -40 }
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

  map.basemap = 2017 // 蓝色底图

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "上海市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-shanghai/tileset.json",
    maximumScreenSpaceError: 8,
    maximumMemoryUsage: 1024,
    marsJzwStyle: true,
    style: {
      color: {
        conditions: [["true", "rgb(3, 104, 255)"]]
      }
    },
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  // 立体围墙扩散效果,面状
  const diffuseWallGlow = new mars3d.graphic.DiffuseWall({
    positions: [
      [121.475616, 31.255374, 5.87],
      [121.482578, 31.248681, 10.85],
      [121.479447, 31.240235, 14.25],
      [121.470002, 31.240496, 12.92],
      [121.46538, 31.249206, 9.53],
      [121.475616, 31.255374, 5.87]
    ],
    style: {
      color: "#ffff00",
      diffHeight: 2000, // 高度
      speed: 10 // 速度
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(diffuseWallGlow)
}

function addDemoGraphic2(graphicLayer) {
  // 立体围墙扩散效果,圆状
  const circleDiffuseWallGlow = new mars3d.graphic.DiffuseWall({
    position: new mars3d.LngLatPoint(121.481165, 31.278668, 44.3), // 圆中心点
    style: {
      diffHeight: 2000, // 高度
      radius: 600, // 半径
      color: "#ff0000",
      speed: 10 // 速度
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(circleDiffuseWallGlow)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CirclePrimitive({
    position: [121.522454, 31.267553, 61.9],
    style: {
      radius: 2000,
      materialType: mars3d.MaterialType.ScanLine,
      materialOptions: {
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        speed: 10
      },
      clampToGround: true // 是否贴地
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  let _rotation = Math.random()

  const graphic = new mars3d.graphic.CircleEntity({
    position: Cesium.Cartesian3.fromDegrees(121.504242, 31.23805, 27.88),
    style: {
      radius: 1500.0,
      // 扫描材质
      materialType: mars3d.MaterialType.CircleScan,
      materialOptions: {
        image: "img/textures/circle-scan.png",
        color: "#00ff00"
      },
      stRotation: new Cesium.CallbackProperty(function (e) {
        _rotation -= 0.1
        return _rotation
      }, false),
      classificationType: Cesium.ClassificationType.BOTH,
      clampToGround: true // 是否贴地
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic5(graphicLayer) {
  let _rotation = Math.random()
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(121.526215, 31.245237, 123.5),
    style: {
      radius: 700.0,
      materialType: mars3d.MaterialType.CircleScan,
      materialOptions: {
        // 扫描材质
        image: "img/textures/circle-two.png",
        color: "#5fc4ee"
      },
      stRotation: new Cesium.CallbackProperty(function (e) {
        _rotation += 0.1
        return _rotation
      }, false),
      classificationType: Cesium.ClassificationType.BOTH,
      clampToGround: true // 是否贴地
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(graphic)
}
