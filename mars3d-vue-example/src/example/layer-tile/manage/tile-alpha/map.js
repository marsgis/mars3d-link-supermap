import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 28.118943, lng: 114.834765, alt: 4038547, heading: 351, pitch: -83 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
  start(1)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let step = 0
let arrTileLayer

function start(time) {
  const urlArr = [
    "//data.mars3d.cn/file/img/radar/201906211112.PNG",
    "//data.mars3d.cn/file/img/radar/201906211124.PNG",
    "//data.mars3d.cn/file/img/radar/201906211130.PNG",
    "//data.mars3d.cn/file/img/radar/201906211136.PNG",
    "//data.mars3d.cn/file/img/radar/201906211142.PNG"
  ]

  const arr = []
  for (let i = 0, len = urlArr.length; i < len; i++) {
    const tileLayer = new mars3d.layer.ImageLayer({
      url: urlArr[i],
      rectangle: { xmin: 73.16895, xmax: 134.86816, ymin: 12.2023, ymax: 54.11485 },
      alpha: 0
    })
    map.addLayer(tileLayer)
    arr.push(tileLayer)
  }

  arrTileLayer = arr
  step = 0
  changeRadarAlpha(time)
}

let idxTimer
const alphaStep = 0.01

function changeRadarAlpha(time) {
  if (step > arrTileLayer.length - 1) {
    step = 0
    arrTileLayer[arrTileLayer.length - 1].alpha = 0
  }
  const layer1 = arrTileLayer[step]
  const layer2 = arrTileLayer[step + 1]
  if (!layer1 || !layer2) {
    return
  }
  layer1.alpha = 1
  layer2.alpha = 0

  clearInterval(idxTimer)
  idxTimer = window.setInterval(function () {
    layer1.alpha -= alphaStep
    layer2.alpha += alphaStep

    if (layer1.alpha < alphaStep) {
      layer1.alpha = 0
      step++
      changeRadarAlpha(time)
    }
  }, time * 1000 * alphaStep)
}
