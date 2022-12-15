import * as mars3d from "mars3d"

export let map

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: {
      lat: 28.440864,
      lng: 119.486477,
      alt: 588.23,
      heading: 268.6,
      pitch: -37.8,
      roll: 359.8
    },
    fxaa: true,
    requestRenderMode: true // 显式渲染
  },
  control: {
    infoBox: false
  },
  layers: []
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

  // 固定光照时间
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2022-11-01 12:00:00"))
  // map.clock.shouldAnimate = false

  // 固定光照方向
  map.scene.light = new Cesium.DirectionalLight({
    direction: map.scene.camera.direction
  })
  map.camera.percentageChanged = 0.001
  map.on(mars3d.EventType.cameraChanged, function (event) {
    map.scene.light.direction = map.scene.camera.direction
  })


  // 调试面板
  map.viewer.extend(Cesium.viewerCesiumInspectorMixin)
  map.scene.globe.depthTestAgainstTerrain = false

  // 针对不同终端的优化配置
  if (isPCBroswer()) {
    // Cesium 1.61以后会默认关闭反走样，对于桌面端而言还是开启得好，
    map.scene.postProcessStages.fxaa.enabled = true

    // 鼠标滚轮放大的步长参数
    map.scene.screenSpaceCameraController._zoomFactor = 2.0

    // IE浏览器优化
    if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
      map.viewer.targetFrameRate = 20 // 限制帧率
      map.viewer.requestRenderMode = true // 取消实时渲染
    }
  } else {
    // 鼠标滚轮放大的步长参数
    map.scene.screenSpaceCameraController._zoomFactor = 5.0

    // 移动设备上禁掉以下几个选项，可以相对更加流畅
    map.viewer.requestRenderMode = true // 取消实时渲染
    map.scene.fog.enabled = false
    map.scene.skyAtmosphere.show = false
    map.scene.globe.showGroundAtmosphere = false
  }

  const type = mars3d.Util.getRequestByName("data")
  switch (type) {
    case "qx-shequ":
      showQxShequDemo()
      break
    case "qx-simiao":
      showQxSimiaoDemo()
      break
    case "jzw-hefei":
      showJzwHefeiDemo()
      break
    case "max-shihua":
      showMaxShihuaDemo()
      break
    case "bim-qiaoliang":
      showBimQiaoliangDemo()
      break
    case "bim-ditiezhan":
      showBimDitiezhanDemo()
      break
    case "pnts-ganta":
      showPntsGantaDemo()
      break
    default:
      showQxShequDemo()
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

/**
 * 浏览器
 *
 * @returns {void}
 */
function isPCBroswer() {
  const sUserAgent = navigator.userAgent.toLowerCase()

  const bIsIpad = sUserAgent.match(/ipad/i) === "ipad"
  const bIsIphoneOs = sUserAgent.match(/iphone/i) === "iphone"
  const bIsMidp = sUserAgent.match(/midp/i) === "midp"
  const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === "rv:1.2.3.4"
  const bIsUc = sUserAgent.match(/ucweb/i) === "ucweb"
  const bIsAndroid = sUserAgent.match(/android/i) === "android"
  const bIsCE = sUserAgent.match(/windows ce/i) === "windows ce"
  const bIsWM = sUserAgent.match(/windows mobile/i) === "windows mobile"
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    return false
  } else {
    return true
  }
}

// 绑定事件
export function bindTestTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
}
export function bindWireframe(val) {
  // 三角网
  tiles3dLayer.tileset.debugWireframe = val // cesium1.97之前
  // tiles3dLayer.tileset._enableDebugWireframe = val // cesium 1.98+
}
export function bindBoundbox(val) {
  // 包围盒
  tiles3dLayer.tileset.debugShowBoundingVolume = val
}
export function bindGfirstperson(val) {
  // 键盘漫游
  map.keyboardRoam.enabled = val
}

let tiles3dLayer
/**
 * 移除图层
 *
 * @returns {void}
 */
function removeLayer() {
  if (tiles3dLayer) {
    map.basemap = 2021 // 切换到默认影像底图

    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
}

/**
maximumMemoryUsage 参数详细解释：这个参数默认是512，也即是当几何体和纹理资源大于512MB的时候，Cesium就会淘汰掉当前帧中没有visited的所有块，这个值其实很小，也是cesium为了避免资源占用过高的一个保障，不过上述我们也估算过最差情况下，没有做纹理crn压缩的情况下，这个值很容易被超过，导致很多人误以为cesium的淘汰没有效果。

这个值如果设置的过小，导致cesium几乎每帧都在尝试淘汰数据，增加了遍历的时间，也同时增加了崩溃的风险。
这个值如果设置的过大，cesium的淘汰机制失效，那么容易导致显存超过显卡内存，也会导致崩溃。

这个值应该处于最差视角下资源占用 和 显存最大量之间。结论：这个参数要根据当前显卡显存来配置，如果我们场景只显示这一个倾斜数据，这个可以设置到显存的50 % 左右，比如我的显存是6G，这个可以设置到3000左右。那么既保证不超过显存限制，又可以最大利用显存缓存，配合crn压缩之后，这个几乎可以保证你第二次查看倾斜同一位置的时候，看不到加载过程，非常棒。
*/

/**
 * 倾斜摄影 县城社区
 *
 * @export showJzwHefeiDemo 倾斜摄影
 * @returns {void}
 */
export function showQxShequDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "县城社区",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 11.5 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    dynamicScreenSpaceError: true,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    center: { lat: 28.439577, lng: 119.476925, alt: 229, heading: 57, pitch: -29 },

    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  tiles3dLayer.readyPromise.then(function (layer) {
    console.log("load完成", layer)
  })

  // 加载的事件 只执行一次
  tiles3dLayer.on(mars3d.EventType.initialTilesLoaded, function (event) {
    console.log("触发initialTilesLoaded事件", event)
  })

  // 会执行多次，重新加载一次完成后都会回调
  tiles3dLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
    console.log("触发allTilesLoaded事件", event)
  })
}

/**
 * 倾斜摄影 景区文庙
 *
 * @export showJzwHefeiDemo 倾斜摄影
 * @returns {void}
 */
export function showQxSimiaoDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "文庙",
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 80.6 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    // "skipLevelOfDetail": true,
    // "loadSiblings": true,
    // "cullRequestsWhileMoving": true,
    // "cullRequestsWhileMovingMultiplier": 10,
    // "preferLeaves": true,
    // "dynamicScreenSpaceError": true,
    // "preloadWhenHidden": true,
    // highlight: {
    //   all: true, //全部整体高亮，false时是构件高亮
    //   type: mars3d.EventType.click, //默认为鼠标移入高亮，也可以指定click单击高亮
    //   color: "#00ffff",
    // },
    // distanceDisplayCondition_far: 3000,
    center: {
      lat: 33.589536,
      lng: 119.032216,
      alt: 145.08,
      heading: 3.1,
      pitch: -22.9,
      roll: 0
    },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 加载的事件 只执行一次
  tiles3dLayer.on(mars3d.EventType.initialTilesLoaded, function (event) {
    console.log("触发initialTilesLoaded事件", event)
  })
}

/**
 * 城市白膜建筑物 合肥市区
 * @returns {void}
 */
export function showJzwHefeiDemo() {
  removeLayer()

  map.basemap = 2017 // 切换到蓝色底图

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    marsJzwStyle: true, // 打开建筑物特效（内置Shader代码）
    popup: [
      { field: "objectid", name: "编号" },
      { field: "name", name: "名称" },
      { field: "height", name: "楼高", unit: "米" }
    ],
    center: { lat: 31.795311, lng: 117.206139, alt: 1833, heading: 29, pitch: -26 },
    highlight: {
      type: mars3d.EventType.click, // 单击高亮
      outlineEffect: true, // 采用OutlineEffect方式来高亮
      color: "#FFFF00",
      width: 4
    },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 单击事件
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了3dtiles图层", event)
  })
}

// 示例：点云数据 塔杆
export function showPntsGantaDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "高压线塔杆",
    url: "//data.mars3d.cn/3dtiles/pnts-ganta/tileset.json",
    maximumScreenSpaceError: 1,
    position: { alt: 31 },
    style: {
      color: {
        conditions: [
          ["(${Classification} >= 4) && (${Classification} < 5) ", "color('#DC143C')"],
          ["(${Classification} >= 7) && (${Classification} < 8)  ", "color('#7B68EE')"],
          ["(${Classification} >= 16) && (${Classification} < 17)  ", "color('#00CED1')"],
          ["(${Classification} >= 17) && (${Classification} < 18)  ", "color('#3CB371')"],
          ["(${Classification} >= 18) && (${Classification} < 19)  ", "color('#FFFF00')"],
          ["(${Classification} >= 19) && (${Classification} < 20)  ", "color('#FFA500')"],
          ["(${Classification} >= 20) && (${Classification} < 21)  ", "color('#FF6347')"]
        ]
      }
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 单击事件
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了3dtiles图层", event)
  })
}

/**
 * 人工建模 石化工厂
 *
 * @export showMaxShihuaDemo 石化工厂模型
 * @returns {void}
 */
export function showMaxShihuaDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "石化工厂",
    url: "//data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: 24.6 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,

    // 以下参数可以参考用于3dtiles总数据大，清晰度过高情况下进行性能优化。这不是一个通用的解决方案，但可以以此为参考。
    skipLevelOfDetail: true,
    loadSiblings: true,
    cullRequestsWhileMoving: true,
    cullRequestsWhileMovingMultiplier: 10,
    preferLeaves: true,
    dynamicScreenSpaceError: true,
    preloadWhenHidden: true,
    // 以上为优化的参数

    // popup: "all",
    highlight: {
      type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
      outlineEffect: true, // 采用OutlineEffect方式来高亮
      color: "#00FF00",
      width: 6
    },
    center: { lat: 31.653047, lng: 117.084439, alt: 354, heading: 319, pitch: -23 },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 可以绑定Popup弹窗，回调方法中任意处理
  tiles3dLayer.bindPopup(function (event) {
    const attr = event.graphic.attr
    // attr["视频"] = `<video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style="width: 300px;" ></video>`;
    return mars3d.Util.getTemplateHtml({ title: "石化工厂", template: "all", attr: attr })
  })

  // 单击事件
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了3dtiles图层", event)
  })
}

/**
 * BIM 桥梁
 *
 * @export showBimQiaoliangDemo 桥梁模型
 * @returns {void}
 */
export function showBimQiaoliangDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "桥梁",
    url: "//data.mars3d.cn/3dtiles/bim-qiaoliang/tileset.json",

    // 以下参数可以参考用于3dtiles总数据大，清晰度过高情况下进行性能优化。这不是一个通用的解决方案，但可以以此为参考。
    maximumScreenSpaceError: 16, // 【重要】数值加大，能让最终成像变模糊
    maximumMemoryUsage: 512, // 【重要】内存建议显存大小的50%左右，内存分配变小有利于倾斜摄影数据回收，提升性能体验

    skipLevelOfDetail: true, // 是Cesium在1.5x 引入的一个优化参数，这个参数在金字塔数据加载中，可以跳过一些级别，这样整体的效率会高一些，数据占用也会小一些。但是带来的异常是：1） 加载过程中闪烁，看起来像是透过去了，数据载入完成后正常。2，有些异常的面片，这个还是因为两级LOD之间数据差异较大，导致的。当这个参数设置false，两级之间的变化更平滑，不会跳跃穿透，但是清晰的数据需要更长，而且还有个致命问题，一旦某一个tile数据无法请求到或者失败，导致一直不清晰。所以我们建议：对于网络条件好，并且数据总量较小的情况下，可以设置false，提升数据显示质量。
    loadSiblings: true, // 如果为true则不会在已加载完模型后，自动从中心开始超清化模型
    cullRequestsWhileMoving: true,
    cullRequestsWhileMovingMultiplier: 10, // 【重要】 值越小能够更快的剔除
    preferLeaves: true, // 【重要】这个参数默认是false，同等条件下，叶子节点会优先加载。但是Cesium的tile加载优先级有很多考虑条件，这个只是其中之一，如果skipLevelOfDetail=false，这个参数几乎无意义。所以要配合skipLevelOfDetail=true来使用，此时设置preferLeaves=true。这样我们就能最快的看见符合当前视觉精度的块，对于提升大数据以及网络环境不好的前提下有一点点改善意义。
    progressiveResolutionHeightFraction: 0.5, // 【重要】 数值偏于0能够让初始加载变得模糊
    dynamicScreenSpaceError: true, // true时会在真正的全屏加载完之后才清晰化模型
    preloadWhenHidden: true, // tileset.show是false时，也去预加载数据
    // 以上为优化的参数

    position: { lng: 117.096906, lat: 31.851564, alt: 45 },
    rotation: { z: 17.5 },
    highlight: {
      type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
      // all: true,
      color: "#00FF00"
    },
    // popup: 'all',
    center: { lat: 31.8503, lng: 117.101008, alt: 307.73, heading: 291, pitch: -30, roll: 0 },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 可以绑定Popup弹窗，回调方法中任意处理
  tiles3dLayer.bindPopup(function (event) {
    const attr = event.graphic.attr
    return mars3d.Util.getTemplateHtml({ title: "桥梁", template: "all", attr: attr })
  })

  // 单击事件
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了3dtiles图层", event)
  })
}

/**
 * BIM 桥梁
 *
 * @export showBimDitiezhanDemo 桥梁模型
 * @returns {void}
 */
export function showBimDitiezhanDemo() {
  removeLayer()

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "轻轨地铁站",
    url: "//data.mars3d.cn/3dtiles/bim-ditiezhan/tileset.json",
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 1024,
    position: { lng: 117.203994, lat: 31.857999, alt: 28.9 },
    rotation: { z: 168.1 },

    highlight: {
      type: "click",
      color: "#00FF00"
    },
    popup: "all",
    center: { lat: 31.856358, lng: 117.204451, alt: 148, heading: 350, pitch: -30 },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 单击事件
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了3dtiles图层", event)
  })
}
