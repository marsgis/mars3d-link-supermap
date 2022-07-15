import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let geoJsonLayer

export const mapOptions = {
  scene: {
    center: { lat: 31.722018, lng: 117.251926, alt: 8378, heading: 0, pitch: -33 }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2017 // 切换到蓝色底图

  addLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

/**
 * 添加合肥市建筑物和体育设施点
 * @returns {void}
 *
 */
function addLayer() {
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
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
    center: { lat: 31.841018, lng: 117.252932, alt: 1346, heading: 38, pitch: -26 },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "体育设施点",
    url: "//data.mars3d.cn/file/geojson/hfty-point.json",
    symbol: {
      type: "billboard",
      styleOptions: {
        image: "img/marker/mark-red.png",
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(geoJsonLayer)

  // 绑定事件
  geoJsonLayer.on(mars3d.EventType.load, function (event) {
    const geojsonLength = geoJsonLayer.length
    eventTarget.fire("geoJsonLayerLoad", { geojsonLength })
    console.log("数据加载完成", event)
  })
}

// 保存为Geojson文件
export function toGeojson() {
  const geojson = geoJsonLayer.toGeoJSON()
  mars3d.Util.downloadFile("hfty-point-含高度值.json", JSON.stringify(geojson))
}

// 计算贴地高度示例代码，可以将获取到的高度更新到数据库内，后续不用重复计算。
export function getDataSurfaceHeight() {
  if (geoJsonLayer.length === 0) {
    globalMsg("数据尚未加载成功！")
    return
  }
  showLoading()

  // 对图层内的数据做贴地运算,自动得到贴地高度
  geoJsonLayer
    .autoSurfaceHeight({
      endItem: function (result) {
        const resultData = {
          percent: result.index + 1,
          percentAll: result.count
        }
        eventTarget.fire("computedResult", { resultData })
      }
    })
    .then(() => {
      hideLoading()
    })
}
