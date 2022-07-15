import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 26.163233, lng: 77.849567, alt: 17754541, heading: 0, pitch: -90 },
    sceneMode: 2
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
  map = mapInstance // 记录map

  map.basemap = 2017 // 蓝色底图

  // 加载数据
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/oneBeltOneRoad.json" })
    .then(function (res) {
      showRoad(res.data.land, {
        name: "丝绸之路经济带",
        color: Cesium.Color.CORAL
      })

      showRoad(res.data.sea, {
        name: "21世纪海上丝绸之路",
        color: Cesium.Color.DEEPSKYBLUE
      })
    })
    .catch(function () {
      globalMsg("实时查询信息失败，请稍候再试")
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function showRoad(arr, options) {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  let arrPosition = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    const position = Cesium.Cartesian3.fromDegrees(item.x, item.y)
    item.position = position

    arrPosition.push(position)

    // 创建点
    if (item.icon) {
      const billboardPrimitive = new mars3d.graphic.BillboardPrimitive({
        name: item.name,
        position: position,
        style: {
          image: "img/country/" + item.icon,
          scale: 0.7,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          label: {
            text: item.name,
            font_size: 17,
            font_family: "楷体",
            color: Cesium.Color.WHITE,
            outline: true,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -30)
          }
        }
      })
      graphicLayer.addGraphic(billboardPrimitive)

      const html = `<div class="mars-load-location">
        ${item.continent} - ${item.country} - <span style="color: #00ffff;">${item.name}</span>
      </div>`
      billboardPrimitive.bindPopup(html)
    }
  }

  arrPosition = arrPosition.reverse()
  const positions = mars3d.PolyUtil.getBezierCurve(arrPosition)
  positions.push(arrPosition[arrPosition.length - 1])

  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: positions,
    style: {
      width: 4,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/line-pulse.png",
        color: options.color,
        repeat: new Cesium.Cartesian2(10.0, 1.0),
        speed: 2
      }
    }
  })
  graphicLayer.addGraphic(graphic)

  graphic.bindTooltip(options.name)
}
