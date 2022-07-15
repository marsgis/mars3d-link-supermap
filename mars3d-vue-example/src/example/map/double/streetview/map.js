import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tileLayer
let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.676218, lng: 117.251248, alt: 27740, heading: 1, pitch: -63 }
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

  globalNotify("已知问题提示", "(1) 百度街景目前限制使用，需要自行申请全景地图服务使用权限Key替换 ")

  creatDom()
  map.basemap = "腾讯电子"

  // 矢量图层数据
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 叠加的图层
  tileLayer = new mars3d.layer.BaiduLayer({
    layer: "streetview",
    show: false
  })
  map.addLayer(tileLayer)

  splitScreen()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function chooseStree() {
  if (markerStreet) {
    graphicLayer.removeGraphic(markerStreet, true)
    markerStreet = null
  }

  map.off(mars3d.EventType.click, onClickMap)
  tileLayer.show = false

  tileLayer.show = true

  if (typeView !== 0) {
    viewTo3d()
  }

  graphicLayer.startDraw({
    type: "billboard",
    style: {
      image: "img/marker/street.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: {
        font_size: 30,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -50
      }
    },
    success: function (graphic) {
      markerStreet = graphic
    }
  })

  map.on(mars3d.EventType.click, onClickMap)
}

function creatDom() {
  const divDom = mars3d.DomUtil.create("div", "", document.body)
  divDom.setAttribute("id", "centerDivJJ")

  const iframDom = mars3d.DomUtil.create("iframe", "stree", divDom)
  iframDom.setAttribute("id", "streeScape")
  iframDom.setAttribute("src", window.currentPath + "baidu.html?lng=117.215219&lat=31.861592") // currentPath为当前目录，内置在示例框架中
}
let typeView = 0

// 3d显示
export function viewTo3d() {
  typeView = 0
  const dom2d = document.getElementById("centerDivJJ")
  const dom3d = document.getElementById("centerDiv3D")
  dom3d.style.display = "block"
  dom3d.style.width = "100%"
  dom3d.style.left = "0"

  dom2d.style.display = "none"
}

// // 街景显示
export function streetscape() {
  typeView = 1
  const dom2d = document.getElementById("centerDivJJ")
  const dom3d = document.getElementById("centerDiv3D")
  dom3d.style.display = "none"
  dom2d.style.width = "100%"
  dom2d.style.display = "block"
}

// 分屏显示
export function splitScreen() {
  typeView = 2
  const dom2d = document.getElementById("centerDivJJ")
  const dom3d = document.getElementById("centerDiv3D")

  dom2d.style.width = "50%"
  dom3d.style.width = "50%"
  dom3d.style.left = "50%"
  dom2d.style.display = "block"
  dom3d.style.display = "block"
}

function onClickMap(event) {
  const point = mars3d.LngLatPoint.fromCartesian(event.cartesian)

  const rightFrame = document.getElementById("streeScape")
  rightFrame.contentWindow.setPosition(point)

  if (typeView === 0) {
    streetscape()
  }
}

let markerStreet
function updateMarker(position) {
  if (markerStreet) {
    markerStreet.position = position
  } else {
    markerStreet = new mars3d.graphic.BillboardEntity({
      position: position,
      style: {
        image: "img/marker/street.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        clampToGround: true
      }
    })
    graphicLayer.addGraphic(markerStreet)
  }

  map.flyToGraphic(markerStreet, { radius: 800 })
}
