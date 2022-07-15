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

  addMeasure()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addMeasure() {
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
    showAddText: true
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
    showAddText: true
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
    splitNum: 10 // step插值分割的个数
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
