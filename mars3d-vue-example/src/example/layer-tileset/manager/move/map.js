import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tiles3dLayer

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 如果模型地址内有“+”符号，可以加下面方法进行自定义处理
  Cesium.Resource.ReplaceUrl = function (url) {
    if (url.endsWith(".json") || url.endsWith(".b3dm")) {
      return url.replace(/\+/gm, "%2B") // 将3dtiles中的“+”符号转义下
    } else {
      return url
    }
  }
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
  removeLayer()
}

function removeLayer() {
  if (tiles3dLayer) {
    map.basemap = 2021 // 切换到默认卫星底图

    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
}

// 是否有地形
export function chkHasTerrain(isStkTerrain) {
  map.hasTerrain = isStkTerrain
}

// 深度检测
export function chkTestTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
}

// 当前页面业务相关
export function showModel(modelUrl) {
  removeLayer()
  if (!modelUrl) {
    return
  }

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: modelUrl,
    maximumScreenSpaceError: 1,

    // 高亮时的样式
    highlight: {
      type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
      color: "#00FF00"
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 加载完成事件
  tiles3dLayer.on(mars3d.EventType.load, function (event) {
    console.log("模型加载完成", event)
  })
}

export function setTranslation(x, y, z) {
  const translation = Cesium.Cartesian3.fromArray([x, y, z])
  const modelMatrix = Cesium.Matrix4.fromTranslation(translation)
  tiles3dLayer.tileset.modelMatrix = modelMatrix

  // 打印值
  const position = mars3d.PointUtil.getPositionByHprAndOffset(tiles3dLayer.position, new Cesium.Cartesian3(x, y, z))
  const point = mars3d.LngLatPoint.parse(position)
  console.log("新坐标为", point)
}
