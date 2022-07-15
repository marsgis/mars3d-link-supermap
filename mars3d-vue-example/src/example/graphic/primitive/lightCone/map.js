import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 27.375302, lng: 115.43395, alt: 631709, heading: 26, pitch: -49 }
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

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 合肥市
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const lightCone = new mars3d.graphic.LightCone({
    position: Cesium.Cartesian3.fromDegrees(117.29, 32.0581, 117.8),
    style: {
      color: "rgba(255,0,0,0.9)",
      radius: 8000, // 底部半径
      height: 150000 // 椎体高度
    },
    show: true
  })
  graphicLayer.addGraphic(lightCone)

  // 演示个性化处理graphic
  initGraphicManager(lightCone)
}
// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 绑定Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">我是graphic上绑定的Popup </th>
            </tr>
            <tr>
              <td>提示：</td>
              <td>这只是测试信息，可以任意html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  // 绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "删除对象[graphic绑定的]",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])
}

function addDemoGraphic2(graphicLayer) {
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
  for (let i = 0; i < cities.length; i++) {
    const item = cities[i]

    const coneGlow2 = new mars3d.graphic.LightCone({
      position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 0),
      style: {
        radius: 5000,
        height: 80000,
        distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(80000, 3010000),

        // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
        highlight: {
          type: mars3d.EventType.click,
          color: "#ffff00"
        }
      }
      // popup: item.name,
    })
    graphicLayer.addGraphic(coneGlow2)
  }
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

    const graphic = new mars3d.graphic.LightCone({
      position: position,
      style: {
        radius: result.radius * 0.3,
        height: result.radius * 3
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
    type: "lightCone",
    style: {
      radius: 500,
      height: 8000
    }
  })
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
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
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
