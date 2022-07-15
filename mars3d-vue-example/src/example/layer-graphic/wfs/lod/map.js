import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.563158, lng: 116.329235, alt: 16165, heading: 0, pitch: -45 }
  }
}
/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
  map.on(mars3d.EventType.load, () => {
    LodGraphicLayer()
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function LodGraphicLayer() {
  const lodGraphicLayer = new mars3d.layer.LodGraphicLayer({
    IdField: "id", // 数据的唯一主键 字段名称
    minimumLevel: 11, // 限定层级，只加载该层级下的数据。[与效率相关的重要参数]
    debuggerTileInfo: true,
    // 根据LOD分块信息去请求对应的Tile瓦块内的数据
    queryGridData: (grid) => {
      return mars3d.Util.fetchJson({
        url: "//server.mars3d.cn/server/pointRandom/",
        queryParameters: {
          xmin: grid.extent.xmin,
          ymin: grid.extent.ymin,
          xmax: grid.extent.xmax,
          ymax: grid.extent.ymax,
          count: 5
        }
      }).then(function (data) {
        grid.list = data // list标识回传数据
        return grid
      })
    },
    // 根据 attr属性 创建 矢量对象[必须返回Graphic对象]
    createGraphic(grid, attr) {
      const height = mars3d.PointUtil.getHeight(map.scene, Cesium.Cartesian3.fromDegrees(attr.x, attr.y))

      const graphic = new mars3d.graphic.ModelPrimitive({
        position: [attr.x, attr.y, height],
        style: {
          url: "//data.mars3d.cn/gltf/mars/leida.glb",
          scale: 1,
          minimumPixelSize: 40
        }
      })
      lodGraphicLayer.addGraphic(graphic)

      return graphic
    }
  })
  map.addLayer(lodGraphicLayer)

  lodGraphicLayer.on(mars3d.EventType.click, (event) => {
    console.log("你单击了对象", event)
  })
}
