import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.760749, lng: 117.247058, alt: 3824, heading: 359, pitch: -33 }
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
  map.basemap = 2017 // 蓝色底图
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    // let attr = event.graphic.attr
    console.log("单击了合并对象中的单个值为", pickedItem)

    // 测试修改model
    // let instance = event.pickedObject
    // let scaleMatrix = Cesium.Matrix4.fromUniformScale(1.1)
    // let modelMatrix = Cesium.Matrix4.multiply(instance.modelMatrix, scaleMatrix, new Cesium.Matrix4())
    // instance.modelMatrix = modelMatrix
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效

  addRandomGraphicByCount(1000)
  graphicLayer.flyTo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  const arrData = []
  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    arrData.push({
      position: position,
      style: {
        heading: 90,
        scale: 5
      },
      attr: {
        index: index,
        time: new Date().toLocaleTimeString()
      }
    })
  }

  const modelCombine = new mars3d.graphic.ModelCombine({
    url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
    instances: arrData
  })
  graphicLayer.addGraphic(modelCombine)

  // 测试定时更新
  // setInterval(() => {
  //   for (let j = 0, len = arrData.length; j < len; ++j) {
  //     const item = arrData[j]

  //     item.position = randomPoint()// 随机坐标
  //     item.attr.time = new Date().toLocaleTimeString()
  //   }
  //   modelCombine.instances = arrData
  // }, 5000)

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
  })
}
