import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let graphic
let waterLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.791718, lng: 121.479859, alt: 29, heading: 187, pitch: -14 }
  },
  layers: [
    {
      type: "3dtiles",
      name: "整体模型",
      url: "//data.mars3d.cn/3dtiles/max-fsdzm/tileset.json",
      position: { alt: 15.2 },
      maximumScreenSpaceError: 1,
      maximumMemoryUsage: 1024,
      show: true
    },
    {
      type: "geojson",
      name: "河流(面状)",
      url: "//data.mars3d.cn/file/geojson/hedao-nei.json",
      symbol: {
        type: "waterC",
        styleOptions: {
          height: 17, // 水面高度
          normalMap: "img/textures/waterNormals.jpg", // 水正常扰动的法线图
          frequency: 8000.0, // 控制波数的数字。
          animationSpeed: 0.02, // 控制水的动画速度的数字。
          amplitude: 5.0, // 控制水波振幅的数字。
          specularIntensity: 0.8, // 控制镜面反射强度的数字。
          baseWaterColor: "#006ab4", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
          blendColor: "#006ab4", // 从水中混合到非水域时使用的rgba颜色对象。
          opacity: 0.4, // 透明度
          clampToGround: false // 是否贴地
        }
      },
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  waterLayer = new mars3d.layer.GeoJsonLayer({
    name: "河流(面状)",
    url: "//data.mars3d.cn/file/geojson/hedao-wai.json",
    symbol: {
      type: "waterC",
      styleOptions: {
        height: 16, // 水面高度
        normalMap: "img/textures/waterNormals.jpg", // 水正常扰动的法线图
        frequency: 8000.0, // 控制波数的数字。
        animationSpeed: 0.02, // 控制水的动画速度的数字。
        amplitude: 5.0, // 控制水波振幅的数字。
        specularIntensity: 0.8, // 控制镜面反射强度的数字。
        baseWaterColor: "#006ab4", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
        blendColor: "#006ab4", // 从水中混合到非水域时使用的rgba颜色对象。
        opacity: 0.4, // 透明度
        clampToGround: false // 是否贴地
      }
    }
  })
  map.addLayer(waterLayer)

  // 绑定事件
  waterLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
  waterLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })

  // 闸门的控制
  graphic = new mars3d.graphic.ModelEntity({
    name: "闸门",
    position: [121.479813, 29.791278, 16],
    style: {
      url: "//data.mars3d.cn/gltf/mars/zhamen.glb",
      heading: 105
    }
  })
  map.graphicLayer.addGraphic(graphic)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

const minHeight = 16
let timeInv
// 高度更新
 function updateHeight(height) {
  graphic.height = height // 阀门高度
  waterLayer.eachGraphic((graphic) => {
    graphic.updateHeight(height) // 水域高度变化
  })
}

/**
 * 开启阀门
 *
 * @export
 * @param {number} height  阀门高度  单位: m
 * @param {number} time //时间 单位:s
 * @returns {void} 无
 */
export function openZm(height, time) {
  let thisHeight = minHeight // 当前高度
  const endHeight = height + minHeight // 结束高度

  const step = time / 0.1 // 步长
  const stepHeight = (endHeight - thisHeight) / step // 每次阀门、水面上移高度

  // 再次点击"开启"时从当前位置开启
  updateHeight(thisHeight)

  clearInterval(timeInv)
  timeInv = setInterval(() => {
    thisHeight += stepHeight // 上移后的当前高度,相当于时实更新

    if (thisHeight >= endHeight) {
      thisHeight = endHeight
      clearInterval(timeInv) // 清除定时器,当前阀门的高度值等于结束时阀门的高度值时，停止上移，关闭定时器
    }
    updateHeight(thisHeight)
  }, 100)
}

/**
 * 关闭阀门
 *
 * @export
 * @param {number} height  阀门高度 单位: m
 * @param {number} time //时间 单位:s
 * @returns {void} 无
 */
export function closeZm(height, time) {
  let thisHeight = height + minHeight
  const endHeight = minHeight

  const step = time / 0.1
  const stepHeight = (endHeight - thisHeight) / step

  updateHeight(thisHeight)

  clearInterval(timeInv)
  timeInv = setInterval(() => {
    thisHeight += stepHeight

    if (thisHeight <= endHeight) {
      thisHeight = endHeight
      clearInterval(timeInv)
    }
    updateHeight(thisHeight)
  }, 100)
}
