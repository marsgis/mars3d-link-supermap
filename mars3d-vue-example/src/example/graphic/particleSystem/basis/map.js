import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.815095, lng: 117.220438, alt: 520, heading: 90, pitch: -47 }
  }
}

export let graphicLayer

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 喷泉效果
function addDemoGraphic1(graphicLayer) {
  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: Cesium.Cartesian3.fromDegrees(117.224855, 31.815135, 28.05), // 位置
    style: {
      image: "./img/particle/penquan.png",
      particleSize: 8, // 粒子大小（单位：像素）
      emissionRate: 100.0, // 发射速率 （单位：次/秒）
      heading: 290, // 方向角
      pitch: 40, // 俯仰角
      gravity: -3.5, // 重力因子，会修改速度矢量以改变方向或速度（基于物理的效果）
      transZ: 5, // 离地高度（单位：米）
      maxHeight: 5000, // 超出该高度后不显示粒子效果

      startColor: new Cesium.Color(1, 1, 1, 0.6), //  开始颜色
      endColor: new Cesium.Color(0.8, 0.86, 1, 0.4), // 结束颜色
      startScale: 1.0, //  开始比例（单位：相对于imageSize大小的倍数）
      endScale: 4.0, // 结束比例（单位：相对于imageSize大小的倍数）
      minimumParticleLife: 6, // 最小寿命时间（秒）
      maximumParticleLife: 7, // 最大寿命时间（秒）
      minimumSpeed: 9.0, // 最小速度(米/秒)
      maximumSpeed: 9.5 // 最大速度(米/秒)
    },
    attr: { remark: "水柱粒子效果" }
  })

  graphicLayer.addGraphic(particleSystem)
}

// 火炬效果
function addDemoGraphic2(graphicLayer) {
  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: Cesium.Cartesian3.fromDegrees(117.225518, 31.815549, 28.28), // 位置
    style: {
      image: "./img/particle/fire2.png",
      particleSize: 5, // 粒子大小（单位：像素）
      emissionRate: 100, // 发射速率 （单位：次/秒）
      maxHeight: 5000, // 超出该高度后不显示粒子效果

      startColor: new Cesium.Color(1, 1, 1, 1), // 开始颜色
      endColor: new Cesium.Color(0.5, 0, 0, 0), // 结束颜色
      startScale: 3.0, // 开始比例（单位：相对于imageSize大小的倍数）
      endScale: 1.5, // 结束比例（单位：相对于imageSize大小的倍数）
      minimumSpeed: 7.0, // 最小速度（单位：米/秒）
      maximumSpeed: 9.0 // 最大速度（单位：米/秒）
    },
    attr: { remark: "火焰粒子效果" }
  })
  graphicLayer.addGraphic(particleSystem)
}

// 动态运行车辆的尾气粒子效果
function addDemoGraphic3(graphicLayer) {
  const fixedRoute = new mars3d.graphic.FixedRoute({
    speed: 120,
    positions: [
      [117.226585, 31.818437, 32.41],
      [117.226838, 31.811681, 28.23]
    ],
    clockLoop: true, // 是否循环播放
    model: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.2
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  fixedRoute.start() // 启动漫游

  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: fixedRoute.property,
    style: {
      image: "./img/particle/smoke.png",
      particleSize: 12, // 粒子大小（单位：像素）
      emissionRate: 20.0, // 发射速率 （单位：次/秒）
      pitch: 40, // 俯仰角
      // gravity: -1, // 重力因子，会修改速度矢量以改变方向或速度（基于物理的效果）
      // transY: 8.0, // 偏移值Y，尾气在车辆后面一些
      maxHeight: 1000, // 超出该高度后不显示粒子效果

      startColor: Cesium.Color.GREY.withAlpha(0.7), // 开始颜色
      endColor: Cesium.Color.WHITE.withAlpha(0.0), // 结束颜色
      startScale: 1.0, //  开始比例（单位：相对于imageSize大小的倍数）
      endScale: 5.0, // 结束比例（单位：相对于imageSize大小的倍数）
      minimumSpeed: 1.0, // 最小速度(米/秒)
      maximumSpeed: 4.0 // 最大速度(米/秒)
    },
    attr: { remark: "车辆尾气" }
  })
  graphicLayer.addGraphic(particleSystem)
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.ParticleSystem({
      position: position,
      style: {
        image: "./img/particle/fire2.png",
        particleSize: 5, // 粒子大小（单位：像素）
        emissionRate: 200, // 粒子发射器的发射速率 （单位：次/秒）

        startColor: new Cesium.Color(1, 1, 1, 1), // 粒子出生时的颜色
        endColor: new Cesium.Color(0.5, 0, 0, 0), // 当粒子死亡时的颜色
        startScale: 3.0, // 开始比例（单位：相对于imageSize大小的倍数）
        endScale: 1.5, // 结束比例（单位：相对于imageSize大小的倍数）
        minimumSpeed: 7.0, // 最小速度（单位：米/秒）
        maximumSpeed: 9.0 // 最大速度（单位：米/秒）
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "particleSystem",
    style: {
      image: "./img/particle/smoke.png",
      particleSize: 8, // 粒子大小（单位：像素）
      emissionRate: 100.0, // 发射速率 （单位：次/秒）
      heading: 290, // 方向角
      pitch: 40, // 俯仰角
      gravity: -3.5, // 重力因子，会修改速度矢量以改变方向或速度（基于物理的效果）
      transZ: 5, // 离地高度（单位：米）

      startColor: Cesium.Color.LIGHTCYAN.withAlpha(0.3), // 开始颜色
      endColor: Cesium.Color.WHITE.withAlpha(0.0), // 结束颜色
      startScale: 2.0, // 开始比例（单位：相对于imageSize大小的倍数）
      endScale: 4.0, // 结束比例（单位：相对于imageSize大小的倍数）
      minimumParticleLife: 1.0, // 最小寿命时间（秒）
      maximumParticleLife: 3.0 // 最大寿命时间（秒）
    }
  })
}

export function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "particleSystem",
    style: {
      image: "./img/particle/fire2.png",
      particleSize: 5, // 粒子大小（单位：像素）
      emissionRate: 200, //  发射速率 （单位：次/秒）

      startColor: new Cesium.Color(1, 1, 1, 1), // 粒子出生时的颜色
      endColor: new Cesium.Color(0.5, 0, 0, 0), // 当粒子死亡时的颜色
      startScale: 3.0, // 开始比例（单位：相对于imageSize大小的倍数）
      endScale: 1.5, // 结束比例（单位：相对于imageSize大小的倍数）
      minimumParticleLife: 1.5, // 最小寿命时间（秒）
      maximumParticleLife: 1.8, // 最大寿命时间（秒）
      minimumSpeed: 7.0, // 最小速度（单位：米/秒）
      maximumSpeed: 9.0 // 最大速度（单位：米/秒）
    }
  })
}

let particleGraphic
export function getGraphic(graphicId) {
  particleGraphic = graphicLayer.getGraphicById(graphicId)
  return particleGraphic
}

// 修改样式
export function setStylyToGraphic(style) {
  particleGraphic.setStyle(style)
}

// 修改位置
let particlePosition
export function btnSelectPosition() {
  map.graphicLayer.startDraw({
    type: "point",
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      particlePosition = positions[0]
      map.graphicLayer.clear()

      particleGraphic.position = particlePosition
    }
  })
}
