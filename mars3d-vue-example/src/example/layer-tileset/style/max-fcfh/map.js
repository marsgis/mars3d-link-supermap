import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.83251, lng: 117.221054, alt: 183, heading: 355, pitch: -48 }
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

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/max-fcfh/tileset.json",
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  // 单击事件
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了3dtiles图层", event)

    // tiles3dLayer.tileset._selectedTiles[0].transform = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(100, 0, 0))
    // Cesium.Matrix4.multiply(temp1.transform, Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(100, 0, 0)), temp1.transform)

    const attr = event.graphic.attr
    if (attr) {
      tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [
            ["${name} ==='" + attr.name + "'", "rgb(255, 255, 255)"],
            ["true", "rgba(255, 255, 255,0.03)"]
          ]
        }
      })
    }
  })

  map.on(mars3d.EventType.clickMap, function (event) {
    tiles3dLayer.style = undefined
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
