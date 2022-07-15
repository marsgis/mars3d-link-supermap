import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
let pathEntity = null

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 32.550222, lng: 117.366824, alt: 2696, heading: 273, pitch: -67 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true // 是否显示时间线控件
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

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/flypath.json" })
    .then(function (res) {
      initPath(res)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 改变视角  跟踪，上方和侧方
export function viewAircraft() {
  map.trackedEntity = pathEntity.entity

  pathEntity.flyToPoint({
    radius: 500, // 距离目标点的距离
    heading: 40,
    pitch: -50,
    duration: 0.01
  })
}
export function viewTopDown() {
  map.trackedEntity = undefined

  map.flyToPoint(pathEntity.positionShow, {
    radius: 2000,
    heading: -90,
    pitch: -89
  })
}
export function viewSide() {
  map.trackedEntity = undefined

  map.flyToPoint(pathEntity.positionShow, {
    radius: 3000,
    heading: -90,
    pitch: -25
  })
}

function initPath(data) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  let start
  let stop
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    const lng = Number(item.x.toFixed(6)) // 经度
    const lat = Number(item.y.toFixed(6)) // 纬度
    const height = item.z // 高度
    const time = item.time // 时间

    let position = null
    if (lng && lat) {
      position = Cesium.Cartesian3.fromDegrees(lng, lat, height)
    }
    let juliaDate = null
    if (time) {
      juliaDate = Cesium.JulianDate.fromIso8601(time)
    }
    if (position && juliaDate) {
      property.addSample(juliaDate, position)
    }

    if (i === 0) {
      start = juliaDate
    } else if (i === len - 1) {
      stop = juliaDate
    }

    const graphic = new mars3d.graphic.PointPrimitive({
      position: position,
      style: {
        pixelSize: 4,
        color: "#cccccc"
      },
      popup: "编号:" + item.id + "<br/>时间:" + time
    })
    graphicLayer.addGraphic(graphic)
  }

  // 设置时钟属性
  map.clock.startTime = start.clone()
  map.clock.stopTime = stop.clone()
  map.clock.currentTime = start.clone()
  map.clock.clockRange = Cesium.ClockRange.LOOP_STOP
  map.clock.multiplier = 5

  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(start, stop)
  }

  // 创建path对象
  pathEntity = new mars3d.graphic.PathEntity({
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      resolution: 1,
      leadTime: 0,
      trailTime: 3600,
      color: "#ff0000",
      width: 3
    },
    label: {
      text: "飞机1号",
      font_size: 19,
      font_family: "楷体",
      color: Cesium.Color.AZURE,
      outline: true,
      visibleDepth: false,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(10, -25) // 偏移量
    },
    // billboard: {
    //   image: "img/marker/lace-blue.png",
    //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //   visibleDepth: false
    // },
    model: {
      url: "//data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 0.1,
      minimumPixelSize: 20
    },
    popup: "飞行1号"
  })
  graphicLayer.addGraphic(pathEntity)

  // 圆锥追踪体
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: property,
    style: {
      length: 100,
      angle: 12, // 半场角度
      color: "#ff0000",
      opacity: 0.5
    }
  })
  graphicLayer.addGraphic(coneTrack)
}
