import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

let selectedView
let videoElement

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.843062, lng: 117.205439, alt: 150, heading: 178, pitch: -75 },
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

  createVideoDom()

  // 加一些演示数据
  addDemoGraphic1()
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
        container: videoElement,
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

// 加载已配置好的视频（此参数为界面上“打印参数”按钮获取的）
function addDemoGraphic1() {
  const video3D = new mars3d.graphic.Video3D({
    position: [117.205457, 31.842984, 63.9],
    style: {
      container: videoElement,
      maskImage: "img/textures/video-mask.png", // 羽化视频四周，融合更美观
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: -49.5,
      showFrustum: true
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(video3D)
}

// 添加投射视频
export function startDrawGraphic() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "video3D",
    style: {
      container: videoElement,
      maskImage: "img/textures/video-mask.png", // 羽化视频四周，融合更美观
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: -49.5,
      showFrustum: true
    }
  })
}

// 按当前视角投射视频
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
      container: videoElement,
      maskImage: "img/textures/video-mask.png", // 羽化视频四周，融合更美观
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: -49.5,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video3D)
}

function createVideoDom() {
  videoElement = mars3d.DomUtil.create("video", "", document.body)
  videoElement.setAttribute("muted", "muted")
  videoElement.setAttribute("autoplay", "autoplay")
  videoElement.setAttribute("loop", "loop")
  videoElement.setAttribute("crossorigin", "")
  videoElement.setAttribute("controls", "")
  videoElement.style.display = "none"

  const sourceContainer = mars3d.DomUtil.create("source", "", videoElement)
  sourceContainer.setAttribute("src", "http://data.mars3d.cn/file/video/lukou.mp4")
  sourceContainer.setAttribute("type", "video/mp4")

  hls()
}

// let hlsUrl = "http://ivi.bupt.edu.cn/hls/cctv13.m3u8";
// const hlsUrl = "http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8"
const hlsUrl = "http://1252093142.vod2.myqcloud.com/4704461fvodcq1252093142/f865d8a05285890787810776469/playlist.f3.m3u8"
function hls() {
  // 加HLS演示数据
  if (window.Hls.isSupported()) {
    const hls = new window.Hls()
    hls.loadSource(hlsUrl)
    hls.attachMedia(videoElement)
    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
      videoElement.play()
    })
  } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    videoElement.src = hlsUrl
    videoElement.addEventListener("loadedmetadata", function () {
      videoElement.play()
    })
  }

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

// 透明度
export function onChangeOpacity(value) {
  if (selectedView) {
    selectedView.opacity = value
  }
}

// 播放暂停
export function playOrpause() {
  if (!selectedView) {
    return
  }
  selectedView.play = !selectedView.play
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

// 线框是否显示
export function showFrustum(ckd) {
  if (!selectedView) {
    return
  }
  selectedView.showFrustum = ckd
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
