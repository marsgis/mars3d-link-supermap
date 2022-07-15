import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let sightline

let positionSXT
let positionDM
let positionJD // 与地面的交点

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.841574, lng: 116.18792, alt: 6828, heading: 215, pitch: -28 }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  creatTestData()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 创建测试数据
function creatTestData() {
  sightline = new mars3d.thing.Sightline()
  map.addThing(sightline)

  sightline.on(mars3d.EventType.end, function (e) {
    positionJD = e.position
  })

  // 测试数据
  positionSXT = Cesium.Cartesian3.fromDegrees(116.144485, 30.744249, 1060)

  const graphicSXT = new mars3d.graphic.PointEntity({
    position: positionSXT,
    style: {
      color: "#ffff00",
      pixelSize: 8,
      label: {
        text: "摄像头",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    }
  })
  map.graphicLayer.addGraphic(graphicSXT)

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 地面点
  const TargetGraphic = new mars3d.graphic.PointEntity({
    position: new Cesium.CallbackProperty(() => {
      return positionDM
    }, false),
    style: {
      color: "#0000ff",
      pixelSize: 7,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      label: {
        text: "目标参考点",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    }
  })
  graphicLayer.addGraphic(TargetGraphic)

  const graphicJD = new mars3d.graphic.PointEntity({
    position: new Cesium.CallbackProperty(function (time) {
      return positionJD
    }, false),
    style: {
      color: "#00ff00",
      pixelSize: 8,
      outlineColor: "#ffffff",
      outlineWidth: 2
    }
  })
  graphicJD.bindTooltip("与地形地面的交点")
  graphicLayer.addGraphic(graphicJD)

  // 摄像头朝向的地面点连线
  const graphicLine = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      if (!positionSXT || !positionDM || positionJD != null) {
        return []
      }
      return [positionSXT, positionDM]
    }, false),
    style: {
      width: 2,
      arcType: Cesium.ArcType.NONE,
      color: "#ffff00"
    }
  })
  graphicLayer.addGraphic(graphicLine)

  map.on(mars3d.EventType.load, function (event) {
    analysisIntersection()
  })
}

// 计算与地面焦点
export function analysisIntersection() {
  if (!positionSXT || !positionDM) {
    return []
  }

  sightline.clear()
  sightline.addAsync(positionSXT, positionDM)
}

// 设置摄像头位置
export function sePoint() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 8,
      color: "#ffff00",
      label: {
        text: "摄像头",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    },
    success: function (graphic) {
      positionSXT = graphic.positionShow
      positionSXT = mars3d.PointUtil.addPositionsHeight(positionSXT, 5.0) // 增加杆子高度
    }
  })
}

export function testTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
  if (val) {
    globalMsg("深度监测打开后，您将无法看到地下或被地形遮挡的对象")
  }
}

// 更新模型数据
export function updateModel(params) {
  if (!positionSXT) {
    return
  }

  const hpr = new Cesium.HeadingPitchRoll(
    Cesium.Math.toRadians(params.heading),
    Cesium.Math.toRadians(params.pitch),
    Cesium.Math.toRadians(params.roll)
  )
  positionDM = mars3d.PointUtil.getRayEarthPosition(positionSXT, hpr, true, map.scene.globe.ellipsoid)

  if (!positionDM) {
    // 与地面无交点时
    positionDM = mars3d.PointUtil.getPositionByHprAndLen(positionSXT, hpr, 5000)
  }

  sightline.clear()

  positionJD = null
}
