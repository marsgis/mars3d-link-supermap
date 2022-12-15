import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 属性参数，将覆盖config.json中的对应配置
export const mapOptions = {
  scene: {
    center: { lat: 36.045934, lng: 113.942816, alt: 1663, heading: 2, pitch: -25 }
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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let pointLayer
let textLayer
let polyLineLayer
let lineGraphic
let polyline1
let polyline2
let contourLine

// 山顶点
export function workPoint1Sdd() {
  clearPoint()
  clearLine()
  map.setCameraView({ lat: 36.061395, lng: 113.94298, alt: 1903, heading: 0, pitch: -57.5 })

  const arrPoint = [
    [113.944168, 36.071057, 536.1],
    [113.939593, 36.072087, 510.42],
    [113.942957, 36.067383, 462.29],
    [113.949512, 36.07117, 460.67]
  ]

  pointLayer = createArrPoint(arrPoint) // 添加点
  textLayer = createArrText(arrPoint, "山顶点") // 添加注记
}

// 特征点：鞍部点
export function workPoint2Abd() {
  clearPoint()
  clearLine()
  // 视角定位
  map.setCameraView(
    {
      lat: 36.06062,
      lng: 113.942836,
      alt: 1351,
      heading: 0,
      pitch: -43.5
    },
    {
      complete: () => {
        startRotatePoint()
        setTimeout(() => {
          stopRotatePoint()
        }, 6000)
      }
    }
  )

  const arrPoint = [
    [113.943496, 36.068508, 449.63],
    [113.941962, 36.071444, 481.09],
    [113.948862, 36.071282, 453.99]
  ]
  pointLayer = createArrPoint(arrPoint)
  textLayer = createArrText(arrPoint, "鞍部点") // 添加注记
}

// 特征点：坡度变换点
export function workPoint3Pdbhd() {
  clearPoint()
  clearLine()
  // 视角定位
  map.setCameraView({ lat: 36.062523, lng: 113.946202, alt: 1343.59, heading: 353.6, pitch: -42, roll: 0 })

  const arrPoint = [
    [113.945927, 36.069593, 431.33],
    [113.94593, 36.073602, 427.86],
    [113.942159, 36.072318, 443.86],
    [113.940766, 36.0693, 389.26]
  ]
  pointLayer = createArrPoint(arrPoint)
  textLayer = createArrText(arrPoint, "坡度变换点") // 添加注记
}

// 特征点：山脚点
export function workPoint4Sjd() {
  clearPoint()
  clearLine()
  // 视角定位
  map.setCameraView({ lat: 36.05423, lng: 113.945328, alt: 1087.7, heading: 352.4, pitch: -25.4, roll: 0 })

  const arrPoint = [
    [113.944745, 36.063709, 350.32],
    [113.950068, 36.066712, 363.01],
    [113.936588, 36.065365, 351.94]
  ]
  pointLayer = createArrPoint(arrPoint)
  textLayer = createArrText(arrPoint, "山脚点") // 添加注记
}

// 特征点：山脚坡度变化点
export function workPoint5Sjpdbhd() {
  clearPoint()
  clearLine()
  // 视角定位
  map.setCameraView({ lat: 36.055819, lng: 113.950153, alt: 696.74, heading: 334.4, pitch: -13.2, roll: 359.9 })

  const arrPoint = [
    [113.948382, 36.068049, 414.36],
    [113.938975, 36.06497, 395.87],
    [113.941956, 36.064592, 365.89]
  ]
  pointLayer = createArrPoint(arrPoint)
  textLayer = createArrText(arrPoint, "山脚坡度变换点") // 添加注记
}

// 特征点：倾斜变换点
export function workPoint6Qxbhd() {
  clearPoint()
  clearLine()
  // 视角定位
  map.setCameraView(
    { lat: 36.064181, lng: 113.94491, alt: 1139.24, heading: 352.6, pitch: -41.2, roll: 0 },
    {
      complete: function () {
        startRotatePoint()
      }
    }
  )

  const arrPoint = [
    [113.941119, 36.070139, 415.86],
    [113.945836, 36.069939, 453.99],
    [113.942108, 36.072372, 443.98],
    [113.945918, 36.073087, 452.72]
  ]
  pointLayer = createArrPoint(arrPoint)
  textLayer = createArrText(arrPoint, "倾斜变换点") // 添加注记
}

// 特征线：山脊线
export function workLine1Sjx() {
  clearPoint()
  map.setCameraView({
    lat: 36.05982,
    lng: 113.943515,
    alt: 1534.08,
    heading: 354.6,
    pitch: -46.1,
    roll: 0
  })

  // 添加线
  const lineArr = [
    {
      point: [
        [113.944168, 36.071057, 536.1],
        [113.943975, 36.070229, 497.2],
        [113.943899, 36.0693, 467.49],
        [113.943496, 36.068508, 449.63]
      ]
    },
    {
      point: [
        [113.944168, 36.071057, 536.1],
        [113.943383, 36.071112, 517.51],
        [113.94277, 36.071261, 495.99],
        [113.941962, 36.071444, 481.09]
      ]
    },
    {
      point: [
        [113.944168, 36.071057, 536.1],
        [113.945999, 36.071174, 506.33],
        [113.946798, 36.071624, 506.06],
        [113.948012, 36.071508, 485.02],
        [113.948862, 36.071282, 453.99]
      ]
    },
    {
      point: [
        [113.939593, 36.072087, 510.42],
        [113.941962, 36.071444, 481.09]
      ]
    },
    {
      point: [
        [113.942957, 36.067383, 462.29],
        [113.943496, 36.068508, 449.63]
      ]
    },
    {
      point: [
        [113.939593, 36.072087, 510.42],
        [113.93902, 36.071731, 506.14],
        [113.938092, 36.071371, 492.84],
        [113.937261, 36.07093, 493.41],
        [113.936637, 36.070518, 477.11]
      ]
    },
    {
      point: [
        [113.944168, 36.071057, 536.1],
        [113.944119, 36.07132, 538.46],
        [113.943971, 36.071771, 534.68],
        [113.944034, 36.072314, 524.35],
        [113.944123, 36.073456, 477.01],
        [113.944412, 36.074636, 432.25]
      ]
    },
    {
      point: [
        [113.939593, 36.072087, 510.42],
        [113.939058, 36.072637, 507.68],
        [113.938715, 36.073519, 506.89],
        [113.937723, 36.07391, 483.06]
      ]
    }
  ]

  polyLineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(polyLineLayer)

  for (let i = 0; i < lineArr.length; i++) {
    const item = lineArr[i]

    const line = new mars3d.graphic.PolylineEntity({
      positions: item.point,
      style: {
        width: 5,
        clampToGround: true,
        materialType: mars3d.MaterialType.LineFlow,
        materialOptions: {
          color: Cesium.Color.YELLOW,
          speed: 3, // 控制速度
          url: "img/textures/line-color-yellow.png"
        }
      },
      tooltip: "山脊线"
    })
    polyLineLayer.addGraphic(line)
  }

  setTimeout(() => {
    if (polyLineLayer) {
      polyLineLayer.eachGraphic((graphic) => {
        delete graphic.style.material
        graphic.setStyle({
          material: Cesium.Color.YELLOW
        })
      })
    }
  }, 4000)
}

// 特征线：山谷线
export function workLine2Sgx() {
  clearPoint()
  map.setCameraView({ lat: 36.05648, lng: 113.944653, alt: 2092, heading: 354.4, pitch: -44.6 })

  // 添加线
  const lineArr = [
    {
      point: [
        [113.941971, 36.073964, 403.46],
        [113.941941, 36.073397, 414.46],
        [113.942012, 36.072802, 427.98],
        [113.94214, 36.072218, 445.57],
        [113.941901, 36.071582, 482.41],
        [113.941634, 36.071088, 468.32],
        [113.941371, 36.070708, 446.86],
        [113.941284, 36.070435, 431.69],
        [113.94103, 36.069954, 408.35],
        [113.941016, 36.06991, 406.56],
        [113.940603, 36.069227, 385.57],
        [113.939335, 36.067923, 367.22]
      ]
    },
    {
      point: [
        [113.946025, 36.074151, 403.28],
        [113.945954, 36.073467, 433.98],
        [113.945871, 36.072436, 484.02],
        [113.94603, 36.07161, 507.66],
        [113.946168, 36.071048, 501.99],
        [113.945904, 36.070101, 468.17],
        [113.945797, 36.069853, 447.03],
        [113.946002, 36.069094, 406.59],
        [113.946279, 36.067475, 378.83]
      ]
    }
  ]

  polyLineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(polyLineLayer)

  for (let i = 0; i < lineArr.length; i++) {
    const item = lineArr[i]

    const line = new mars3d.graphic.PolylineEntity({
      positions: item.point,
      style: {
        width: 5,
        clampToGround: true,
        materialType: mars3d.MaterialType.LineFlow,
        materialOptions: {
          color: Cesium.Color.AQUA,
          speed: 3, // 控制速度
          url: "img/textures/line-color-yellow.png"
        }
      },
      tooltip: "山谷线"
    })
    polyLineLayer.addGraphic(line)
  }

  setTimeout(() => {
    if (polyLineLayer) {
      polyLineLayer.eachGraphic((graphic) => {
        delete graphic.style.material
        graphic.setStyle({
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.AQUA,
            dashLength: 10.0
          })
        })
      })
    }
  }, 4000)
}

// 特征线：俯瞰
export function workLine3Fk() {
  clearPoint()
  map.setCameraView({ lat: 36.070613, lng: 113.943032, alt: 3059, heading: 0.6, pitch: -88.9 })
}

// 绘制过程：计算通过点
export function workDgx1Point() {
  clearPoint()
  map.setCameraView({ lat: 36.06874, lng: 113.948078, alt: 811.62, heading: 292.6, pitch: -39.6 })

  const arrPoint = [
    [113.944168, 36.071057, 536.1],
    [113.94405, 36.070572, 519.49],
    [113.943981, 36.070254, 498.84],
    [113.943944, 36.069863, 480.01]
  ]
  pointLayer = createArrPoint(arrPoint)

  const labelText = ["b", "m", "g", "f", "h"]
  pointLayer.eachGraphic((graphic, index) => {
    graphic.setStyle({
      label: {
        text: labelText[index] || "",
        color: "yellow",
        font_size: 30
      }
    })
  })

  lineGraphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [113.944168, 36.071057, 536.1],
      [113.94405, 36.070572, 519.49],
      [113.943981, 36.070254, 498.84],
      [113.943944, 36.069863, 480.01]
    ],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: Cesium.Color.MAGENTA,
        speed: 3, // 控制速度
        url: "img/textures/line-color-yellow.png"
      }
    }
  })
  map.graphicLayer.addGraphic(lineGraphic)
}

// 绘制过程：等高线绘制
export function workDgx2Line() {
  clearPoint()
  map.setCameraView({ lat: 36.069792, lng: 113.944474, alt: 1708, heading: 357, pitch: -82 })

  const arrPoint = [
    [113.946061, 36.070867, 500.37],
    [113.943193, 36.070854, 499.86],
    [113.943335, 36.072232, 500.31],
    [113.94469, 36.072746, 499.44],
    [113.946753, 36.072311, 499.98],
    [113.945146, 36.071556, 519.6],
    [113.944671, 36.072169, 519.95],
    [113.943607, 36.071978, 519.48],
    [113.94405, 36.070572, 519.49],
    [113.944739, 36.070756, 520.55]
  ]
  pointLayer = createArrPoint(arrPoint)

  polyline1 = new mars3d.graphic.PolylineEntity({
    positions: [
      [113.945146, 36.071556, 519.6],
      [113.945021, 36.071174, 520.26],
      [113.945016, 36.070846, 519.28],
      [113.944739, 36.070756, 520.55],
      [113.944624, 36.070604, 520.01],
      [113.944312, 36.070527, 519.49],
      [113.94405, 36.070572, 519.49],
      [113.943976, 36.070636, 520.27],
      [113.943861, 36.070697, 520.12],
      [113.943354, 36.071204, 520],
      [113.943607, 36.071978, 519.48],
      [113.943847, 36.072224, 520.7],
      [113.943889, 36.072331, 520.5],
      [113.944011, 36.072474, 520.19],
      [113.944671, 36.072169, 519.95],
      [113.94511, 36.071581, 520.05],
      [113.945146, 36.071556, 519.6]
    ],
    style: {
      width: 3,
      color: "#ff0000",
      clampToGround: true,
      closure: true
    }
  })
  map.graphicLayer.addGraphic(polyline1)

  polyline2 = new mars3d.graphic.PolylineEntity({
    positions: [
      [113.946061, 36.070867, 500.37],
      [113.945214, 36.070585, 500.84],
      [113.944658, 36.070309, 500.26],
      [113.943981, 36.070254, 498.84],
      [113.943577, 36.070474, 499.95],
      [113.943193, 36.070854, 499.86],
      [113.942839, 36.071247, 498.53],
      [113.942921, 36.071562, 499.55],
      [113.943109, 36.071823, 500],
      [113.943335, 36.072232, 500.31],
      [113.94356, 36.072587, 501.02],
      [113.943696, 36.072889, 499.57],
      [113.944123, 36.073112, 496.9],
      [113.94469, 36.072746, 499.44],
      [113.944974, 36.072371, 501.42],
      [113.945401, 36.071963, 500.52],
      [113.945867, 36.071986, 500.11],
      [113.946358, 36.071794, 500.05],
      [113.946546, 36.071771, 500.47],
      [113.946515, 36.071902, 500.13],
      [113.94662, 36.072107, 499.93],
      [113.946618, 36.072232, 500.05],
      [113.946753, 36.072311, 499.98],
      [113.947247, 36.072043, 499.98],
      [113.947433, 36.071534, 499.67],
      [113.946848, 36.071405, 500.22],
      [113.946155, 36.070912, 499.86],
      [113.946061, 36.070867, 500.37]
    ],
    style: {
      width: 3,
      color: "#ff0000",
      clampToGround: true,
      closure: true
    }
  })
  map.graphicLayer.addGraphic(polyline2)
}

// 绘制过程：等高线结果
export function workDgx3End() {
  clearPoint()
  map.setCameraView(
    { lat: 36.064736, lng: 113.935567, alt: 1276.68, heading: 52.4, pitch: -44.5, roll: 0, duration: 3 },
    {
      complete() {
        startRotatePoint(new Cesium.Cartesian3.fromDegrees(113.942685, 36.07012, 461.53))
      }
    }
  )

  contourLine = new mars3d.thing.ContourLine({
    positions: [
      [113.941558, 36.078396, 370.6],
      [113.932244, 36.069158, 376.55],
      [113.942587, 36.061319, 320],
      [113.952388, 36.071267, 379.63],
      [113.941558, 36.078396, 370.6]
    ],
    spacing: 20,
    width: 1.5,
    color: Cesium.Color.RED
  })
  map.addThing(contourLine)
}

// 创建点 公共方法
export function createArrPoint(arrPoint) {
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  for (let i = 0; i < arrPoint.length; i++) {
    const item = arrPoint[i]

    const graphic = new mars3d.graphic.PointEntity({
      position: item,
      style: {
        color: "#ffffff",
        opacity: 0.9,
        outline: true,
        outlineColor: "#ff0000",
        outlineWidth: 2,
        visibleDepth: true,
        clampToGround: true,
        pixelSize: 10,
        label: {
          text: item[2] + "",
          font_size: 18,
          font_family: "楷体",
          color: Cesium.Color.AZURE,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(-10, -10) // 偏移量
        }
      }
    })
    graphicLayer.addGraphic(graphic)
  }
  return graphicLayer
}

// 创建文本指示  公共方法
export function createArrText(arrPoint, name) {
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  for (let i = 0; i < arrPoint.length; i++) {
    const item = arrPoint[i]

    // 文字注记
    const graphic = new mars3d.graphic.DivGraphic({
      position: item,
      style: {
        html: `<div class="marsImgPanel1">
                <div class="title">${name}</div>
            </div >`,
        clampToGround: true,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    })
    graphicLayer.addGraphic(graphic)
  }
  return graphicLayer
}

// 绕点飞行
let rotatePoint
export function startRotatePoint(center) {
  if (!rotatePoint) {
    rotatePoint = new mars3d.thing.RotatePoint({
      direction: false, // 方向 true逆时针，false顺时针
      time: 50 // 给定飞行一周所需时间(单位 秒)，控制速度
    })
    map.addThing(rotatePoint)
  }
  // 开启旋转
  rotatePoint.start(center)
}

export function stopRotatePoint() {
  if (rotatePoint) {
    rotatePoint.stop()
  }
}

// 清除页面
export function clear() {
  clearPoint()
  clearLine()
}

export function clearPoint() {
  pointLayer && pointLayer.destroy()
  textLayer && textLayer.destroy()
  pointLayer = null
  textLayer = null
  stopRotatePoint()
}

export function clearLine() {
  polyLineLayer && polyLineLayer.destroy()
  lineGraphic && lineGraphic.remove()
  polyline1 && polyline1.remove()
  polyline2 && polyline2.remove()
  contourLine && map.removeThing(contourLine, true)
  lineGraphic = null
  polyline1 = null
  polyline2 = null
  contourLine = null
  polyLineLayer = null
  stopRotatePoint()
}

// 停止视角定位操作
export function cancelFlight() {
  map.cancelFlight()
}
