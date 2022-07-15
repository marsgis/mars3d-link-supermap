import * as mars3d from "mars3d"

export let map

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
const color = "#363635"
export const mapOptions = {
  scene: {
    center: { lat: 25.845231, lng: 117.57678, alt: 488175, heading: 358, pitch: -42 },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: color, // 天空背景色
    globe: {
      baseColor: color, // 地球地面背景色
      showGroundAtmosphere: false,
      enableLighting: false
    }
  },
  control: {
    baseLayerPicker: false
  },
  terrain: { show: false },
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

  // 添加矢量图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 添加对象
  addAnhui(graphicLayer)
  addCenterCity(graphicLayer)
  addOutCircle(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 添加安徽省底图和墙
function addAnhui() {
  // 安徽省卫星底图
  const tileLayer = new mars3d.layer.XyzLayer({
    url: "//data.mars3d.cn/tile/anhui/{z}/{x}/{y}.png",
    minimumLevel: 0,
    maximumLevel: 12,
    rectangle: { xmin: 114.883371, xmax: 119.649144, ymin: 29.395253, ymax: 34.650809 }
  })
  map.addLayer(tileLayer)

  // 安徽省边界线墙
  const anhuiWall = new mars3d.layer.GeoJsonLayer({
    name: "安徽省边界墙",
    url: "//data.mars3d.cn/file/geojson/areas/340000.json",
    // 自定义解析数据
    onCreateGraphic: function (options) {
      const points = options.positions[0] // 坐标
      const attr = options.attr // 属性信息

      console.log("边界墙原始坐标", points)

      mars3d.PolyUtil.computeSurfaceLine({
        map: map,
        positions: points,
        has3dtiles: false,
        splitNum: 300
      }).then((result) => {
        console.log("边界墙插值计算完成坐标", result.positions)

        const graphic = new mars3d.graphic.WallPrimitive({
          positions: result.positions,
          style: {
            addHeight: -15000,
            diffHeight: 15000, // 墙高
            materialType: mars3d.MaterialType.Image2,
            materialOptions: {
              image: "./img/textures/fence-top.png",
              color: "rgba(0,255,255,0.6)"
            }
            // renderState: Cesium.RenderState.fromCache({
            //   blending: Cesium.BlendingState.ALPHA_BLEND,
            //   depthTest: {
            //     enabled: true,
            //     func: Cesium.DepthFunction.LESS
            //   },
            //   cull: {
            //     enabled: true,
            //     face: Cesium.CullFace.BACK
            //   },
            //   depthMask: true
            // })
          },
          attr: attr
        })
        anhuiWall.addGraphic(graphic)
      })
    }
  })
  map.addLayer(anhuiWall)

  // 安徽各市边界线和名称
  const shiLayer = new mars3d.layer.GeoJsonLayer({
    name: "安徽各市边界线",
    url: "//data.mars3d.cn/file/geojson/areas/340000_full.json",
    symbol: {
      type: "polyline",
      styleOptions: {
        color: "rgba(255,255,255,0.3)",
        width: 2,
        label: {
          text: "{name}",
          position: "center",
          font_size: 18,
          color: "black",
          font_family: "楷体",
          outline: true,
          outlineColor: "#f1f3f4",
          outlineWidth: 3,
          // 视距的设置
          scaleByDistance: true,
          scaleByDistance_far: 20000000,
          scaleByDistance_farValue: 0.1,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1
        }
      },
      styleField: "name",
      styleFieldOptions: {
        合肥市: { color: "rgba(0,255,255,0.3)" }
      }
    },
    popup: "{name}"
  })
  map.addLayer(shiLayer)
}

// 添加示范城市的相关对象
function addCenterCity(graphicLayer) {
  const point = [117.234218, 31.814155, 0]

  // divgraphic标注
  const divgraphic = new mars3d.graphic.DivGraphic({
    position: point,
    style: {
      html: `<div class="marsBlackPanel">
                <div class="marsBlackPanel-text">示范城市</div>
            </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 横向定位
      verticalOrigin: Cesium.VerticalOrigin.CENTER // 垂直定位
    }
  })
  graphicLayer.addGraphic(divgraphic)

  // 圆形动态扩散图
  const cicle = new mars3d.graphic.CirclePrimitive({
    position: point,
    style: {
      radius: 16000,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "rgba(0,255,255,0.6)",
        count: 2,
        speed: 10
      }
    }
  })
  graphicLayer.addGraphic(cicle)
}

// 添加周边的圆圈刻度尺等对象
function addOutCircle(graphicLayer) {
  const arrImg = [
    {
      // 刻度
      image: "./img/icon/calib.png",
      positions: [
        [113.564329, 35.654741],
        [120.802219, 28.844016]
      ]
    },
    {
      // 刻度尺
      image: "./img/icon/calib-value.png",
      positions: [
        [114.162597, 29.256489],
        [120.216593, 35.055444]
      ]
    },
    {
      // 方向
      image: "./img/icon/calib-dir.png",
      positions: [
        [114.162597, 29.256489],
        [120.216593, 35.055444]
      ]
    }
  ]

  for (let i = 0; i < arrImg.length; i++) {
    const item = arrImg[i]
    const graphic = new mars3d.graphic.RectanglePrimitive({
      positions: item.positions,
      style: {
        materialType: mars3d.MaterialType.Image2,
        materialOptions: {
          image: item.image,
          opacity: 0.4
        }
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}
