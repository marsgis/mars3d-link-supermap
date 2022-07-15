import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

const arrData = [
  { name: "油罐一", position: [117.09521, 31.814404, 47.3] },
  { name: "油罐二", position: [117.095206, 31.814878, 47.3] },
  { name: "油罐三", position: [117.094653, 31.814428, 47.3] },
  { name: "发电机", position: [117.093428, 31.816959, 31.8] },
  { name: "指挥室", position: [117.093953, 31.814397, 36] },
  { name: "加热罐", position: [117.09385, 31.815837, 36.9] },
  { name: "冷却室", position: [117.094662, 31.816403, 32.9] }
]

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.81226, lng: 117.096703, alt: 231, heading: 329, pitch: -28 }
  }
}

/**
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 加载油田联合站模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    pid: 2020,
    type: "3dtiles",
    name: "油田联合站",
    url: "//data.mars3d.cn/3dtiles/max-ytlhz/tileset.json",
    position: { lng: 117.094224, lat: 31.815859, alt: 26.4 },
    rotation: { z: 116.2 },
    maximumScreenSpaceError: 1,
    center: { lat: 32.407076, lng: 117.459703, alt: 3361, heading: 358, pitch: -51 }
  })
  map.addLayer(tiles3dLayer)

  // 创建DIV数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效

  // 初始加载
  divGraphicYellow()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

// 效果一
export function divGraphicYellow() {
  graphicLayer.clear()

  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const divGraphic = new mars3d.graphic.DivGraphic({
      position: item.position,
      style: {
        html: `<div class="marsBlackPanel  animation-spaceInDown">
                <div class="marsBlackPanel-text" style="">
                  ${item.name} <span class="temperature"></span> ℃
                </div>
              </div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      },
      attr: {
        index: i + 1,
        duNum: 0
      }
    })
    graphicLayer.addGraphic(divGraphic)

    // 刷新局部DOM,不影响popup面板的其他控件操作
    divGraphic.on(mars3d.EventType.postRender, function (event) {
      const container = event.container // popup对应的DOM
      const graphic = event.target

      const oldVal = graphic.attr.duNum

      const newVal = Number(mars3d.Util.formatDate(new Date(), "ss")) + graphic.attr.index
      if (oldVal !== newVal) {
        graphic.attr.duNum = newVal
        const temperatureDom = container.querySelector(".temperature")
        if (temperatureDom) {
          temperatureDom.innerHTML = newVal
        }
      }
    })
  }
}

// 效果二
export function divGraphicBule() {
  graphicLayer.clear()

  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const divGraphic = new mars3d.graphic.DivGraphic({
      position: item.position,
      style: {
        html: `<div class="marsBlueGradientPnl">
            <div>${item.name}</div>
        </div>`,
        offsetY: -60,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BTOOM
      }
    })
    graphicLayer.addGraphic(divGraphic)
  }
}

// 效果三
export function divGraphicWhite() {
  graphicLayer.clear()

  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const divGraphic = new mars3d.graphic.DivUpLabel({
      position: item.position,
      style: {
        text: item.name,
        color: "#fff",
        font_size: 16,
        font_family: "微软雅黑",
        lineHeight: 50,
        circleSize: 8,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000) // 按视距距离显示
      }
    })
    graphicLayer.addGraphic(divGraphic)
  }
}

// 效果四
export function divGraphicHotSpot() {
  graphicLayer.clear()

  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const divGraphic = new mars3d.graphic.DivGraphic({
      position: item.position,
      style: {
        html: `<div class="mars-spot">
        <div class="mars-spot-board">
        <h5>${item.name}</h5>
        </div>
        <div class="mars-spot-line"></div>
      </div>`,
        offsetY: -60,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BTOOM
      }
    })
    graphicLayer.addGraphic(divGraphic)
  }
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
  })
}
