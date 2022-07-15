import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    // 此处参数会覆盖config.json中的对应配置
    center: { lat: 40, lng: 111.833884, alt: 20000000, heading: 0, pitch: -90 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1,
      maximumZoomDistance: 300000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
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
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  showLoading()

  const czml = Cesium.CzmlDataSource.load("//data.mars3d.cn/file/czml/satellite-one.czml")
  czml
    .then(function (dataSource) {
      hideLoading()

      map.dataSources.add(dataSource)

      const satelliteEntity = dataSource.entities.values[0]

      const swathWidth = swathWidthDict[satelliteEntity.id]
      satelliteFoot.start(satelliteEntity, swathWidth)
    })
    .catch(function (error) {
      globalAlert(error, "加载数据出错")
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 多个卫星时可以可配置【卫星地面投射圆半径，足迹宽度】
const swathWidthDict = {
  "Satellite/CBERS 4": 650000.0
}

// 地球观测的轨道预测,包含绘制卫星到地球的足迹功能。
const satelliteFoot = {
  start: function (entity, instrumentFOV) {
    if (!instrumentFOV) {
      // 默认值；
      instrumentFOV = 2000 * 1000
    }

    const secondMultiplier = instrumentFOV / 250000.0 // 每间隔多少公里进行显示一次足迹。
    const intervalBetweenFootPrints = 40 * secondMultiplier // setInterval间隔脚印的时长
    const numberOfFootPrintsAtAtime = parseInt(90 / Math.ceil(secondMultiplier)) * 5 // 保持足迹的数量个数

    const point = mars3d.LngLatPoint.fromCartesian(entity.position, map.clock.currentTime)
    this.drawOneFoot(point, instrumentFOV)

    let timeLast = map.clock.currentTime.secondsOfDay + intervalBetweenFootPrints

    map.on(mars3d.EventType.clockTick, (event) => {
      const sxTimes = Math.abs(map.clock.currentTime.secondsOfDay - timeLast) // 剩下时长

      if (sxTimes < 1 || sxTimes > intervalBetweenFootPrints) {
        timeLast = map.clock.currentTime.secondsOfDay + intervalBetweenFootPrints

        if (graphicLayer.length >= numberOfFootPrintsAtAtime) {
          graphicLayer.clear()
        }

        const point = mars3d.LngLatPoint.fromCartesian(entity.position, map.clock.currentTime)
        this.drawOneFoot(point, instrumentFOV)
      }
    })
  },

  // 绘制一个足迹
  drawOneFoot: function (point, instrumentFOV) {
    if (!point || !point.valid()) {
      return
    }

    // 卫星到地面的垂直线
    this._drawLineGroundToSatellite(point)

    // 投射圆锥体
    this._drawInstrumentFootPrintSwathWidth(instrumentFOV, point)

    // 在地球表面上绘制可见足迹椭圆
    this._drawVisibleFootPrint(point)
  },

  // 卫星到地面的垂直线,point: 卫星在天空中的位置
  _drawLineGroundToSatellite: function (point) {
    const groundPoint = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, 0.0)

    const point1 = new mars3d.graphic.PointPrimitive({
      position: point,
      style: {
        pixelSize: 2,
        color: Cesium.Color.RED
      }
    })
    graphicLayer.addGraphic(point1)

    const point2 = new mars3d.graphic.PointPrimitive({
      position: groundPoint,
      style: {
        pixelSize: 2,
        color: Cesium.Color.RED
      }
    })
    graphicLayer.addGraphic(point2)

    // const primitiveLine = new mars3d.graphic.PolylinePrimitive({
    //   positions: [point, groundPoint],
    //   style: {
    //     width: 1,
    //     color: Cesium.Color.YELLOW
    //   }
    // })
    // graphicLayer.addGraphic(primitiveLine)
  },
  // 投射圆锥体
  _drawInstrumentFootPrintSwathWidth: function (instrumentFOV, point) {
    const graphic = new mars3d.graphic.CylinderPrimitive({
      name: "视锥体",
      position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt / 2),
      style: {
        length: point.alt,
        topRadius: 0.0,
        bottomRadius: instrumentFOV,
        color: Cesium.Color.GREEN.withAlpha(0.3),
        outline: true,
        outlineColor: Cesium.Color.RED.withAlpha(0.5)
      }
    })
    graphicLayer.addGraphic(graphic)
  },
  // 在地球表面上绘制可见足迹椭圆（红色外圈线）
  _drawVisibleFootPrint: function (point) {
    const groundPoint = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, 0.0)

    const radiusOfEarth = Cesium.Cartesian3.distance(new Cesium.Cartesian3(0, 0, 0), groundPoint)
    const satToOrignEarth = radiusOfEarth + point.alt // point to origin of earth
    const groundPointToSatPointToTangentAngle = Cesium.Math.toDegrees(Math.asin(radiusOfEarth / satToOrignEarth))
    const groundPointToOriginToTangentAngle = 90.0 - groundPointToSatPointToTangentAngle
    const distanceAlongGround = Cesium.Math.TWO_PI * radiusOfEarth * (groundPointToOriginToTangentAngle / 360.0)

    const graphic = new mars3d.graphic.CirclePrimitive({
      name: "可视卫星范围（45度）",
      position: groundPoint,
      style: {
        radius: distanceAlongGround,
        color: "#ff0000",
        opacity: 0.1,
        outline: true,
        outlineColor: "#ff0000"
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}
