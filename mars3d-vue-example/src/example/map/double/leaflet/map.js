import * as mars3d from "mars3d"

let map3d
let map2d

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map3d = mapInstance // 记录map
  map3d.camera.percentageChanged = 0.001

  globalNotify("已知问题提示", `三维事件目前监听不灵敏，视角同步不够平滑。 `)

  creatMap2D()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  unbind3dEvent()
  unbind2dEvent()

  map3d = null

  map2d.destroy()
  map2d = null
}

function creatMap2D() {
  showLoading()

  const mapDiv = mars3d.DomUtil.create("div", "", document.body)
  mapDiv.setAttribute("id", "centerDiv2D")

  const map2dDiv = mars3d.DomUtil.create("div", "", mapDiv)
  map2dDiv.setAttribute("id", "map2d")
  map2dDiv.setAttribute("class", "mars2d-container")

  const configUrl = "http://mars2d.cn/config/config.json"
  mars2d.Util.fetchJson({ url: configUrl })
    .then(function (data) {
      // 构建地图
      map2d = new mars2d.Map("map2d", data.mars2d)
      bind2dEvent(map2d)
      bind3dEvent()

      _map2d_extentChangeHandler()

      viewTo23D() // 默认

      hideLoading()
    })
    .catch(function (error) {
      hideLoading()

      console.log("构建地图错误", error)
      globalMsg(error && error.message, "error")
    })
}

// 二维地图变化事件
function bind2dEvent() {
  map2d.on("drag", _map2d_extentChangeHandler, this)
  map2d.on("zoomend", _map2d_extentChangeHandler, this)
}

function unbind2dEvent() {
  map2d.off("drag", _map2d_extentChangeHandler, this)
  map2d.off("zoomend", _map2d_extentChangeHandler, this)
}

function _map2d_extentChangeHandler(e) {
  const bounds = map2d.getBounds()
  const extent = {
    xmin: bounds.getWest(),
    xmax: bounds.getEast(),
    ymin: bounds.getSouth(),
    ymax: bounds.getNorth()
  }
  console.log(`二维地图变化了，区域： ${JSON.stringify(extent)} `)

  unbind3dEvent()
  map3d.camera.setView({
    destination: Cesium.Rectangle.fromDegrees(extent.xmin, extent.ymin, extent.xmax, extent.ymax)
  })

  bind3dEvent()
}

// 三维地图相机移动结束事件
function bind3dEvent() {
  map3d.on(mars3d.EventType.cameraChanged, camera_moveEndHandler, this)
}

function unbind3dEvent() {
  map3d.off(mars3d.EventType.cameraChanged, camera_moveEndHandler, this)
}

function camera_moveEndHandler(e) {
  const point = map3d.getCenter() // 范围对象
  const level = map3d.level
  console.log(`'三维地图变化了，位置： ${point.toString()},层级 ${level} `)

  unbind2dEvent()

  map2d.setView([point.lat, point.lng], level, { animate: false })

  bind2dEvent()
}

export function viewTo3d() {
  const to3dDom = document.getElementById("centerDiv3D")
  const to2dDom = document.getElementById("centerDiv2D")
  to2dDom.style.display = "none"
  to3dDom.style.display = "block"
  to3dDom.style.left = "0"
  to3dDom.style.width = "100%"
}

export function viewTo2d() {
  const to3dDom = document.getElementById("centerDiv3D")
  const to2dDom = document.getElementById("centerDiv2D")
  to3dDom.style.display = "none"
  to2dDom.style.display = "block"
  to2dDom.style.width = "100%"

  if (map2d) {
    map2d.invalidateSize(false)
  }
}

export function viewTo23D() {
  const to3dDom = document.getElementById("centerDiv3D")
  const to2dDom = document.getElementById("centerDiv2D")
  to3dDom.style.width = "50%"
  to2dDom.style.width = "50%"
  to3dDom.style.left = "50%"
  to3dDom.style.display = "block"
  to2dDom.style.display = "block"

  if (map2d) {
    map2d.invalidateSize(false)
  }
}
