import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 17.372658, lng: 109.327197, alt: 3459173, heading: 12, pitch: -69 },
    fxaa: true
  },
  terrain: false,
  basemaps: [
    {
      name: "蓝色底图",
      icon: "//data.mars3d.cn/file/img/world/blue.jpg",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/blue.jpg",
      show: true
    }
  ],
  layers: []
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 一线以上城市地理位置
  const arrStart = [
    { name: "北京", position: [116.395645038, 39.9299857781] },
    { name: "上海", position: [121.487899486, 31.24916171] },
    { name: "广州", position: [113.307649675, 23.1200491021] },
    { name: "深圳", position: [114.025973657, 22.5460535462] },
    { name: "成都", position: [104.067923463, 30.6799428454] },
    { name: "杭州", position: [120.219375416, 30.2592444615] },
    { name: "重庆", position: [106.530635013, 29.5446061089] },
    { name: "苏州", position: [113.64964385, 34.7566100641] },
    { name: "武汉", position: [114.316200103, 30.5810841269] },
    { name: "南京", position: [118.778074408, 32.0572355018] },
    { name: "天津", position: [117.210813092, 39.1439299033] },
    { name: "郑州", position: [113.64964385, 34.7566100641] },
    { name: "长沙", position: [112.979352788, 28.2134782309] },
    { name: "东莞", position: [113.763433991, 23.0430238154] },
    { name: "佛山", position: [113.134025635, 23.0350948405] },
    { name: "宁波", position: [121.579005973, 29.8852589659] },
    { name: "青岛", position: [120.384428184, 36.1052149013] },
    { name: "沈阳", position: [123.432790922, 41.8086447835] },
    { name: "深圳", position: [114.025973657, 22.5460535462] },
    { name: "乌鲁木齐", position: [87.613307, 43.824787] }
  ]

  //  连接点地理位置
  const arrEnd = [
    { name: "西安", position: [108.953098279, 34.2777998978] },
    { name: "南京", position: [118.778074408, 32.0572355018] },
    { name: "武汉", position: [114.316200103, 30.5810841269] }
  ]

  // 创建矢量数据
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  for (let i = 0; i < arrStart.length; i++) {
    const item = arrStart[i]
    const position = item.position

    // 城市名字
    const graphic = new mars3d.graphic.DivGraphic({
      position: position,
      style: {
        html: `<div class ="textName">${item.name}</div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      }
    })
    graphicLayer.addGraphic(graphic)
  }

  for (let i = 0; i < arrEnd.length; i++) {
    const item = arrEnd[i]
    const endPoint = item.position

    // 城市名字
    const graphic = new mars3d.graphic.DivGraphic({
      position: endPoint,
      style: {
        html: `<div class ="textName">${item.name}</div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      }
    })
    graphicLayer.addGraphic(graphic)

    for (let j = 0; j < arrStart.length; j++) {
      const item = arrStart[j]
      const startPoint = item.position

      // 连线
      const line = new mars3d.graphic.PolylinePrimitive({
        positions: [startPoint, endPoint],
        style: {
          width: 2,
          materialType: mars3d.MaterialType.LineFlow,
          materialOptions: {
            color: "#3af2f3",
            image: "img/textures/line-pulse.png",
            speed: 1
          }
        }
      })
      graphicLayer.addGraphic(line)
    }
  }
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
