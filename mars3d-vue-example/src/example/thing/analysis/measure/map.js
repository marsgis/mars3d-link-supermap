import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let measure

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  measure = new mars3d.thing.Measure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20,
      background: false
    }
  })
  map.addThing(measure)

  measure.on(mars3d.EventType.start, function (e) {
    console.log("开始异步分析", e)
    showLoading()
  })
  measure.on(mars3d.EventType.end, function (e) {
    console.log("完成异步分析", e)
    hideLoading()
  })

  // 加一些演示数据
  addDemoGraphic1(measure.graphicLayer)
  addDemoGraphic2(measure.graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function onlyPickModelPosition(val) {
  // 控制鼠标只取模型上的点，忽略地形上的点的拾取
  map.onlyPickModelPosition = val
}

export function removeAll() {
  measure.clear()
}

// 空间距离
export function measureLength() {
  measure.distance({
    showAddText: true,
    label: {
      // 自定义显示label的graphic类型
      type: "div",
      updateText: function (text, graphic) {
        // updateText是必须，用于动态更新 text
        graphic.html = `<div class="marsGreenGradientPnl" >${text}</div>`
      },
      // 下面是graphic对应类型本身的参数
      html: `<div class="marsGreenGradientPnl" ></div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    }
    // style: {
    //   color: '#ffff00',
    //   width: 3,
    //   clampToGround: false //是否贴地
    // }
  })
}
// 贴地距离
export function measureSurfaceLength() {
  measure.distanceSurface({
    showAddText: true,
    exact: false // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
    // unit: 'm', //支持传入指定计量单位
    // style: {
    //   color: '#ffff00',
    //   width: 3,
    //   clampToGround: true //是否贴地
    // }
  })
}
// 水平面积
export function measureArea() {
  measure.area({
    // style: {
    //   color: '#00fff2',
    //   opacity: 0.4,
    //   outline: true,
    //   outlineColor: '#fafa5a',
    //   outlineWidth: 1,
    //   clampToGround: false //贴地
    // }
  })
}
// 贴地面积
export function measureSurfaceeArea() {
  measure.areaSurface({
    style: {
      color: "#ffff00"
    },
    splitNum: 10, // step插值分割的个数
    exact: false // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
  })
}
// 高度差
export function measureHeight() {
  measure.height()
}

// 三角测量
export function measureTriangleHeight() {
  measure.heightTriangle()
}

// 方位角
export function measureAngle() {
  measure.angle()
}

// 坐标测量
export function measurePoint() {
  measure.point()
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.DistanceMeasure({
    positions: [
      [116.193794, 30.994415, 654.8],
      [116.236077, 30.925154, 506.2],
      [116.314569, 30.864239, 408.7],
      [116.341924, 30.847984, 381.8],
      [116.392754, 30.854264, 581.7],
      [116.415222, 30.880092, 580.5],
      [116.567457, 30.85223, 314.6]
    ],
    style: {
      width: 5,
      color: "#3388ff"
    },
    showAddText: true,
    label: {
      // 自定义显示label的graphic类型
      type: "div",
      updateText: function (text, graphic) {
        // updateText是必须，用于动态更新 text
        graphic.html = `<div class="marsGreenGradientPnl" >${text}</div>`
      },
      // 下面是graphic对应类型本身的参数
      html: `<div class="marsGreenGradientPnl" ></div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.AreaMeasure({
    positions: [
      [116.361008, 31.128286, 802.2],
      [116.375784, 31.029192, 868.6],
      [116.497717, 31.063687, 497.5],
      [116.509114, 31.146745, 577.1],
      [116.425476, 31.184474, 676.2]
    ],
    style: {
      color: "#ff0000"
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)
}
