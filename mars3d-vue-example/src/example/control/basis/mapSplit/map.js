import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 34.213866, lng: 108.956499, alt: 832, heading: 22, pitch: -35 }
  },
  control: {
    baseLayerPicker: false // 是否显示图层选择控件
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
  map.basemap = null

  const mapSplit = new mars3d.control.MapSplit({
    rightLayer: [
      { name: "天地图卫星", type: "tdt", layer: "img_d" },
      {
        name: "大雁塔",
        type: "3dtiles",
        url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
        position: { alt: -27 }
      }
    ],
    leftLayer: [
      { name: "天地图电子", type: "tdt", layer: "vec_d" },
      { name: "天地图注记", type: "tdt", layer: "vec_z" },
      {
        name: "大雁塔",
        type: "3dtiles",
        url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
        position: { alt: -27 },
        style: {
          color: {
            conditions: [["true", "rgba(255,255,0,0.8)"]]
          }
        }
      }
    ]
  })
  map.addControl(mapSplit)

  // 加载模型图层 [也支持setLayerSplitDirection方法来设置图层]
  // const tiles3dLayer = new mars3d.layer.TilesetLayer({
  //   url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
  //   position: { alt: -27 }
  // })
  // map.addLayer(tiles3dLayer)
  // mapSplit.setLayerSplitDirection(tiles3dLayer, Cesium.SplitDirection.RIGHT) // 对模型分屏卷帘
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
