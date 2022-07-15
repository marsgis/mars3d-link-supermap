import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let geoJsonLayerDTH

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 43.823957, lng: 125.136704, alt: 286, heading: 11, pitch: -24 }
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

  // 模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    pid: 2030,
    type: "3dtiles",
    name: "校园",
    url: "//data.mars3d.cn/3dtiles/qx-xuexiao/tileset.json",
    position: { alt: 15.8 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    center: { lat: 43.821193, lng: 125.143124, alt: 990, heading: 342, pitch: -50 }
  })
  map.addLayer(tiles3dLayer)

  // 创建单体化图层
  geoJsonLayerDTH = new mars3d.layer.GeoJsonLayer({
    name: "分层分户单体化",
    url: "//data.mars3d.cn/file/geojson/dth-xuexiao-fcfh.json",
    onCreateGraphic: createDthGraphic // 自定义解析数据
  })
  map.addLayer(geoJsonLayerDTH)

  geoJsonLayerDTH.bindPopup((e) => {
    const item = e.graphic.attr
    const html = `房号：${item.name}<br/>
                楼层：第${item.thisFloor}层 (共${item.allFloor}层)<br/>
                班级：${item.remark}<br/>
                说明：教学楼`
    return html
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 是否显示个户颜色
export function chkShowColor(val) {
  geoJsonLayerDTH.closePopup()
  if (val) {
    geoJsonLayerDTH.eachGraphic((graphic, index) => {
      graphic.setStyle({
        opacity: 0.2
      })
    })
  } else {
    geoJsonLayerDTH.eachGraphic((graphic) => {
      graphic.setStyle({
        opacity: 0.01
      })
    })
  }
}

// 添加单体化矢量对象
function createDthGraphic(options) {
  const points = options.positions // 各顶点的坐标
  const attr = options.attr // 楼层层高配置信息

  const minHight = attr.bottomHeight // 当前层的 底部海拔高度
  const maxHight = attr.topHeight // 当前层的 顶部海拔高度

  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: points,
    style: {
      height: minHight,
      extrudedHeight: maxHight,
      // 单体化默认显示样式
      color: getColor(),
      opacity: 0.3,
      classification: true,
      // 单体化鼠标移入或单击后高亮的样式
      highlight: {
        type: mars3d.EventType.click,
        color: "#ffff00",
        opacity: 0.6
      }
    },
    attr: attr
  })
  geoJsonLayerDTH.addGraphic(graphic)
}

// 颜色
let index = 0
const colors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#0000FF"]
function getColor() {
  const i = index++ % colors.length
  return colors[i]
}
