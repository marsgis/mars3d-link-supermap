import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.053342, lng: 117.677104, alt: 187118, heading: 350, pitch: -50 },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: " #120f44", // 天空背景色
    globe: {
      baseColor: "#120f44", // 地球地面背景色
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
  map = mapInstance // 记录map

  // 合肥市边界墙
  const borderWall = new mars3d.layer.GeoJsonLayer({
    name: "合肥市边界墙",
    url: "//data.mars3d.cn/file/geojson/areas/340100.json",
    symbol: {
      type: "wallP",
      styleOptions: {
        setHeight: -25000,
        diffHeight: 25000, // 墙高
        materialType: mars3d.MaterialType.Image2,
        materialOptions: {
          image: "./img/textures/fence-top.png",
          color: "#4881A7"
        }
      }
    }
  })
  map.addLayer(borderWall)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addGraphics()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

/**
 * 添加矢量数据
 *polygon面 PolylineEntity线  光锥体  和 LED数字显示
 * @returns {void} 无
 */
function addGraphics() {
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/areas/340100_full.json" })
    .then(function (geojson) {
      const arr = mars3d.Util.geoJsonToGraphics(geojson) // 解析geojson

      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]

        // polygon面
        const polygonEntity = new mars3d.graphic.PolygonEntity({
          positions: item.positions,
          style: {
            fill: true,
            color: "#4881a7",
            opacity: 0.5,
            label: {
              text: item.attr.name,
              font_size: 20,
              color: "#ffffff",
              font_family: "楷体",
              outline: true,
              outlineColor: "black",
              setHeight: 2000,
              visibleDepth: false,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000),
              scaleByDistance: new Cesium.NearFarScalar(200000, 1.0, 500000, 0.5)
            }
          }
        })
        graphicLayer.addGraphic(polygonEntity)

        // PolylineEntity线
        const graphicLine = new mars3d.graphic.PolylineEntity({
          positions: item.positions,
          style: {
            color: "rgba(255,255,255,0.5)",
            width: 1
          }
        })
        graphicLayer.addGraphic(graphicLine)

        // 中心点
        const center = item.attr.centroid

        // 光锥体
        const coneGlow = new mars3d.graphic.LightCone({
          position: center,
          style: {
            radius: 1500,
            height: 15000
          }
        })
        graphicLayer.addGraphic(coneGlow)

        // LED数字显示
        const number = Math.floor(Math.random() * (4000 - 3000 + 1) + 3000) // 随机数字 3000-4000
        const graphic = new mars3d.graphic.DivGraphic({
          position: [center[0], center[1], 12000],
          style: {
            html: `<div class ="coneNum">${number}`,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000),
            scaleByDistance: new Cesium.NearFarScalar(200000, 1.0, 500000, 0.5)
          }
        })
        graphicLayer.addGraphic(graphic)
      }
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}
