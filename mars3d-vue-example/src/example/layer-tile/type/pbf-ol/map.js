import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 20.758452, lng: 108.198353, alt: 7733736, heading: 358, pitch: -82 },
    globe: {
      baseColor: "#ffffff"
    },
    highDynamicRange: false
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "OSM开源地图",
      icon: "img/basemaps/osm.png",
      type: "mvt", // lib\mars3d\thirdParty\pbf-ol\PbfolLayer.js 中定义的类型
      url: "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={k}",
      key: mars3d.Token.mapbox,
      style: "mapbox-streets-v6",
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  globalNotify("已知问题提示", `(1) 不支持所有PBF的style类型。(2) 如果部分PBF数据未显示，需要扩展开发对应解析style代码。`)

  // 在lib\mars3d\thirdParty\pbf-ol\PbfolLayer.js 中定义的
  // const pbfLayer = new mars3d.layer.PbfolLayer({
  //   url: "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={k}",
  //   key: mars3d.Token.mapbox,
  //   style: "mapbox-streets-v6"
  // })
  // map.addLayer(pbfLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
