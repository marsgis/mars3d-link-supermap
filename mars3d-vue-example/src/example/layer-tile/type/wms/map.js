import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 19.171756, lng: 107.215418, alt: 9274074, heading: 0, pitch: -85 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "光污染图层",
      icon: "img/basemaps/blackMarble.png",
      type: "wms",
      url: "//www.lightpollutionmap.info/geoserver/gwc/service/wms",
      layers: "PostGIS:VIIRS_2019",
      crs: "EPSG:3857",
      parameters: {
        transparent: true,
        format: "image/png"
      },
      alpha: 0.6, // 透明度
      proxy: "//server.mars3d.cn/proxy/", // 代理服务，解决跨域问题
      show: true
    },
    {
      // wms也可以换一种xyz的直接写法
      name: "光污染图层(XYZ方式)",
      icon: "img/basemaps/blackMarble.png",
      type: "xyz",
      url: "//www.lightpollutionmap.info/geoserver/gwc/service/wms?transparent=true&format=image%2Fpng&service=WMS&version=1.1.1&request=GetMap&styles=&layers=PostGIS%3AVIIRS_2019&bbox={westProjected},{southProjected},{eastProjected},{northProjected}&width={width}&height={height}&srs=EPSG%3A3857",
      alpha: 0.6, // 透明度
      proxy: "//server.mars3d.cn/proxy/" // 代理服务，解决跨域问题
    },
    {
      name: "单张图片",
      icon: "img/basemaps/offline.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/world.jpg"
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
  map = mapInstance // 记录首次创建的map
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 叠加的图层
let tileLayer

export function addTileLayer() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.WmsLayer({
    url: "//server.mars3d.cn/geoserver/mars/wms",
    layers: "mars:hf",
    parameters: {
      transparent: true,
      format: "image/png"
    },
    getFeatureInfoParameters: {
      feature_count: 10
    },
    // 单击高亮及其样式
    highlight: {
      type: "wallP",
      diffHeight: 100,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/fence.png",
        color: "#ffff00",
        speed: 10, // 速度，建议取值范围1-100
        axisY: true
      }
    },
    popup: "all",
    // popupOptions: {
    //   autoClose: false,
    //   closeOnClick: false,
    //   checkData: function (attr, graphic) {
    //     if (Cesium.defined(attr.OBJECTID)) {
    //       return graphic.attr.OBJECTID === attr.OBJECTID
    //     }
    //     if (Cesium.defined(attr.NAME)) {
    //       return graphic.attr.NAME === attr.NAME
    //     }
    //     return false
    //   }
    // },
    flyTo: true
  })
  map.addLayer(tileLayer)

  // 单击事件
  tileLayer.on(mars3d.EventType.loadConfig, function (event) {
    console.log("加载了GetCapabilities", event)
  })
  tileLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了矢量数据，共" + event.features.length + "条", event)
  })
}

export function addTileLayer2() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.WmsLayer({
    url: "https://localhost/geoserver/wms",
    layers: "sz_building:building_plat",
    parameters: {
      tiled: true,
      VERSION: "1.1.1",
      transparent: true,
      FORMAT: "image/png"
    },
    getFeatureInfoParameters: {
      feature_count: 10,
      INFO_FORMAT: "text/plain"
    },
    // 不支持json格式的wms服务时，可以自定义方法解析数据
    featureToGraphic: (feature, event) => {
      const data = feature.data

      // 自行加解析data的代码，下面是测试演示
      const attr = {}
      attr["名称"] = "皇岗村文化广场及音乐喷水泉"
      attr["街道名称"] = "福田街道"
      attr["社区名称"] = "皇岗社区"

      // 返回graphic对应的构造参数
      return {
        type: "point",
        position: event.cartesian,
        style: {
          color: "#ff0000",
          pixelSize: 10,
          outlineColor: "#ffffff",
          outlineWidth: 2
        },
        attr: attr
      }
    },
    popup: "all",
    flyTo: true,
    show: true
  })
  map.addLayer(tileLayer)

  // 单击事件
  tileLayer.on(mars3d.EventType.loadConfig, function (event) {
    console.log("加载了GetCapabilities", event)
  })
  tileLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了矢量数据，共" + event.features.length + "条", event)
  })
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
