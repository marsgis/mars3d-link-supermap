import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.820398, lng: 116.218603, alt: 6483, heading: 22, pitch: -40 }
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

  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

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

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.ModelEntity({
    name: "飞机",
    position: [116.239918, 30.879709, 1208],
    style: {
      url: "//data.mars3d.cn/gltf/mars/feiji.glb",
      scale: 2
    }
  })
  graphicLayer.addGraphic(graphic)

  // 开始 自旋转效果
  graphic.rotateStart({
    direction: false, // 控制方向, true逆时针，false顺时针
    time: 20 // time：给定飞行一周所需时间(单位 秒)，控制速度
  })

  // setTimeout(() => {
  //   graphic.rotateStop()
  // }, 3000)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.ModelEntity({
    name: "四凌锥体",
    position: [116.257665, 30.869372, 1500],
    style: {
      url: "//data.mars3d.cn/gltf/mars/zhui.glb",
      scale: 200,
      minimumPixelSize: 50
    }
  })
  graphicLayer.addGraphic(graphic)

  // 开始 自旋转效果
  graphic.rotateStart({
    direction: true, // 控制方向, true逆时针，false顺时针
    time: 6 // time：给定飞行一周所需时间(单位 秒)，控制速度
  })
}

function addDemoGraphic3(graphicLayer) {
  const graphicCar = new mars3d.graphic.ModelEntity({
    name: "汽车",
    position: [116.210938, 30.87518, 613.1],
    style: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.5,
      heading: 30,
      minimumPixelSize: 100
    }
  })
  graphicLayer.addGraphic(graphicCar)

  // 移动模型
  graphicCar.moveTo({
    position: [116.259138, 30.855247, 562],
    time: 8 // 移动的时长(单位 秒)
  })
}
