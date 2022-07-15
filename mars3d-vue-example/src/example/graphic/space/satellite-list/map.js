import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    shadows: true,
    center: { lat: 12.845055, lng: 112.931363, alt: 24286797, heading: 3, pitch: -90 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1000,
      maximumZoomDistance: 300000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    },
    globe: { enableLighting: true },
    clock: {
      multiplier: 1 // 速度
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
  },
  layers: [
    {
      name: "夜晚图片",
      icon: "img/basemaps/blackMarble.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/night2.jpg",
      dayAlpha: 0.1,
      nightAlpha: 1.0,
      brightness: 3.5,
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map  map.toolbar.style.bottom = "55px"// 修改toolbar控件的样式

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了卫星", event)
    // 单击事件
    highlightSatellite(event.graphic)
  })
  graphicLayer.on(mars3d.EventType.change, function (event) {
    // 位置变化事件
    processInArea(event.graphic)
  })

  bindLayerPopup()

  creatreDmzList()

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tle-china.json" })
    .then(function (data) {
      createSatelliteList(data.data)
    })
    .catch(function () {
      globalMsg("获取卫星信息异常！")
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 创建卫星列表
function createSatelliteList(arr) {
  // 单击地图空白处
  map.on(mars3d.EventType.clickMap, function (event) {
    highlightSatellite()
  })

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    // 属性处理
    item.model = {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      ...(item.model || {}),
      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 0,
      distanceDisplayCondition_far: 20000000,
      show: true
    }
    // 当视角距离超过20000000米(distanceDisplayCondition_far定义的) 后显示为点对象的样式
    item.point = {
      show: true,
      color: "#ffff00",
      pixelSize: 5,
      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 20000000,
      distanceDisplayCondition_far: Number.MAX_VALUE
    }

    item.label = item.label || {}
    item.label.show = true

    // path显示后FPS下降的厉害
    item.path = item.path || {}
    item.path.color = Cesium.defaultValue(item.path.color, "#e2e2e2")
    item.path.closure = Cesium.defaultValue(item.path.closure, true)

    item.cone = {
      sensorType: i % 2 === 1 ? mars3d.graphic.SatelliteSensor.Type.Rect : mars3d.graphic.SatelliteSensor.Type.Conic,
      angle1: random(20, 40),
      angle2: random(10, 20),
      color: "rgba(0,255,255,0.5)",
      show: false
    }
    // 属性处理  END

    const satelliteObj = new mars3d.graphic.Satellite(item)
    graphicLayer.addGraphic(satelliteObj)
  }
  console.log("当前卫星数量: " + arr.length)
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.options
    return `名称：${attr.name}<br/>英文名：${attr.name_en || ""}<br/>类型：${attr.type}`
  })
}

let lastSelectWX

function highlightSatellite(satelliteObj) {
  if (lastSelectWX) {
    // 重置上次选中的轨道样式
    lastSelectWX.setOptions({
      path: {
        color: "#e2e2e2",
        opacity: 0.5,
        width: 1
      }
    })
    lastSelectWX.coneShow = false // 关闭视锥体
    lastSelectWX = null
  }

  if (satelliteObj) {
    // 高亮选中的轨道样式
    satelliteObj.setOptions({
      path: {
        color: "#ffff00",
        opacity: 1,
        width: 2
      }
    })
    satelliteObj.coneShow = true // 打开视锥体
    lastSelectWX = satelliteObj
  }
}

// 判断卫星是否在面内
function processInArea(weixin) {
  const position = weixin?.position
  if (!position) {
    return
  }

  dmzLayer.eachGraphic(function (dmzGraphic) {
    if (!dmzGraphic._isFW) {
      return
    }

    dmzGraphic._lastInPoly[weixin.id] = dmzGraphic._lastInPoly[weixin.id] || {}
    const lastState = dmzGraphic._lastInPoly[weixin.id]

    const thisIsInPoly = dmzGraphic.isInPoly(position)
    if (thisIsInPoly !== lastState.state) {
      if (thisIsInPoly) {
        // 开始进入区域内
        console.log(`${weixin.name} 卫星开始进入 ${dmzGraphic.name} 地面站区域内`)

        const line = new mars3d.graphic.PolylineEntity({
          positions: new Cesium.CallbackProperty(function (time) {
            const pots = weixin.position
            if (!pots) {
              return []
            }
            return [pots, dmzGraphic.positionShow]
          }, false),
          style: {
            width: 7,
            // 动画线材质
            materialType: mars3d.MaterialType.LineFlow,
            materialOptions: {
              url: "./img/textures/arrow-h.png",
              color: Cesium.Color.AQUA,
              repeat: new Cesium.Cartesian2(15, 1),
              speed: 60 // 时长，控制速度
            },
            arcType: Cesium.ArcType.NONE
          }
        })
        map.graphicLayer.addGraphic(line)
        lastState.line = line

        weixin.coneShow = true // 打开视锥体
      } else {
        // 离开区域
        console.log(`${weixin.name} 卫星离开 ${dmzGraphic.name} 地面站区域内`)

        if (lastState.line) {
          map.graphicLayer.removeGraphic(lastState.line)
          delete lastState.line
        }
        weixin.coneShow = false // 关闭视锥体
      }

      dmzGraphic._lastInPoly[weixin.id].state = thisIsInPoly
    }
  })
}

// 取随机数字
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 地面站图层
let dmzLayer
// 创建地面站
function creatreDmzList() {
  const arr = [
    { name: "西安", radius: 1500000, point: [108.938314, 34.345614, 342.9] },
    { name: "喀什", radius: 1800000, point: [75.990372, 39.463507, 1249.5] },
    { name: "文昌", radius: 1200000, point: [110.755151, 19.606573, 21.1] }
  ]

  // 创建矢量数据图层
  dmzLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(dmzLayer)

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    // 地面站gltf模型
    const graphic = new mars3d.graphic.ModelEntity({
      name: "地面站模型",
      position: item.point,
      style: {
        url: "//data.mars3d.cn/gltf/mars/leida.glb",
        heading: 270,
        scale: 30,
        minimumPixelSize: 40
      },
      popup: item.name
    })
    dmzLayer.addGraphic(graphic)

    const dmfwGraphic = new mars3d.graphic.CircleEntity({
      name: item.name,
      position: item.point,
      style: {
        radius: item.radius,
        color: "#ff0000",
        opacity: 0.3
      },
      popup: item.name
    })
    dmzLayer.addGraphic(dmfwGraphic)

    // 判断时会用到的变量
    dmfwGraphic._isFW = true
    dmfwGraphic._lastInPoly = {}
  }
}
