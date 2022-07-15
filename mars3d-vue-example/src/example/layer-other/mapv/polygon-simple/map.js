import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.771164, lng: 117.242438, alt: 9736, heading: 0, pitch: -56 }
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

  map.imageryLayers._layers.forEach(function (layer) {
    layer.brightness = 0.3
  })

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/buildings-hf.json" })
    .then(function (data) {
      createMapvLayer(data.features)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 创建mapv图层
function createMapvLayer(geojson) {
  const options = {
    fillStyle: "rgba(255, 80, 53, 0.8)",
    strokeStyle: "rgba(250, 255, 53, 0.8)",
    size: 3,
    lineWidth: 1,
    draw: "simple",
    depthTest: false, // 是否进行计算深度（大数据时，需要关闭）
    data: geojson // 数据
  }

  // 创建MapV图层
  const mapVLayer = new mars3d.layer.MapVLayer(options)
  map.addLayer(mapVLayer)

}
