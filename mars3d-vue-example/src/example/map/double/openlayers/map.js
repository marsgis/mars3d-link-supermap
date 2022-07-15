import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.841977, lng: 117.141788, alt: 1043, heading: 90, pitch: -51 },
    fxaa: true,
    baseLayerPicker: false,
    sceneModePicker: false
  },
  layers: [
    {
      type: "geojson",
      name: "示例数据",
      url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
      popup: "{type} {name}",
      show: true
    },
    {
      type: "3dtiles",
      name: "测试模型",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 116.313536, lat: 31.217297, alt: 80 },
      scale: 100,
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

  // 修改3d地图的样式
  const dom3d = document.getElementById("centerDiv3D")
  dom3d.style.left = "50%"
  dom3d.style.width = "50%"

  // 创建2d地图
  const mapDiv = mars3d.DomUtil.create("div", "", document.body)
  mapDiv.setAttribute("id", "centerDiv2D")
  mapDiv.style.width = "50%"

  const map2ds = mars3d.DomUtil.create("div", "", mapDiv)
  map2ds.setAttribute("id", "map2d")
  map2ds.setAttribute("class", "mars2d-container")

  const tileWorldImagery = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      crossOrigin: "Anonymous"
    })
  })

  const map2d = new ol.Map({
    target: "map2d",
    projection: "EPSG:3857",
    layers: [tileWorldImagery],

    view: new ol.View({
      center: ol.proj.fromLonLat([134.364805, 26.710497]),
      zoom: 4,
      minZoom: 2
    })
  })

  // 联动控制器
  const ol3d = new olcs.OLCesium({ map: map2d, viewer: map.viewer })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
