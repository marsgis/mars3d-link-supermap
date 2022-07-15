import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

let selectedView

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.844146, lng: 117.20555, alt: 125, heading: 184, pitch: -17 }
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
  addModel()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addModel() {
  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥国家大学科技园",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: -24 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 2.在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    selectedView = event.graphic
    console.log("监听layer，单击了矢量对象", event)
  })

  // 可在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  graphicLayer.bindPopup("我是layer上绑定的Popup")

  // 可在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效
  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphicLayer.removeGraphic(graphic)
        }
      }
    }
  ])

  // 加一些演示数据
  addDemoGraphic1()
}

// 加载已配置好的视频（此参数为界面上“打印参数”按钮获取的）
function addDemoGraphic1() {
  const video2D = new mars3d.graphic.Video2D({
    position: [117.205459, 31.842988, 64.3],
    style: {
      url: "//data.mars3d.cn/file/video/duimian.mp4",
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)
}

export function getGraphic(graphicId) {
  selectedView = graphicLayer.getGraphicById(graphicId)
  return selectedView
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

    const graphic = new mars3d.graphic.Video2D({
      position: position,
      style: {
        url: "//data.mars3d.cn/file/video/duimian.mp4",
        angle: 46.3,
        angle2: 15.5,
        heading: 178.5,
        pitch: 8.2,
        distance: 1178,
        showFrustum: true
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 投射视频
export function startDrawGraphic() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "video2D",
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
}

// 按当前相机投射视频
export function startDrawGraphic2() {
  // 取屏幕中心点
  const targetPosition = map.getCenter({ format: false })
  if (!targetPosition) {
    return
  }

  const cameraPosition = Cesium.clone(map.camera.position)

  const fov = Cesium.Math.toDegrees(map.camera.frustum.fov) / 2 // 相机水平张角
  const aspectRatio = map.scene.canvas.clientWidth / map.scene.canvas.clientHeight // 获取canvas宽高

  // 构造投射体
  const video2D = new mars3d.graphic.Video2D({
    position: cameraPosition,
    targetPosition: targetPosition,
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)

  selectedView = video2D // 记录下
}

// 播放暂停
export function playOrpause() {
  selectedView.play = !selectedView.play
}

// 修改水平角度
export function onChangeAngle(value) {
  if (selectedView) {
    selectedView.angle = value
  }
}

// 修改垂直角度
export function onChangeAngle2(value) {
  if (selectedView) {
    selectedView.angle2 = value
  }
}

// 修改投射距离
export function onChangeDistance(value) {
  if (selectedView) {
    selectedView.distance = value
  }
}

// 修改四周距离 value 修改后的数值
export function onChangeHeading(value) {
  if (selectedView) {
    selectedView.heading = value
  }
}

//  修改俯仰角数值   value 修改后的数值
export function onChangePitch(value) {
  if (selectedView) {
    selectedView.pitch = value
  }
}

//   线框是否显示   isCheckde 修改后的数值
export function showFrustum(isCheckde) {
  if (selectedView) {
    selectedView.showFrustum = isCheckde
  }
}

// 修改视频的透明度   opacity 透明度数值
export function onChangeOpacity(opacity) {
  if (selectedView) {
    selectedView.opacity = opacity
  }
}

/**
 * 视频角度
 *
 * @param {number} num 0-360°
 * @returns {void}
 */
export function rotateDeg(num) {
  if (selectedView) {
    selectedView.setStyle({ stRotationDegree: num })
  }
}

// 视角定位
export function locate() {
  if (selectedView) {
    selectedView.setView()
  }
}

// 打印参数
export function printParameters() {
  if (selectedView) {
    const params = selectedView.toJSON()
    console.log(JSON.stringify(params))
  }
}

// 视频位置
export function selCamera() {
  if (!selectedView) {
    return
  }

  map.graphicLayer.startDraw({
    type: "point",
    success: (graphic) => {
      const point = graphic.point
      graphic.remove() // 删除绘制的点

      selectedView.position = point
    }
  })
}

// 四周视角选点
export function onClickSelView() {
  if (!selectedView) {
    return
  }

  map.graphicLayer.startDraw({
    type: "point",
    success: (graphic) => {
      const point = graphic.point
      graphic.remove() // 删除绘制的点

      selectedView.targetPosition = point
    }
  })
}
