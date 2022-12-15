import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

let videoElement
let videoGraphic

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 28.441852, lng: 119.481567, alt: 241, heading: 174, pitch: -35 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "县城社区",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 11.5 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true
  })
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  createVideoDom()

  // 加一些演示数据
  addDemoGraphic1()
  addDemoGraphic2()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function createVideoDom() {
  //   <video id="trailer" muted="" autoplay="" loop="" crossorigin="" controls="">
  //   <source src="https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.webm" type="video/webm">
  //   <source src="https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mp4" type="video/mp4">
  //   <source src="https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mov" type="video/quicktime">
  //   Your browser does not support the <code>video</code> element.
  // </video>

  videoElement = mars3d.DomUtil.create("video", "", document.body)
  videoElement.setAttribute("muted", "muted")
  videoElement.setAttribute("autoplay", "autoplay")
  videoElement.setAttribute("loop", "loop")
  videoElement.setAttribute("crossorigin", "")
  videoElement.setAttribute("controls", "")
  videoElement.style.display = "none"

  // const mp4Source = mars3d.DomUtil.create("source", "", videoElement)
  // mp4Source.setAttribute("src", "//data.mars3d.cn/file/video/lukou.mp4")
  // mp4Source.setAttribute("type", "video/mp4")

  const webmSource = mars3d.DomUtil.create("source", "", videoElement)
  webmSource.setAttribute("src", "https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.webm")
  webmSource.setAttribute("type", "video/webm")

  const mp4Source = mars3d.DomUtil.create("source", "", videoElement)
  mp4Source.setAttribute("src", "https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mp4")
  mp4Source.setAttribute("type", "video/mp4")

  const quicktimeSource = mars3d.DomUtil.create("source", "", videoElement)
  quicktimeSource.setAttribute("src", "https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mov")
  quicktimeSource.setAttribute("type", "video/quicktime")

  // 可以使视频元素与Cesium的模拟时钟同步
  const synchronizer = new Cesium.VideoSynchronizer({
    clock: map.clock,
    element: videoElement
  })
  map.clock.shouldAnimate = true

  setTimeout(() => {
    try {
      if (videoElement.paused) {
        globalMsg("当前浏览器已限制自动播放，请单击播放按钮")
        videoElement.play()
      }
    } catch (e) {
      // 规避浏览器权限异常
      globalMsg("当前浏览器已限制自动播放，请单击播放按钮")
    }
  }, 3000)
}

export function getGraphic(graphicId) {
  videoGraphic = graphicLayer.getGraphicById(graphicId)
  return videoGraphic
}

// 竖立视频
function addDemoGraphic1() {
  const graphic = new mars3d.graphic.PolygonEntity({
    positions: [
      [119.481299, 28.439988, 140],
      [119.481162, 28.440102, 140],
      [119.481163, 28.440101, 130],
      [119.481296, 28.439986, 130]
    ],
    styleType: "video", // 属性编辑框使用
    style: {
      material: videoElement
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)
}

// 地面视频
function addDemoGraphic2() {
  const graphic = new mars3d.graphic.PolygonEntity({
    positions: [
      [119.481749, 28.440171, 130],
      [119.481385, 28.440457, 130],
      [119.481911, 28.44094, 130],
      [119.482254, 28.440653, 130]
    ],
    styleType: "video", // 属性编辑框使用
    style: {
      material: videoElement,
      stRotationDegree: 90 // 视频旋转角度
      // clampToGround: true
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)
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

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 0, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 72, result.radius)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 144, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 216, result.radius)

    const graphic = new mars3d.graphic.PolygonEntity({
      positions: [pt1, pt2, pt3, pt4],
      styleType: "video", // 属性编辑框使用
      style: {
        material: videoElement,
        stRotationDegree: 130, // 视频旋转角度
        clampToGround: true
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "rectangle",
    styleType: "video", // 属性编辑框使用
    style: {
      material: videoElement,
      clampToGround: true
    }
  })
}

export function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "wall",
    maxPointNum: 2,
    styleType: "video", // 属性编辑框使用
    style: {
      diffHeight: 5,
      material: videoElement
    }
  })
}

// 播放暂停
export function videoPlay() {
  if (!map.clock.shouldAnimate) {
    map.clock.shouldAnimate = true
  }
}
export function videoStop() {
  if (map.clock.shouldAnimate) {
    map.clock.shouldAnimate = false
  }
}

/**
 * 方向改变
 *
 * @export
 * @param {number} value  范围在0-360°
 * @returns {void}
 */
export function angleChange(value) {
  videoGraphic?.setStyle({
    rotationDegree: value
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
