import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 27.390195, lng: 117.386057, alt: 550488, heading: 0, pitch: -49 }
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

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const center = Cesium.Cartesian3.fromDegrees(117.257436, 31.838742, 1)

  const graphic = new mars3d.graphic.CircleEntity({
    name: "合肥市",
    position: center,
    style: {
      radius: 50000.0,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#ff0000",
        count: 1, // 单个圆圈
        speed: 20
      }
    }
  })
  graphicLayer.addGraphic(graphic)

  const cities = [
    { name: "六安市", lon: 116.3123, lat: 31.8329 },
    { name: "安庆市", lon: 116.7517, lat: 30.5255 },
    { name: "滁州市", lon: 118.1909, lat: 32.536 },
    { name: "宣城市", lon: 118.8062, lat: 30.6244 },
    { name: "阜阳市", lon: 115.7629, lat: 32.9919 },
    { name: "宿州市", lon: 117.5208, lat: 33.6841 },
    { name: "黄山市", lon: 118.0481, lat: 29.9542 },
    { name: "巢湖市", lon: 117.7734, lat: 31.4978 },
    { name: "亳州市", lon: 116.1914, lat: 33.4698 },
    { name: "池州市", lon: 117.3889, lat: 30.2014 },
    { name: "蚌埠市", lon: 117.4109, lat: 33.1073 },
    { name: "芜湖市", lon: 118.3557, lat: 31.0858 },
    { name: "淮北市", lon: 116.6968, lat: 33.6896 },
    { name: "淮南市", lon: 116.7847, lat: 32.7722 },
    { name: "马鞍山市", lon: 118.6304, lat: 31.5363 },
    { name: "铜陵市", lon: 117.9382, lat: 30.9375 }
  ]

  const lineMaterial = mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
    image: "img/textures/line-color-yellow.png",
    color: new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 1),
    speed: 10
  })
  for (let i = 0; i < cities.length; i++) {
    const item = cities[i]
    const thisPoint = Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 1)
    const positions = mars3d.PolyUtil.getLinkedPointList(center, thisPoint, 40000, 100) // 计算曲线点
    const graphic = new mars3d.graphic.PolylinePrimitive({
      positions: positions,
      style: {
        width: 2,
        material: lineMaterial // 动画线材质
      }
    })
    graphic.bindPopup(`合肥 - ${item.name}`)
    graphicLayer.addGraphic(graphic)
  }
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

/**
 * 改变迁移的速度
 *
 * @param {number} val 滑动条的数值
 * @returns {void} 无
 * @example
 * 更新material
 * graphic.setStyle({
 *   material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
 *     image: "img/textures/line-color-yellow.png",
 *     color: new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 1),
 *     speed: speed,
 *   }),
 * });
 */
export function changeSlide(val) {
  if (!val) {
    return
  }

  graphicLayer.eachGraphic((graphic) => {
    if (graphic instanceof mars3d.graphic.PolylinePrimitive) {
      graphic.uniforms.speed = val // 只更新速度（平滑过度）
    } else {
      // graphic.setStyle({})
    }
  })
}
