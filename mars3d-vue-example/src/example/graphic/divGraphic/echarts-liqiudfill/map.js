import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lng: 117.084439, lat: 31.653047, alt: 354, heading: 319, pitch: -23 }
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

  // 加载石化工厂模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "石化工厂",
    url: "http://data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: 24.6 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  // 创建div数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 添加矢量数据
  addRandomGraphicByCount([117.077462, 31.657745, 60], { value: 0.53, color: "#fb980b" })
  addRandomGraphicByCount([117.079091, 31.65898, 90], { value: 0.45, color: "#00ff00" })
  addRandomGraphicByCount([117.079766, 31.658268, 70], { value: 0.35, color: "#00ffff" })
  addRandomGraphicByCount([117.07913, 31.655748, 80], { value: 0.21, color: "#ff0000" })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addRandomGraphicByCount(position, attr) {
  const graphic = new mars3d.graphic.DivGraphic({
    position: position,
    style: {
      html: `<div style="width: 80px;height:80px;"></div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: attr
  })
  graphic.on(mars3d.EventType.add, function (e) {
    const dom = e.target.container.firstChild
    const attr = e.target.attr

    const liquidfillchartChart = echarts.init(dom)

    // 参考API：https://github.com/ecomfe/echarts-liquidfill
    // 参考示例：https://www.makeapie.com/explore.html#tags=liquidFill~sort=rank~timeframe=all~author=all
    const option = {
      series: [
        {
          type: "liquidFill",
          radius: "100%",
          outline: { show: false },
          color: [attr.color],
          data: [attr.value],
          label: {
            color: "#294D99",
            insideColor: "#fff",
            fontSize: 20
          }
        }
      ]
    }
    liquidfillchartChart.setOption(option)
  })
  graphicLayer.addGraphic(graphic)
}
