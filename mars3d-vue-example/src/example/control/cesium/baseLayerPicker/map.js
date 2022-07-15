import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.control = {
    baseLayerPicker: true // 是否显示图层选择控件
  }
  return option
}

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

// 获取自定义底图切换
function getImageryProviderArr() {
  const providerViewModels = []
  let imgModel

  imgModel = new Cesium.ProviderViewModel({
    name: "本地图片",
    tooltip: "本地单张图片",
    iconUrl: "img/basemaps/esriNationalGeographic.png",
    category: "标准坐标系",
    creationFunction: function () {
      return mars3d.LayerUtil.createImageryProvider({
        type: "image",
        url: "//data.mars3d.cn/file/img/world/world.jpg"
      })
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "天地图影像",
    tooltip: "天地图全球影像地图服务（国家测绘局）",
    iconUrl: "img/basemaps/tdt_img.png",
    category: "标准坐标系",
    creationFunction: function () {
      return [
        mars3d.LayerUtil.createImageryProvider({
          type: "tdt",
          layer: "img_d",
          key: mars3d.Token.tiandituArr
        }),
        mars3d.LayerUtil.createImageryProvider({
          type: "tdt",
          layer: "img_z",
          key: mars3d.Token.tiandituArr
        })
      ]
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "Bing影像",
    iconUrl: "img/basemaps/bingAerial.png",
    tooltip: "微软提供的高清影像地图",
    category: "标准坐标系",
    creationFunction: function () {
      return mars3d.LayerUtil.createImageryProvider({
        type: "bing",
        layer: "Aerial"
      })
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "ESRI影像",
    iconUrl: "img/basemaps/esriWorldImagery.png",
    tooltip: "ESRI提供的高清影像地图",
    category: "标准坐标系",
    creationFunction: function () {
      return mars3d.LayerUtil.createImageryProvider({
        type: "arcgis",
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
      })
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "谷歌影像",
    tooltip: "谷歌影像地图服务",
    iconUrl: "img/basemaps/google_img.png",
    category: "国测局偏移坐标系",
    creationFunction: function () {
      return [
        mars3d.LayerUtil.createImageryProvider({ type: "google", layer: "img_d" }),
        mars3d.LayerUtil.createImageryProvider({ type: "google", layer: "img_z" })
      ]
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "高德影像",
    tooltip: "高德影像地图服务",
    iconUrl: "img/basemaps/gaode_img.png",
    category: "国测局偏移坐标系",
    creationFunction: function () {
      return [
        mars3d.LayerUtil.createImageryProvider({ type: "gaode", layer: "img_d" }),
        mars3d.LayerUtil.createImageryProvider({ type: "gaode", layer: "img_z" })
      ]
    }
  })
  providerViewModels.push(imgModel)

  return providerViewModels
}

function getTerrainProviderViewModelsArr() {
  return [
    new Cesium.ProviderViewModel({
      name: "无地形",
      tooltip: "WGS84标准球体",
      iconUrl: "img/basemaps/TerrainEllipsoid.png",
      creationFunction: function () {
        return new Cesium.EllipsoidTerrainProvider({
          ellipsoid: Cesium.Ellipsoid.WGS84
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "全球地形",
      tooltip: "由 Cesium官方 提供的高分辨率全球地形",
      iconUrl: "img/basemaps/TerrainSTK.png",
      creationFunction: function () {
        return Cesium.createWorldTerrain({
          requestWaterMask: true,
          requestVertexNormals: true
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "中国地形",
      tooltip: "由 Mars3D 提供的中国国内地形",
      iconUrl: "img/basemaps/TerrainSTK.png",
      creationFunction: function () {
        return new Cesium.CesiumTerrainProvider({
          url: "http://data.mars3d.cn/terrain",
          requestWaterMask: true,
          requestVertexNormals: true
        })
      }
    })
  ]
}
