import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

/**
 * 合并属性参数，可覆盖config.json中的对应配置
 * @type {object}
 */
export const mapOptions = {
  // 方式1：在创建地球前的传参中配置 terrain 参数[目前1个球只支持1个地形服务]
  terrain: {
    url: "http://data.mars3d.cn/terrain",
    show: true
  },
  control: {
    baseLayerPicker: true,
    terrainProviderViewModels: getTerrainProviderViewModelsArr() // 自baseLayerPicker面板的地形可选数组
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

  map.on(mars3d.EventType.terrainLoadSuccess, function (event) {
    console.log("地形服务加载完成", event)
  })
  map.on(mars3d.EventType.terrainLoadError, function (event) {
    console.log("地形服务加载失败", event)
  })

  // 方式2：在创建地球后更新terrainProvider(用 mars3d.layer.createTerrainProvider工厂方法创建)[目前1个球只支持1个地形服务]
  map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
    url: "http://data.mars3d.cn/terrain"
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function radioTerrain(type) {
  switch (type) {
    case "none": // 无地形
      map.terrainProvider = mars3d.LayerUtil.getNoTerrainProvider()
      break
    case "xyz": // 标准xyz服务
      map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
        url: "http://data.mars3d.cn/terrain"
      })
      break
    case "arcgis": // ArcGIS地形服务
      map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
        type: "arcgis",
        url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
      })
      break
    case "ion": // cesium官方ion在线服务
      globalMsg("ION服务在国外，加载略慢，请耐心等候。")
      map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
        type: "ion",
        requestWaterMask: true,
        requestVertexNormals: true
      })
      break
    case "gee": // 谷歌地球企业服务
      map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
        type: "gee",
        url: "http://www.earthenterprise.org/3d",
        proxy: "//server.mars3d.cn/proxy/"
      })
      break
    case "vr": // vr地形服务
      map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
        type: "vr",
        url: "https://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/"
      })
      break
    default:
  }
}

// 可以开启和关闭地形
export function enabledTerrain(val) {
  map.hasTerrain = val
}

// 是否开启三角网
export function enabledTerrainSJW(val) {
  map.scene.globe._surface.tileProvider._debug.wireframe = val
}

function getTerrainProviderViewModelsArr() {
  return [
    new Cesium.ProviderViewModel({
      name: "无地形",
      tooltip: "WGS84标准球体",
      iconUrl: "img/basemaps/TerrainEllipsoid.png",
      creationFunction: function () {
        return mars3d.LayerUtil.getNoTerrainProvider()
      }
    }),
    new Cesium.ProviderViewModel({
      name: "中国地形",
      tooltip: "由 火星科技 提供的中国国内地形",
      iconUrl: "img/basemaps/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          url: "http://data.mars3d.cn/terrain"
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "ArcGIS地形",
      tooltip: "由 火星科技 提供的中国国内地形",
      iconUrl: "img/basemaps/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          type: "arcgis",
          url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "全球地形",
      tooltip: "由 Cesium官方 提供的高分辨率全球地形",
      iconUrl: "img/basemaps/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          type: "ion",
          requestWaterMask: true,
          requestVertexNormals: true
        })
      }
    })
  ]
}
