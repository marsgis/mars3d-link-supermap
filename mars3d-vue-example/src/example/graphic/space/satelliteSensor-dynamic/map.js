import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 11.135847, lng: 127.745201, alt: 24250944, heading: 53, pitch: -90 },
    mapMode2D: Cesium.MapMode2D.ROTATE, // 二三维场景切换黑影
    clock: {
      currentTime: "2021-01-01T11:55:00Z",
      multiplier: 150 // 速度
    },
    cameraController: {
      maximumZoomDistance: 9000000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map  map.toolbar.style.bottom = "55px"// 修改toolbar控件的样式

  addGraphicLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addGraphicLayer() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)
  // 取数据
  const property = getDynamicProperty()

  // 绘制轨道
  const graphic = new mars3d.graphic.PathEntity({
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      leadTime: 0,
      resolution: 1,
      materialType: mars3d.MaterialType.PolylineGlow,
      materialOptions: {
        glowPower: 0.1,
        color: Cesium.Color.GREEN
      },
      width: 10
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90
    }
  })
  graphicLayer.addGraphic(graphic)

  // 视锥体 展示
  const satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: property,
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 20,
      angle2: 10,
      pitch: 0,
      roll: 0,
      color: "rgba(110,245,0,0.5)"
    },
    trackedEntity: graphic,
    autoHeading: true // 是否自动角度，根据trackedEntity监听的卫星模型
  })
  graphicLayer.addGraphic(satelliteSensor)

  // satelliteSensor.trackedEntity = graphic
}

function getDynamicProperty() {
  // 该数据是由后端计算返回的轨道信息
  const wxdata = [
    {
      time: "2021-01-01T11:55:00Z",
      x: -134.648939681369,
      y: -16.7002098082909,
      z: 1116015.99646736
    },
    {
      time: "2021-01-01T11:58:20Z",
      x: -136.899721614564,
      y: -5.57109779324382,
      z: 1114660.42260167
    },
    {
      time: "2021-01-01T12:01:40Z",
      x: -139.097755346946,
      y: 5.5661675014342,
      z: 1114652.53771041
    },
    {
      time: "2021-01-01T12:05:00Z",
      x: -141.348494748721,
      y: 16.6953271278176,
      z: 1115992.62270236
    },
    {
      time: "2021-01-01T12:08:20Z",
      x: -143.774623333805,
      y: 27.7998266828718,
      z: 1118477.29262629
    },
    {
      time: "2021-01-01T12:11:40Z",
      x: -146.56364947549,
      y: 38.8612791867078,
      z: 1121731.48352323
    },
    {
      time: "2021-01-01T12:15:00Z",
      x: -150.074587947037,
      y: 49.8538696199919,
      z: 1125266.75027392
    },
    {
      time: "2021-01-01T12:18:20Z",
      x: -155.164247872234,
      y: 60.7243205344318,
      z: 1128555.88185048
    },
    {
      time: "2021-01-01T12:21:40Z",
      x: -164.565295557077,
      y: 71.3021698947674,
      z: 1131111.78312013
    },
    {
      time: "2021-01-01T12:25:00Z",
      x: 168.08311253827,
      y: 80.6216347342535,
      z: 1132558.81749868
    },
    {
      time: "2021-01-01T12:28:20Z",
      x: 90.2490230895946,
      y: 81.5572161531476,
      z: 1132686.79200749
    },
    {
      time: "2021-01-01T12:31:40Z",
      x: 57.1447486006726,
      y: 72.6931112200722,
      z: 1131480.71852334
    },
    {
      time: "2021-01-01T12:35:00Z",
      x: 46.6265974503472,
      y: 62.1897990251119,
      z: 1129122.78290078
    },
    {
      time: "2021-01-01T12:38:20Z",
      x: 41.1892143509244,
      y: 51.3446936437554,
      z: 1125966.29999715
    },
    {
      time: "2021-01-01T12:41:40Z",
      x: 37.5323471372029,
      y: 40.3652635518961,
      z: 1122484.77649625
    }
  ]

  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  for (let z = 0; z < wxdata.length; z++) {
    const item = wxdata[z]

    const thisTime = Cesium.JulianDate.fromIso8601(item.time)
    const position = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)

    // 添加每一个链接点的信息，到达的时间以及坐标位置
    property.addSample(thisTime, position)
  }
  property.setInterpolationOptions({
    interpolationDegree: 2,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  })

  return property
}
