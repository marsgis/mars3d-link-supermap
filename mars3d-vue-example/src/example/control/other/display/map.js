import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  control: {
    homeButton: true,
    sceneModePicker: true,
    navigationHelpButton: true,
    infoBox: false,
    vrButton: true,
    fullscreenButton: true,
    geocoder: "gaode",
    baseLayerPicker: true,
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
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
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 按钮
export function bindPOI(val) {
  map.controls.geocoder.show = val
}

// 视角复位
export function bindView(val) {
  map.controls.homeButton.show = val
}

// 基础的地图切换
export function bindBaseLayerPicker(val) {
  map.controls.baseLayerPicker.show = val
}

// 全屏切换
export function bindFullScreen(val) {
  map.controls.fullscreenButton.show = val
}

// VR
export function bindVR(val) {
  map.controls.vrButton.show = val
}

// 帮助按钮
export function bindHelpButton(val) {
  map.controls.navigationHelpButton.show = val
}

// 二三维切换
export function bindSceneModePicker(val) {
  map.controls.sceneModePicker.show = val
}

export function bindZoom(val) {
  map.controls.zoom.show = val
}

// 面板：
// 信息状态栏
export function bindLocation(val) {
  map.controls.locationBar.show = val
}

// 时钟
export function bindClock(val) {
  map.controls.clockAnimate.show = val
}

// 时间刻度线
export function bindTimeLine(val) {
  if (map.controls.timeline) {
    map.controls.timeline.show = val
  }

  map.controls.locationBar.setStyle({
    bottom: val ? "25px" : "0px"
  })
}

// 导航球
export function bindNav(val) {
  map.controls.compass.show = val
}

// 比例尺
export function bindLegend(val) {
  map.controls.distanceLegend.show = val
}

// 图层
export function bindLayer(val) {
  document.getElementById("mars-manage-layer-btn").style.display = val ? "inline-block" : "none"
}
