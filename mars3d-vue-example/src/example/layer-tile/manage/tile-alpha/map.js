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

  showImages()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// ImageLayer的方式
function showImages() {
  const urlArr = [
    "//data.mars3d.cn/file/img/radar/201906211112.PNG",
    "//data.mars3d.cn/file/img/radar/201906211124.PNG",
    "//data.mars3d.cn/file/img/radar/201906211130.PNG",
    "//data.mars3d.cn/file/img/radar/201906211136.PNG",
    "//data.mars3d.cn/file/img/radar/201906211142.PNG"
  ]

  const arrTileLayer = []
  for (let i = 0, len = urlArr.length; i < len; i++) {
    const tileLayer = new mars3d.layer.ImageLayer({
      url: urlArr[i],
      rectangle: { xmin: 73.16895, xmax: 134.86816, ymin: 12.2023, ymax: 54.11485 },
      alpha: 0
    })
    map.addLayer(tileLayer)
    arrTileLayer.push(tileLayer)
  }

  let step = 0
  const alphaStep = 0.01
  let idxTimer

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

  changeRadarAlpha(1)
}

//  RectangleEntity的方式
// function showImages2() {
//   const urlArr = [
//     "//data.mars3d.cn/file/img/radar/201906211112.PNG",
//     "//data.mars3d.cn/file/img/radar/201906211124.PNG",
//     "//data.mars3d.cn/file/img/radar/201906211130.PNG",
//     "//data.mars3d.cn/file/img/radar/201906211136.PNG",
//     "//data.mars3d.cn/file/img/radar/201906211142.PNG"
//   ]
//   const arrMaterial = []
//   for (let i = 0, len = urlArr.length; i < len; i++) {
//     const material = new mars3d.material.Image2MaterialProperty({
//       image: urlArr[i],
//       opacity: 0.0
//     })
//     const graphic = new mars3d.graphic.RectangleEntity({
//       positions: [
//         [73.16895, 13.2023],
//         [134.86816, 55.11485]
//       ],
//       style: {
//         material: material,
//         clampToGround: true
//       }
//     })
//     map.graphicLayer.addGraphic(graphic)
//     arrMaterial.push(material)
//   }

//   let step = 0
//   const alphaStep = 0.01
//   let idxTimer
//   function changeRadarAlpha(time) {
//     if (step > arrMaterial.length - 1) {
//       step = 0
//       arrMaterial[arrMaterial.length - 1].alpha = 0
//     }
//     const material1 = arrMaterial[step]
//     const material2 = arrMaterial[step + 1]
//     if (!material1 || !material2) {
//       return
//     }
//     material1.opacity = 1
//     material2.opacity = 0

//     clearInterval(idxTimer)
//     idxTimer = window.setInterval(function () {
//       material1.opacity -= alphaStep
//       material2.opacity += alphaStep

//       if (material1.opacity < alphaStep) {
//         material1.opacity = 0
//         step++
//         changeRadarAlpha(time)
//       }
//     }, time * 1000 * alphaStep)
//   }

//   changeRadarAlpha(1)
// }
