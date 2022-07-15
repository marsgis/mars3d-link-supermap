import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 32.432718, lng: 115.602003, alt: 108, heading: 237, pitch: -31 },
    globe: {
      depthTestAgainstTerrain: true
    }
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

  // 显示水域
  const waterLayer = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/wangjiaba.json",
    symbol: {
      type: "waterC",
      styleOptions: {
        height: 18, // 水面高度
        normalMap: "img/textures/waterNormals.jpg", // 水正常扰动的法线图
        frequency: 9000.0, // 控制波数的数字。
        animationSpeed: 0.03, // 控制水的动画速度的数字。
        amplitude: 5.0, // 控制水波振幅的数字。
        specularIntensity: 0.2, // 控制镜面反射强度的数字。
        baseWaterColor: "#123e59", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
        blendColor: "#123e59" // 从水中混合到非水域时使用的rgba颜色对象。
      }
    }
  })
  map.addLayer(waterLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addWaterGate()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 添加水柱
function addWaterGate() {
  // 水柱位置
  const posArr = [
    [115.600031, 32.43217, 28],
    [115.600104, 32.432121, 28],
    [115.600163, 32.432059, 28],
    [115.600246, 32.432014, 28],
    [115.600324, 32.431971, 28],
    [115.600404, 32.431927, 28],
    [115.600484, 32.431882, 28],
    [115.600563, 32.431839, 28],
    [115.600646, 32.431793, 28],
    [115.600727, 32.431749, 28],
    [115.600806, 32.431706, 28],
    [115.600886, 32.431661, 28],
    [115.600967, 32.431617, 28]
  ]

  for (let i = 0, len = posArr.length; i < len; i++) {
    const pos = posArr[i]

    const particleSystem = new mars3d.graphic.ParticleSystem({
      id: i + 1,
      position: pos, // 位置
      style: {
        image: "./img/particle/smoke.png",
        particleSize: 16, // 粒子大小（单位：像素）
        emissionRate: 100.0, // 发射速率 （单位：次/秒）
        heading: 120, // 方向角
        pitch: 45, // 俯仰角
        gravity: -11, // 重力因子，会修改速度矢量以改变方向或速度（基于物理的效果）
        transZ: 5, // 离地高度（单位：米）
        // maxHeight: 2000, // 超出该高度后不显示粒子效果

        startColor: Cesium.Color.LIGHTCYAN.withAlpha(0.3), // 开始颜色
        endColor: Cesium.Color.WHITE.withAlpha(0.0), // 结束颜色
        minimumParticleLife: 1, // 最小寿命时间（秒）
        maximumParticleLife: 4, // 最大寿命时间（秒）
        minimumSpeed: 10.0, // 最小速度(米/秒)
        maximumSpeed: 14.0 // 最大速度(米/秒)
      }
    })
    graphicLayer.addGraphic(particleSystem)
  }
}

// 单个闸门控制
export function onChangeGate(id, checked) {
  const particleSystem = graphicLayer.getGraphicById(id)
  if (particleSystem) {
    particleSystem.show = !checked
  }
}
// 全部闸门的控制
export function bindShowAll(val) {
  graphicLayer.eachGraphic((graphic) => {
    graphic.show = val
  })
}
