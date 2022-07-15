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
  const fragmentShader = `
    // 注意shader中写浮点数是，一定要带小数点，否则会报错，比如0需要写成0.0，1要写成1.0
    float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
    float _heightRange = 25.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange)
    float _glowRange = 300.0; // 光环的移动范围(高度)

    // 建筑基础色
    float mars_height = marsJzwHeight - _baseHeight;
    float mars_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
    float mars_a12 = mars_height / _heightRange + sin(mars_a11) * 0.1;
    gl_FragColor *= vec4(vec3(mars_a12), 1.0);// 渐变

    // 动态光环
    float time = fract(czm_frameNumber / 360.0);
    time = abs(time - 0.5) * 2.0;
    float mars_h = clamp(mars_height / _glowRange, 0.0, 1.0);
    float mars_diff = step(0.005, abs(mars_h - time));
    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - mars_diff);
  `

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    marsJzwStyle: fragmentShader,
    style: {
      color: {
        conditions: [["true", "rgba(16, 119, 209, 1)"]]
      }
    }
  })
  map.addLayer(tiles3dLayer)

  // 模型裁剪
  const modelThing = new mars3d.thing.TilesetPlanClip({
    layer: tiles3dLayer,
    positions: [
      [117.22648, 31.827441],
      [117.210341, 31.830612],
      [117.211311, 31.842438],
      [117.226091, 31.842885]
    ],
    clipOutSide: true // 外裁剪
  })

  map.addThing(modelThing)
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
