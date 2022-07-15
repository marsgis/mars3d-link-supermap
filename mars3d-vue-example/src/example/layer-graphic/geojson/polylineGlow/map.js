import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.464497, lng: 106.529141, alt: 14871, heading: 1, pitch: -55 },
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    globe: {
      baseColor: "rgba(0,0,0,0)",
      showGroundAtmosphere: false,
      enableLighting: false
    }
  },
  terrain: {
    show: false
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
  map.basemap = 2017 // 蓝色底图

  addDemoGraphics()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphics() {
  // geojson图层
  const geoJsonLayer1 = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/wuhan-line1.json",
    symbol: {
      type: "polylineC",
      styleOptions: {
        width: 50, // 线宽
        materialType: "PolylineGlow",
        materialOptions: {
          color: "#FF4500",
          opacity: 0.9,
          glowPower: 0.06 // 发光强度
        }
      }
    },
    // popup: "all",
    show: true
  })
  map.addLayer(geoJsonLayer1)

  const geoJsonLayer2 = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/wuhan-line2.json",
    symbol: {
      type: "polylineC",
      styleOptions: {
        width: 10, // 线宽
        materialType: "PolylineGlow",
        materialOptions: {
          color: "#FF4500",
          opacity: 0.9,
          glowPower: 0.1 // 发光强度
        }
      }
    },
    // popup: "all",
    show: true
  })
  map.addLayer(geoJsonLayer2)

  const geoJsonLayer3 = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/wuhan-line3.json",
    symbol: {
      type: "polylineC",
      styleOptions: {
        width: 10, // 线宽
        materialType: "PolylineGlow",
        materialOptions: {
          color: "#FF4500",
          opacity: 0.9,
          glowPower: 0.1 // 发光强度
        }
      }
    },
    // popup: "all",
    show: true
  })
  map.addLayer(geoJsonLayer3)
}
