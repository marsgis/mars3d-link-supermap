import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 25.845231, lng: 117.57678, alt: 488175, heading: 358, pitch: -42 },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: "#363635", // 天空背景色
    globe: {
      baseColor: " #363635", // 地球地面背景色
      showGroundAtmosphere: false,
      enableLighting: false
    }
  },
  control: {
    baseLayerPicker: false
  },
  basemaps: [],
  layers: []
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 添加 安徽省边界线墙
  const anhuiWall = new mars3d.layer.GeoJsonLayer({
    name: "安徽省边界墙",
    url: "//data.mars3d.cn/file/geojson/areas/340000.json",
    symbol: {
      type: "wallP",
      styleOptions: {
        setHeight: -15000,
        diffHeight: 15000, // 墙高
        materialType: mars3d.MaterialType.Image2,
        materialOptions: {
          image: "./img/textures/fence-top.png",
          color: "rgba(0,255,255,0.6)"
        }
      }
    }
  })
  map.addLayer(anhuiWall)

  // 安徽省卫星底图
  const tileLayer = new mars3d.layer.XyzLayer({
    url: "//data.mars3d.cn/tile/anhui/{z}/{x}/{y}.png",
    minimumLevel: 0,
    maximumLevel: 12,
    rectangle: { xmin: 114.811691, xmax: 119.703609, ymin: 29.35597, ymax: 34.698585 }
  })
  map.addLayer(tileLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
