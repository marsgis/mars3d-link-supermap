import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 33.588603, lng: 119.03174, alt: 406, heading: 3, pitch: -44 }
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

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "文庙",
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 80.6 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  const arrModel = []
  // 加一些演示数据
  for (let i = 0; i < 20; i++) {
    const graphic = new mars3d.graphic.ModelPrimitive({
      style: {
        url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
        scale: 0.1,
        minimumPixelSize: 10,

        // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
        highlight: {
          type: mars3d.EventType.click,
          silhouette: true,
          silhouetteColor: "#ff0000",
          silhouetteSize: 4
        },

        label: {
          // 不需要文字时，去掉label配置即可
          text: "皖A000" + i,
          font_size: 16,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -20,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 50000,
          distanceDisplayCondition_near: 0,
          visibleDepth: false
        }
      },
      attr: { index: i, name: "ModelPrimitive" },

      clampToTileset: true, // 贴模型，但效率不高，车多就卡
      frameRateHeight: 30 // 控制贴模型的效率，多少帧计算一次
      // objectsToExclude: [] // 排除的不进行贴模型计算的模型对象
    })
    graphicLayer.addGraphic(graphic)

    arrModel.push(graphic.czmObject)
  }

  // 排除的不进行贴模型计算的模型对象
  graphicLayer.eachGraphic((graphic) => {
    graphic.objectsToExclude = arrModel
  })

  // 设置动态位置
  graphicLayer.eachGraphic((graphic) => {
    graphic.addDynamicPosition(randomPoint()) // 首次出现的位置
  })
  graphicLayer.eachGraphic((graphic) => {
    graphic.addDynamicPosition(randomPoint(), 30) // 按30秒运动至指定位置
  })

  // 定时更新动态位置（setInterval为演示）
  setInterval(() => {
    graphicLayer.eachGraphic((graphic) => {
      graphic.addDynamicPosition(randomPoint(), 30)
    })
  }, 30000)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

// 取区域内的随机点
function randomPoint() {
  const jd = random(119.028631 * 1000, 119.034843 * 1000) / 1000
  const wd = random(33.589624 * 1000, 33.594783 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd, 0)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
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



// 绑定右键菜单
export function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}


