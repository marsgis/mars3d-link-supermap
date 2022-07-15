import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 26.339073, lng: 118.495643, alt: 937783, heading: 355, pitch: -58 }
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
  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "安徽各市",
    url: "//data.mars3d.cn/file/geojson/areas/340000_full.json",
    symbol: {
      type: "polygon",
      styleOptions: {
        materialType: mars3d.MaterialType.PolyGradient, // 重要参数，指定材质
        materialOptions: {
          color: "#3388cc",
          opacity: 0.7,
          alphaPower: 1.3
        },
        // 面中心点，显示文字的配置
        label: {
          text: "{name}", // 对应的属性名称
          opacity: 1,
          font_size: 25,
          color: "#fff",
          font_family: "楷体",
          outline: false,
          scaleByDistance: true,
          scaleByDistance_far: 20000000,
          scaleByDistance_farValue: 0.1,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1
        }
      },
      callback: function (attr, styleOpt) {
        const randomHeight = (attr.childrenNum || 1) * 500 // 测试的高度
        return {
          materialOptions: {
            color: getColor()
          },
          height: 0,
          diffHeight: randomHeight
        }
      }
    },
    popup: "{name}"
  })
  map.addLayer(geoJsonLayer)

  // 绑定事件
  geoJsonLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
  geoJsonLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

const arrColor = ["rgb(15,176,255)", "rgb(18,76,154)", "#40C4E4", "#42B2BE", "rgb(51,176,204)", "#8CB7E5", "rgb(0,244,188)", "#139FF0"]

let index = 0
function getColor() {
  return arrColor[++index % arrColor.length]
}
