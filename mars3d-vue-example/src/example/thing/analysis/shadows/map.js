import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let shadows

export const mapOptions = {
  scene: {
    center: { lat: 33.596051, lng: 119.031383, alt: 359, heading: 180, pitch: -43 },
    fxaa: true,
    globe: {
      baseColor: "#000"
    }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  globalNotify("已知问题提示", `模型上日照阴影可能存在锯齿。`)

  // let imageryLayer = map.scene.imageryLayers.get(0)
  // imageryLayer.dayAlpha = 0.1  //白天图层透明值
  // imageryLayer.nightAlpha = 1.0 //夜晚图层透明值

  // 加个模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 80.6 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    shadows: Cesium.ShadowMode.ENABLED
  })
  map.addLayer(tilesetLayer)

  shadows = new mars3d.thing.Shadows({
    multiplier: 1600
  })
  map.addThing(shadows)

  shadows.on(mars3d.EventType.change, function () {
    const shadowTime = shadows.time
    eventTarget.fire("changeShadows", { shadowTime })
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function stopPlay() {
  if (shadows && shadows.isStart) {
    shadows.pause()
  }
}

/**
 * 开始播放
 *
 * @export
 * @param {*} date 年月日
 * @param {number} hours 小时
 * @param {number} minutes 分钟
 */
export function startPlay(date, hours, minutes) {
  const currentTime = setShadows(date, hours, minutes)
  const startDate = new Date(date + " 00:00:00")
  const endDate = new Date(date + " 23:59:59")

  shadows.start(startDate, endDate, currentTime)
}

/**
 * 修改shadows 当前时间
 *
 * @export
 * @param {*} date 年月日
 * @param {number} hours 小时
 * @param {number} minutes 分钟
 */
export function setShadows(date, hours, minutes) {
  const dateTime = new Date(`${date} ${hours}:${minutes}:00`)
  shadows.time = dateTime

  return dateTime
}
