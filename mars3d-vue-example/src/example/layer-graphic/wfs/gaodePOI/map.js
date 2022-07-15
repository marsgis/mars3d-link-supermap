import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.783013, lng: 117.221851, alt: 2307, heading: 1, pitch: -29 }
  },
  terrain: false
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  GeodePoiLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let geodePoiLayer

function GeodePoiLayer() {
  // 高德POI图层，演示大数据的分块加载
  geodePoiLayer = new mars3d.layer.GeodePoiLayer({
    minimumLevel: 13,
    debuggerTileInfo: false, // 是否显示网格信息（测试用）
    key: mars3d.Token.gaodeArr, // 请在实际项目中将下面高德KEY换为自己申请的，因为该key不保证长期有效。
    filter: {
      types: "120000|130000|190000"
    },
    height: 5,
    symbol: {
      styleOptions: {
        image: "img/marker/mark-blue.png",
        scaleByDistance: true,
        scaleByDistance_far: 20000,
        scaleByDistance_farValue: 0.6,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        label: {
          text: "{name}",
          font_size: 15,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -30,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 4000,
          distanceDisplayCondition_near: 0
        }
      }
    }
    // 当是entity类型时，点的聚合配置
    // clustering: {
    //   enabled: true,
    //   pixelRange: 20,
    // },
  })
  map.addLayer(geodePoiLayer)
}

// 图层状态 在组件中进行管理的图层
export function getManagerLayer() {
  return geodePoiLayer
}
