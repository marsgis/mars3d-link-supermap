import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.675177, lng: 117.323257, alt: 81193, heading: 359, pitch: -79 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "天地图影像(EPSG:3857)",
      icon: "img/basemaps/tdt_img.png",
      type: "tdt",
      layer: "img_d",
      key: mars3d.Token.tiandituArr,
      show: true
    },
    {
      name: "天地图电子(EPSG:3857)",
      icon: "img/basemaps/tdt_vec.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "vec_d", key: mars3d.Token.tiandituArr },
        { name: "注记", type: "tdt", layer: "vec_z", key: mars3d.Token.tiandituArr }
      ]
    },
    {
      name: "天地图地形(EPSG:3857)",
      icon: "img/basemaps/tdt_ter.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "ter_d", key: mars3d.Token.tiandituArr },
        { name: "注记", type: "tdt", layer: "ter_z", key: mars3d.Token.tiandituArr }
      ]
    },
    {
      name: "天地图影像(EPSG:4326)",
      icon: "img/basemaps/tdt_img.png",
      type: "group",
      layers: [
        {
          name: "底图",
          type: "tdt",
          layer: "img_d",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        },
        {
          name: "注记",
          type: "tdt",
          layer: "img_z",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        }
      ]
    },
    {
      name: "天地图电子(EPSG:4326)",
      icon: "img/basemaps/tdt_vec.png",
      type: "group",
      layers: [
        {
          name: "底图",
          type: "tdt",
          layer: "vec_d",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        },
        {
          name: "注记",
          type: "tdt",
          layer: "vec_z",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        }
      ]
    },
    {
      name: "天地图地形(EPSG:4326)",
      icon: "img/basemaps/tdt_ter.png",
      type: "group",
      layers: [
        {
          name: "底图",
          type: "tdt",
          layer: "ter_d",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        },
        {
          name: "注记",
          type: "tdt",
          layer: "ter_z",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        }
      ]
    },

    {
      name: "天地图影像(英文)",
      icon: "img/basemaps/tdt_img.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "img_d", key: mars3d.Token.tiandituArr },
        { name: "底图", type: "tdt", layer: "img_e", key: mars3d.Token.tiandituArr }
      ]
    },
    {
      name: "天地图电子(英文)",
      icon: "img/basemaps/tdt_vec.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "vec_d", key: mars3d.Token.tiandituArr },
        { name: "底图", type: "tdt", layer: "vec_e", key: mars3d.Token.tiandituArr }
      ]
    }
  ]
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
  tileLayer = new mars3d.layer.TdtLayer({
    name: "天地图影像注记",
    layer: "img_z",
    key: mars3d.Token.tiandituArr
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
