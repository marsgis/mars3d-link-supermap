import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 24.890314, lng: 118.165162, alt: 831420, heading: 355, pitch: -48 },
    fxaa: false
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

const diffHeight = 20000

// 添加安徽省底图和墙
function addAnhui(graphicLayer) {
  // 安徽省卫星底图
  const anhuiImg = new mars3d.graphic.RectanglePrimitive({
    positions: [
      [114.877478595, 29.395624614],
      [119.644266263, 34.655111865]
    ],
    style: {
      height: diffHeight,
      materialType: mars3d.MaterialType.Image2,
      materialOptions: {
        image: "//data.mars3d.cn/file/img/anhui.png"
      }
    }
  })
  graphicLayer.addGraphic(anhuiImg)

  // 安徽省边界线墙
  const anhuiWall = new mars3d.layer.GeoJsonLayer({
    name: "安徽省边界墙",
    url: "//data.mars3d.cn/file/geojson/areas/340000.json",
    symbol: {
      type: "wallP",
      styleOptions: {
        diffHeight: diffHeight, // 墙高
        materialType: mars3d.MaterialType.Image2,
        materialOptions: {
          image: "./img/icon/wall.png"
        }
      }
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
        setHeight: diffHeight,
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
        合肥市: { color: "rgba(17, 230, 14)" }
      }
    },
    popup: "{name}"
  })
  map.addLayer(shiLayer)
}

// 添加示范城市的相关对象
function addCenterCity(graphicLayer) {
  const point = [117.234218, 31.814155, diffHeight + 500]

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

  // 自转的半椭圆
  let rotation = Cesium.Math.toRadians(50)
  function getRotationValue() {
    rotation += 0.005
    return rotation
  }
  const primitive1 = new mars3d.graphic.RectangleEntity({
    positions: [
      [114.642444, 34.789658],
      [119.814361, 29.425181]
    ],
    style: {
      materialType: mars3d.MaterialType.Image2,
      materialOptions: {
        image: "./img/icon/calib-semicircle.png",
        opacity: 0.2
      },
      clampToGround: true,
      rotation: new Cesium.CallbackProperty(getRotationValue, false),
      stRotation: new Cesium.CallbackProperty(getRotationValue, false)
    }
  })
  graphicLayer.addGraphic(primitive1)
}
