import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.801072, lng: 117.208356, alt: 1250, heading: 35, pitch: -17 }
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
  map.basemap = 2017 // 切换到蓝色底图

  const tilesetLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/jzw-hefei2/tileset.json",
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    style: {
      color: {
        conditions: [["true", `color("rgba(42, 160, 224, 1)")`]]
      }
    },
    marsJzwStyle: true, // 打开建筑物特效（内置Shader代码）
    center: { lat: 31.801072, lng: 117.208356, alt: 1250, heading: 35, pitch: -17 },
    popup: "all"
  })
  map.addLayer(tilesetLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const arrData = []
  for (let j = 0; j < 100; ++j) {
    const startPt = randomPoint()

    const endPt = startPt.clone()
    endPt.alt = random(1000, 2000)

    arrData.push({
      positions: [startPt, endPt],
      style: {
        width: 1,
        materialType: mars3d.MaterialType.LineFlowColor,
        materialOptions: {
          color: "rgb(141,172,172)",
          speed: random(5, 10),
          startTime: random(1000, 3000),
          percent: 0.1,
          alpha: 0.01
        }
      }
    })
  }

  // 多个线对象的合并渲染。
  const graphic = new mars3d.graphic.PolylineCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(graphic)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

// 取区域内的随机点
function randomPoint() {
  const jd = random(117.208056 * 1000, 117.25548 * 1000) / 1000
  const wd = random(31.816617 * 1000, 31.855756 * 1000) / 1000
  return new mars3d.LngLatPoint(jd, wd, 100)
}

// 取随机数字
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
