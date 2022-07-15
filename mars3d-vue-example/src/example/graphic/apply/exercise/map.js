import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.178797, lng: 118.183551, alt: 210053, heading: 353, pitch: -49 },
    clock: {
      startTime: "2017/08/25 08:00:00",
      stopTime: "2017/08/25 08:01:30"
    }
  },
  control: {
    animation: true, // 是否创建 动画小器件，左下角仪表
    timeline: true // 是否显示 时间线控件
  }
}

export const eventTarget = new mars3d.BaseClass()

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

  // 静态数据
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/exercise-fixed.json" }).then(function (json) {
    graphicLayer.loadGeoJSON(json)
  })

  // 动态数据
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/exercise-dynamic.json" }).then(function (arrData) {
    for (let i = 0; i < arrData.length; i++) {
      const data = arrData[i]

      // 动态坐标属性
      const property = new Cesium.SampledPositionProperty()
      data.path.forEach((item, index) => {
        const startTime = item.time
        let tempTime = Cesium.JulianDate.fromDate(new Date(startTime))
        tempTime = Cesium.JulianDate.addSeconds(tempTime, 0, new Cesium.JulianDate())
        property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(...item.position))
      })

      switch (data.type) {
        case "plane":
          addPlane(property, data.team)
          break
        case "arrow":
          addAttackArrow(property, data.team)
          break
        case "missile":
          addMissile(property, data.team)
          break
        case "fire":
          addFire(property)
          break
        default:
          break
      }
    }
  })

  addWallPrimitive(
    [
      [118.67566, 32.349367],
      [119.291568, 31.835385],
      [118.374952, 31.373451]
    ],
    "#4755C9"
  )

  addWallPrimitive(
    [
      [116.44771, 31.324743],
      [116.553874, 32.231496],
      [117.649474, 32.017338]
    ],
    "#FF0004"
  )

  setMapView(22, () => {
    map.setCameraView({ lat: 31.252058, lng: 117.988745, alt: 95026, heading: 340, pitch: -49 })
  })
  setMapView(55, () => {
    globalMsg("红方获得胜利")
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addWallPrimitive(positions, color) {
  const Square = new mars3d.graphic.WallPrimitive({
    positions: mars3d.graphic.GatheringPlace.getOutlinePositions(positions),
    style: {
      diffHeight: 5000,
      closure: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/fence.png",
        color: color,
        speed: 10, // 速度，建议取值范围1-100
        axisY: true
      }
    }
  })
  graphicLayer.addGraphic(Square)
}

// 【动态】飞机飞行路线
function addPlane(property, team) {
  const feijiPath = new mars3d.graphic.PathEntity({
    position: property,
    style: {
      width: 6,
      leadTime: 0, // 前方的路线不显示
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: getTeamColor(team),
        repeat: new Cesium.Cartesian2(2.0, 1.0),
        image: "img/textures/line-gradual.png",
        speed: 15
      }
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.001,
      minimumPixelSize: 100,
      show: true,
      clampAnimations: true,
      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 0,
      distanceDisplayCondition_far: 900000
    },
    billboard: {
      show: false,
      image: "img/icon/plane_blue.png",
      color: getTeamColor(team),
      scale: 0.2,
      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 90000,
      distanceDisplayCondition_far: Number.MAX_VALUE
    }
  })
  graphicLayer.addGraphic(feijiPath)
}

// 【动态】进攻箭头标号
function addAttackArrow(property, team) {
  // property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;

  const times = [].concat(property._property._times)
  const positions = [property.getValue(times.shift())]
  const graphicTriangle = new mars3d.graphic.AttackArrowPW({
    positions: new Cesium.CallbackProperty(function (time) {
      for (let index = 0, len = times.length; index < len; index++) {
        const item = times[index]
        if (item.secondsOfDay === Math.round(time.secondsOfDay)) {
          if (property.getValue(time)) {
            positions.push(property.getValue(time))
            times.shift()
            break
          }
        }
      }

      const point = property.getValue(time)
      if (point) {
        return positions.concat(point)
      } else {
        return positions
      }
    }, false),
    style: {
      color: getTeamColor(team),
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff"
      // clampToGround: true,
    }
  })
  graphicLayer.addGraphic(graphicTriangle)
}

// 【动态】导弹飞行路线
function addMissile(property, team) {
  let missileImage
  if (team === "red") {
    missileImage = "img/icon/missile_red.png"
  } else {
    missileImage = "img/icon/missile_blue.png"
  }

  const graphic = new mars3d.graphic.BillboardEntity({
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      image: missileImage,
      scale: 0.5,
      alignedAxis: new Cesium.VelocityVectorProperty(property, true)
    },
    hasEdit: false
  })
  graphicLayer.addGraphic(graphic)
}

// 【动态】导弹爆炸之后的滞留
function addFire(property) {
  const fireImage = new mars3d.graphic.BillboardEntity({
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      image: "img/icon/fire.png",
      scale: 1.0,
      alignedAxis: new Cesium.VelocityVectorProperty(property, true)
    },
    hasEdit: false
  })
  graphicLayer.addGraphic(fireImage)
}

function getTeamColor(team) {
  if (team === "red") {
    return "#FF0000"
  } else {
    return "#0099FF"
  }
}

let num
function setMapView(time, callback) {
  map.on(mars3d.EventType.clockTick, function (event) {
    if (new Date(event.currentTime).getMinutes() === 0 && new Date(event.currentTime).getSeconds() === time) {
      clearTimeout(num)
      num = setTimeout(() => {
        callback()
      }, 2000)
    }
  })
}
