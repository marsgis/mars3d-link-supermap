import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

let selectedView

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.843175, lng: 117.205295, alt: 223, heading: 178, pitch: -75 },
    globe: {
      depthTestAgainstTerrain: true // 不加无法投射到地形上
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
  map = mapInstance // 记录首次创建的map

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

  // 加一些演示数据
  addDemoGraphic1()
  addDemoGraphic2()

  globalNotify("操作提示：", `请鼠标单击地图任意处，浏览器安全机制需要鼠标操作才能自动开始播放视频。`)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
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

    const graphic = new mars3d.graphic.Video3D({
      position: position,
      style: {
        url: "//data.mars3d.cn/file/video/menqian.mp4",
        maskImage: "img/textures/video-mask.png", // 羽化视频四周，融合更美观
        angle: 46.3,
        angle2: 15.5,
        heading: 178.5,
        pitch: -49.5,
        showFrustum: true
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

export function startDrawGraphic() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "video3D",
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      maskImage: "img/textures/video-mask.png", // 羽化视频四周，融合更美观
      angle: 33.3,
      angle2: 23.4,
      heading: 140.7,
      pitch: -82.1
    }
  })
}

export function startDrawGraphic2() {
  // 取屏幕中心点
  const targetPosition = map.getCenter({ format: false })
  if (!targetPosition) {
    return
  }

  const cameraPosition = Cesium.clone(map.camera.position)

  // 构造投射体
  const video3D = new mars3d.graphic.Video3D({
    position: cameraPosition,
    targetPosition: targetPosition,
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      maskImage: "img/textures/video-mask.png", // 羽化视频四周，融合更美观
      angle: 33.3,
      angle2: 23.4,
      heading: 140.7,
      pitch: -82.1
    }
  })
  graphicLayer.addGraphic(video3D)
}

// 加载已配置好的视频（此参数为界面上“打印参数”按钮获取的）
function addDemoGraphic1() {
  const video3D = new mars3d.graphic.Video3D({
    position: [117.204472, 31.842488, 120.9],
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      maskImage: "img/textures/video-mask.png", // 羽化视频四周，融合更美观
      angle: 33.3,
      angle2: 23.4,
      heading: 140.7,
      pitch: -82.1
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(video3D)
}

function addDemoGraphic2() {
  const video3D = new mars3d.graphic.Video3D({
    position: [117.205457, 31.842984, 63.9],
    style: {
      url: "//data.mars3d.cn/file/video/menqian.mp4",
      maskImage: "img/textures/video-mask.png", // 羽化视频四周，融合更美观
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: -49.5,
      showFrustum: true
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(video3D)
}

export function onChangeAngle(value) {
  if (selectedView) {
    selectedView.angle = value
  }
}

export function onChangeAngle2(value) {
  if (selectedView) {
    selectedView.angle2 = value
  }
}

export function onChangeDistance(value) {
  if (selectedView) {
    selectedView.distance = value
  }
}

export function onChangeHeading(value) {
  if (selectedView) {
    selectedView.heading = value
  }
}

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

export function onChangePitch(value) {
  if (selectedView) {
    selectedView.pitch = value
  }
}

// 线框是否显示
export function showFrustum(ckd) {
  if (selectedView) {
    selectedView.showFrustum = ckd
  }
}

export function onChangeOpacity(value) {
  if (selectedView) {
    selectedView.opacity = value
  }
}

// 播放暂停
export function playOrpause() {
  if (selectedView) {
    selectedView.play = !selectedView.play
  }
}

// 定位至视频位置
export function locate() {
  if (selectedView) {
    selectedView.setView()
  }
}

// 打印参数
export function printParameters() {
  if (!selectedView) {
    return
  }

  const params = JSON.stringify(selectedView.toJSON())
  console.log("Video3D构造参数为", params)
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

export function draWall() {
  map.graphicLayer.startDraw({
    type: "wall",
    style: {
      color: "#ffffff",
      opacity: 0.8,
      diffHeight: 300,
      hasShadows: true,
      shadows: Cesium.ShadowMode.DISABLED
    }
  })
}
