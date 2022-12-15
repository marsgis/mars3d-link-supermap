import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let contourLine

export const mapOptions = {
  scene: {
    center: { lat: 30.706401, lng: 116.08272, alt: 26859, heading: 5, pitch: -55 },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    globe: {
      showGroundAtmosphere: false,
      enableLighting: false
    }
  }
}

export const eventTabel = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  addContourLine()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addContourLine() {
  contourLine = new mars3d.thing.ContourLine({
    spacing: 100,
    width: 1.5,
    color: "rgba(255,0,0,0.8)",
    minHeight: -414.0,
    maxHeight: 8777.0,
    shadingAlpha: 0.6, /// 地表渲染的透明度
    colorScheme: {
      // 地表渲染的配色方案
      elevation: {
        step: [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0],
        color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
      },
      slope: {
        step: [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0],
        color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
      },
      aspect: {
        step: [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0],
        color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
      }
    }
  })
  map.addThing(contourLine)

  // 演示的示例区域
  const areaItem = contourLine.addArea([
    [116.003125, 30.948354, 1103.66],
    [116.23964, 30.946376, 563.02],
    [116.223677, 30.802558, 522.04],
    [115.997891, 30.807484, 440.83]
  ])
  addTableItem(areaItem)
}

// 添加矩形
export function btnDrawExtent() {
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      let positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      positions = mars3d.PointUtil.setPositionsHeight(positions, 0)
      const areaItem = contourLine.addArea(positions)
      addTableItem(areaItem)
    }
  })
}

// 添加多边形
export function btnDraw() {
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      let positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      positions = mars3d.PointUtil.setPositionsHeight(positions, 0)
      const areaItem = contourLine.addArea(positions)
      addTableItem(areaItem)
    }
  })
}

// 清除
export function clearAll() {
  contourLine.clear()
  table = []
}

// 滑动条控制
export function changeWidth(val) {
  if (val) {
    contourLine.width = val
  }
}

export function changeSpacing(val) {
  if (val) {
    contourLine.spacing = val
  }
}

// 改变颜色
export function changeColor(val) {
  contourLine.color = Cesium.Color.fromCssColorString(val)
}

// 等高线控制
export function showDengGX(val) {
  contourLine.contourShow = val
}

// 状态控制
export function chkClippingPlanes(val) {
  contourLine.showElseArea = val
}

// 阴影控制
export function changeShadingType(val) {
  contourLine.shadingType = val
}

let table = []
// 区域表格添加一行记录
function addTableItem(item) {
  table.push({ key: item.id, name: "区域" + item.id })
  const tableItem = { key: item.id, table: table }
  eventTabel.fire("tableObject", { tableItem })
}
export function changeTable(data) {
  table = data
}

// 表格操作
export function flyToGraphic(item) {
  const graphic = contourLine.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

export function deletedGraphic(item) {
  const graphic = contourLine.getAreaById(item)
  contourLine.removeArea(graphic)
}

export function showHideArea(id, selected) {
  if (selected) {
    contourLine.showArea(id)
  } else {
    contourLine.hideArea(id)
  }
}
