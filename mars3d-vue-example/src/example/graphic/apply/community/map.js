import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.818816, lng: 117.221131, alt: 2553, heading: 0, pitch: -55 }
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

  map.basemap = 2017 // 切换到蓝色底图

  addTilesetLayer()
  addGraphics()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 合肥市建筑物模型
function addTilesetLayer() {
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    marsJzwStyle: true, // 打开建筑物特效（内置Shader代码）
    style: {
      color: {
        conditions: [["true", "rgba(16, 119, 209, 1)"]]
      }
    },
    // 裁剪区域
    planClip: {
      positions: [
        [117.22648, 31.827441],
        [117.210341, 31.830612],
        [117.211311, 31.842438],
        [117.226091, 31.842885]
      ],
      clipOutSide: true // 外裁剪
    }
  })
  map.addLayer(tiles3dLayer)
}

function addGraphics() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/hefei-shequ.json" })
    .then(function (geojson) {
      const arr = mars3d.Util.geoJsonToGraphics(geojson) // 解析geojson

      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]

        // polygon面
        const polygonEntity = new mars3d.graphic.PolygonEntity({
          positions: item.positions,
          style: {
            color: item.attr.color,
            opacity: 0.4
          },
          attr: { remark: "polygon面" }
        })
        graphicLayer.addGraphic(polygonEntity)

        // PolylineEntity线
        const graphicLine = new mars3d.graphic.PolylineEntity({
          positions: item.positions,
          style: {
            width: 4,
            closure: true,
            materialType: mars3d.MaterialType.LineTrail,
            materialOptions: {
              color: item.attr.color,
              speed: 4
            }
          },
          attr: { remark: "PolylineEntity线" }
        })
        graphicLayer.addGraphic(graphicLine)

        // 动态边框文本 DIV
        const graphic = new mars3d.graphic.DivBoderLabel({
          position: polygonEntity.center,
          style: {
            text: item.attr.name,
            font_size: 15,
            font_family: "微软雅黑",
            color: "#ccc",
            boderColor: "#15d1f2",
            addHeight: 100
          },
          attr: { remark: "DIV矢量数据" }
        })
        graphicLayer.addGraphic(graphic)
      }
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}
