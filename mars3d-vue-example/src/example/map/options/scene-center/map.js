import * as mars3d from "mars3d"

export let map
let graphic

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 25.389914, lng: 119.084961, alt: 1179575, heading: 346, pitch: -60 }
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
  map.camera.percentageChanged = 0.01

  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphic = new mars3d.graphic.EllipsoidEntity({
    position: [107.39956, 29.719738, 100.9],
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2500.0, 1000.0),
      maximumConeDegree: 90, // 半球
      fill: false,
      subdivisions: 64,
      stackPartitions: 32,
      slicePartitions: 32,
      outline: true,
      outlineColor: "#ffff00",

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        outlineColor: "#ff0000"
      }
    },
    // 添加扫描面
    scanPlane: {
      step: 0.5, // 步长
      style: {
        color: "#ffff00",
        opacity: 0.4
      }
    }
  })
  graphicLayer.addGraphic(graphic)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */

export function onUnmounted() {
  map = null
}

// **************************** 景点视角演示********************** //
export function changeView1() {
  map.setCameraView({ lat: 39.904128, lng: 116.391643, alt: 1054, heading: 0, pitch: -39 })
}

export function changeView2() {
  map.setCameraView({ lat: 28.13059, lng: 86.835138, alt: 7627, heading: 148, pitch: -7 })
}

export function changeView3() {
  map.setCameraView({ lat: 34.560392, lng: 110.052393, alt: 1724, heading: 171, pitch: -5 })
}

export function changeView4() {
  map.setCameraView({ lat: 30.83463, lng: 115.86774, alt: 710, heading: 303, pitch: -7 })
}

// **************************** 相机和视角控制********************** //
export function mapGetCameraView() {
  const camera = map.getCameraView()
  globalAlert(JSON.stringify(camera), "当前视角参数")
}

export function mapSetCameraView() {
  map.setCameraView({ lat: 26.8764, lng: 91.148781, alt: 223798, heading: 0, pitch: -45 })
}

export function mapSetCameraViewList() {
  // 视角切换（分步执行）, stop设置停留在该视角的时间
  map.setCameraViewList([
    { lng: 108.961601, lat: 34.217109, alt: 509.2, heading: 314.5, pitch: -22.5, duration: 8, stop: 0 },
    { lng: 108.96164, lat: 34.222159, alt: 510.3, heading: 211.2, pitch: -22.5, duration: 5, stop: 0 },
    { lng: 108.957259, lat: 34.221967, alt: 494.3, heading: 127.5, pitch: -17.2, duration: 5, stop: 0 },
    { lng: 108.957319, lat: 34.217225, alt: 515.5, heading: 25.4, pitch: -25.3, duration: 5 }
  ])
}

export function mapFlyHome() {
  map.flyHome()
}

export function mapFlyToGraphic() {
  map.flyToGraphic(graphic, { radius: 10000 })
}

export function mapFlyToExtent() {
  map.flyToExtent({ xmin: 114.811691, xmax: 119.703609, ymin: 29.35597, ymax: 34.698585 })
}

export function mapFlyToPositions() {
  map.flyToPositions([
    [114.031965, 36.098482, 332.8],
    [114.038309, 36.089496, 267.6],
    [114.048026, 36.093311, 255.7],
    [114.041602, 36.102055, 377.5]
  ])
}

export function mapFlyToPoint() {
  map.flyToPoint([113.939351, 36.068144, 350.9])
}

export function mapCancelFlyTo() {
  map.cancelFlyTo()
}
