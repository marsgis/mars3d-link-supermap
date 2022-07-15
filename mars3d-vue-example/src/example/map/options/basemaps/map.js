import * as mars3d from "mars3d"

function initMap() {
  // 在创建地球前的传参中配置basemaps参数
  const map = new mars3d.Map("mars3dContainer", {
    scene: {
      center: { lat: 14.029537, lng: 105.94238, alt: 4879779, heading: 0, pitch: -66 }
    },
    control: {
      baseLayerPicker: true, // basemaps底图切换按钮
      homeButton: true, // 视角复位按钮
      sceneModePicker: true, // 二三维切换按钮
      navigationHelpButton: true, // 帮助按钮
      fullscreenButton: true, // 全屏按钮
      contextmenu: { hasDefault: true } // 右键菜单
    },
    basemaps: [
      {
        name: "天地图影像",
        icon: "img/basemaps/tdt_img.png",
        type: "tdt",
        layer: "img_d", 
        show: true
      },
      {
        name: "离线地图",
        icon: "img/basemaps/mapboxSatellite.png",
        type: "xyz",
        url: "//data.mars3d.cn/tile/googleImg/{z}/{x}/{y}.jpg",
        maximumLevel: 12
      },
      {
        name: "单张图片",
        icon: "img/basemaps/offline.png",
        type: "image",
        url: "//data.mars3d.cn/file/img/world/world.jpg"
      }
    ]
  })

  // 根据config配置的id或name属性，更新显示指定的地图底图
  // map.basemap = '离线地图'
}

// basemaps说支持的图层类型（tileLayer）
// "type": "image"
// "type": "xyz"
// "type": "wms"
// "type": "wmts"
// "type": "tms"
// "type": "arcgis"
// "type": "arcgis_cache"
// "type": "gee"

// "type": "tileinfo" 瓦片信息（一般用于测试）
// "type": "grid"   网格线（一般用于无地图模式）

// "type": "tdt"
// "type": "gaode"
// "type": "baidu"
// "type": "tencent"
// "type": "osm"
// "type": "google"
// "type": "bing"
// "type": "mapbox"
// "type": "ion"
