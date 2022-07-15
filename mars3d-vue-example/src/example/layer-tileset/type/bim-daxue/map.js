import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tilesetPlanClip
let terrainPlanClip

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.842658, lng: 117.251492, alt: 249, heading: 358, pitch: -59 },
    globe: {
      depthTestAgainstTerrain: true
    }
  },
  control: {
    infoBox: false
  },
  layers: [
    {
      id: 1987,
      name: "教学楼",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
      maximumScreenSpaceError: 16,
      maximumMemoryUsage: 1024,
      highlight: {
        type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
        color: "#00FF00"
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
  map = mapInstance // 记录map

  // BIM模型处理
  const layerWorkBIM = map.getLayerById(1987)

  // 单击事件
  layerWorkBIM.on(mars3d.EventType.click, function (event) {
    console.log("单击了3dtiles图层", event)
  })


  // 遍历取出所有的feature，并查询其属性
  // layerWorkBIM.readyPromise.then(function (e) {
  //   const allTileObj = {}
  //   layerWorkBIM.tileset.tileVisible.addEventListener((tile) => {
  //     const content = tile.content
  //     const featuresLength = content.featuresLength
  //     for (let i = 0; i < featuresLength; i++) {
  //       const feature = content.getFeature(i)
  //       const attr = mars3d.Util.get3DTileFeatureAttr(feature)
  //       allTileObj[attr.id] = attr
  //     }
  //     // 后续使用allTileObj即可
  //     console.log(allTileObj)
  //   })
  // })

  // 键盘漫游
  map.keyboardRoam.setOptions({
    moveStep: 0.1, // 平移步长 (米)。
    dirStep: 50, // 相机原地旋转步长，值越大步长越小。
    rotateStep: 0.3, // 相机围绕目标点旋转速率，0.3-2.0
    minPitch: 0.1, // 最小仰角  0-1
    maxPitch: 0.95 // 最大仰角  0-1
  })
  map.keyboardRoam.enabled = true // 开启键盘漫游

  addPlaneClipThing(layerWorkBIM)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addPlaneClipThing(layerWorkBIM) {
  // 模型裁剪
  tilesetPlanClip = new mars3d.thing.TilesetPlanClip({
    layer: layerWorkBIM,
    type: mars3d.ClipType.ZR,
    distance: 100,
    clipOutSide: false,
    edgeColor: Cesium.Color.GREY,
    edgeWidth: 2.0
  })
  map.addThing(tilesetPlanClip)

  // 挖地区域---负一楼
  terrainPlanClip = new mars3d.thing.TerrainPlanClip({
    positions: [
      [117.251176, 31.843707, 28.24],
      [117.251877, 31.843707, 28.24],
      [117.251877, 31.844216, 28.24],
      [117.251176, 31.844216, 28.24]
    ],
    diffHeight: 10, // 高度
    image: "./img/textures/poly-stone.jpg", // 边界墙材质
    imageBottom: "./img/textures/poly-soil.jpg", // 底部区域材质
    splitNum: 50 // wall边界插值数
  })
  map.addThing(terrainPlanClip)
}

export function centerAtDX1() {
  map.setCameraView({ lat: 31.843703, lng: 117.251038, alt: 33, heading: 50, pitch: -6 })
}

export function centerAtDX2() {
  map.setCameraView({ lat: 31.843816, lng: 117.250978, alt: 34, heading: 308, pitch: -8 })
}

export function centerAtDX3() {
  map.setCameraView({ lat: 31.843789, lng: 117.251188, alt: 42, heading: 6, pitch: -31 })
}

// 通过控制distance的值  1~5以及全部显示
export function showModel(num) {
  terrainPlanClip.show = false
  tilesetPlanClip.distance = num
}

// D1层显示
export function showD1() {
  terrainPlanClip.show = true
  tilesetPlanClip.distance = -3.6
}
