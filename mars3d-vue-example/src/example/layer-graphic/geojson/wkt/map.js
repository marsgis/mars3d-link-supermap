import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: -10.999882, lng: -0.258788, alt: 8711459, heading: 10, pitch: -85 }
  }
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

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/airport.json" })
    .then(function (json) {
      addOrbitList(json)
    })
    .catch(function (e) {
      console.log("加载出错", e)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
/**
 * 数据列表
 *
 * @param {Array} arr 拿到的json数据
 * @returns {void} 无
 */
function addOrbitList(arr) {
  const features = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    const geojson = getPoint(item)
    if (geojson) {
      features.push(geojson)
    }
  }

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    data: features,
    crs: "EPSG:3857", // 标识数据的坐标系
    symbol: {
      styleOptions: {
        randomColor: true,
        outline: true,
        outlineColor: "#ffffff"
      }
    },
    popup: "all",
    flyTo: true
  })

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
    const data = event.list
    treeEvent.fire("tree", { data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })

  map.addLayer(graphicLayer)
}

/**
 * WKT格式转换geojson
 *
 * @param {object} item 所有的数据
 * @return {object} new mars3d.layer.GeoJsonLayer对象中data属性需要的参数
 */
function getPoint(item) {
  if (!item.geometry) {
    return null
  }

  const geojson = Terraformer.WKT.parse(item.geometry) // WKT格式转换geojson

  return {
    type: "Feature",
    geometry: geojson,
    properties: item
  }
}
