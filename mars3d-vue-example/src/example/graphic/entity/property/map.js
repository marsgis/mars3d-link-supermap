import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.81506, lng: 117.23734, alt: 1768, heading: 322, pitch: -33 },
    fxaa: true
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

  // 创建矢量图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function demoSampleProperty() {
  graphicLayer.clear()

  // 创建盒子
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,255,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // 指定固定时间 ，方便写演示代码。
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))

  // 演示属性机制
  const property = new Cesium.SampledProperty(Cesium.Cartesian3)
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00")), new Cesium.Cartesian3(400.0, 300.0, 100.0))
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:20")), new Cesium.Cartesian3(400.0, 300.0, 900.0))
  // 让盒子一直存在
  // property.addSample(Cesium.JulianDate.fromDate(new Date('2017-08-26 00:00:00')), new Cesium.Cartesian3(400.0, 300.0, 900.0))

  marsBox.setStyle({ dimensions: property })
}

export function demoTimeIntervalCollectionProperty() {
  graphicLayer.clear()

  // 指定固定时间 ，方便写演示代码。
  map.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-08-25T00:00:00.00Z")

  // 创建盒子
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(255,255,0,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // 演示属性机制
  const property = new Cesium.TimeIntervalCollectionProperty()
  property.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:00.00Z/2017-08-25T00:00:02.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 200.0)
    })
  )
  property.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:02.00Z/2017-08-25T00:00:04.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 400.0)
    })
  )
  property.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:04.00Z/2017-08-25T00:00:06.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 500.0)
    })
  )
  property.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:06.00Z/2017-08-25T00:00:08.00Z",
      isStartIncluded: true,
      isStopIncluded: true,
      data: new Cesium.Cartesian3(400.0, 300.0, 700.0)
    })
  )

  marsBox.setStyle({ dimensions: property })
}

export function demoConstantProperty() {
  graphicLayer.clear()

  // 创建盒子
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,255,0,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  setTimeout(() => {
    // 演示属性机制

    // 会创建一个新的ConstantProperty
    // marsBox.entityGraphic.dimensions = new Cesium.Cartesian3(400.0, 300.0, 200.0)

    // 会修改原有的ConstantProperty的值。
    marsBox.entityGraphic.dimensions.setValue(new Cesium.Cartesian3(400.0, 300.0, 700.0))
  }, 2000)
}

//
export function demoCompositeProperty() {
  graphicLayer.clear()

  // 指定固定时间 ，方便写演示代码。
  map.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-08-25T00:00:00.00Z")

  // 创建盒子
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,255,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // 演示属性机制

  // 1 sampledProperty
  const sampledProperty = new Cesium.SampledProperty(Cesium.Cartesian3)
  sampledProperty.addSample(Cesium.JulianDate.fromIso8601("2017-08-25T00:00:00.00Z"), new Cesium.Cartesian3(400.0, 300.0, 100.0))
  sampledProperty.addSample(Cesium.JulianDate.fromIso8601("2017-08-25T00:00:10.00Z"), new Cesium.Cartesian3(400.0, 300.0, 500.0))

  // 2 ticProperty
  const ticProperty = new Cesium.TimeIntervalCollectionProperty()
  ticProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:10.00Z/2017-08-25T00:00:12.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 600.0)
    })
  )
  ticProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:12.00Z/2017-08-25T00:00:14.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 700.0)
    })
  )
  ticProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:14.00Z/2017-08-25T00:00:16.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 800.0)
    })
  )
  ticProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:16.00Z/2017-08-25T00:00:18.00Z",
      isStartIncluded: true,
      isStopIncluded: true,
      data: new Cesium.Cartesian3(400.0, 300.0, 900.0)
    })
  )

  // 3 compositeProperty
  const compositeProperty = new Cesium.CompositeProperty()
  compositeProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:00.00Z/2017-08-25T00:00:10.00Z",
      data: sampledProperty
    })
  )
  compositeProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:10.00Z/2017-08-25T00:00:20.00Z",
      isStartIncluded: false,
      isStopIncluded: false,
      data: ticProperty
    })
  )

  // 4 设置dimensions
  marsBox.setStyle({ dimensions: compositeProperty })
}

// 使盒子进行移动
export function demoSampledPositionProperty() {
  graphicLayer.clear()

  // 创建盒子
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.198461, 31.834956, 40.2],
    style: {
      dimensions: new Cesium.Cartesian3(100.0, 200.0, 300.0),
      color: "rgba(2,255,123,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // 指定固定时间 ，方便写演示代码。
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))

  // 演示属性机制
  const property = new Cesium.SampledPositionProperty()
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00")), Cesium.Cartesian3.fromDegrees(117.198461, 31.834956, 40.2))
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:20")), Cesium.Cartesian3.fromDegrees(117.231979, 31.833411, 35.6))

  marsBox.position = property
}

//
export function demoColorMaterialProperty() {
  graphicLayer.clear()

  // 创建盒子
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,0,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // 演示属性机制
  setTimeout(() => {
    marsBox.setStyle({ material: new Cesium.ColorMaterialProperty(new Cesium.Color(0, 1, 0)) })
    // 以上代码等同于
    // marsBox.setStyle({ material: new Cesium.Color(0, 1, 0) })
  }, 3000)
}

export function demoColorMaterialProperty2() {
  graphicLayer.clear()

  // 创建盒子
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,0,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // 指定固定时间 ，方便写演示代码。
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))

  // 演示属性机制
  const colorProperty = new Cesium.SampledProperty(Cesium.Color)
  colorProperty.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00")), new Cesium.Color(0, 0, 1))
  colorProperty.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:10")), new Cesium.Color(1, 1, 0))

  marsBox.setStyle({ material: new Cesium.ColorMaterialProperty(colorProperty) })
}

//
export function demoCallbackProperty() {
  graphicLayer.clear()

  // 创建盒子
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,255,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // 演示属性机制
  let len = 100.0
  const property = new Cesium.CallbackProperty(function (time, result) {
    result = result || new Cesium.Cartesian3(400.0, 300.0, 500.0)

    len += 3.0
    if (len > 900.0) {
      len = 100.0
    }

    result.x = 400.0
    result.y = 300.0
    result.z = len

    return result
  }, false)

  marsBox.setStyle({ dimensions: property })
}

//
export function demoReferenceProperty() {
  graphicLayer.clear()

  // 创建蓝色盒子
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,0,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // 指定固定时间 ，方便写演示代码。
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))

  // 演示属性机制
  const property = new Cesium.SampledProperty(Cesium.Cartesian3)
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00")), new Cesium.Cartesian3(400.0, 300.0, 100.0))
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:20")), new Cesium.Cartesian3(400.0, 300.0, 900.0))
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-26 00:00:00")), new Cesium.Cartesian3(400.0, 300.0, 900.0)) // 让盒子一直存在
  marsBox.setStyle({ dimensions: property })

  // 另外一个红色盒子
  const redBox = new mars3d.graphic.BoxEntity({
    position: [117.225643, 31.843242, 37.9],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(255,0,0,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(redBox)

  // 演示属性机制
  const collection = graphicLayer.dataSource.entities
  const dimensions = new Cesium.ReferenceProperty(collection, marsBox.id, ["box", "dimensions"])
  redBox.setStyle({ dimensions: dimensions })
}

//
export function demoPropertyBag() {
  graphicLayer.clear()

  // 创建盒子
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,0,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // 指定固定时间 ，方便写演示代码。
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))

  // 演示属性机制
  const zp = new Cesium.SampledProperty(Number)
  zp.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00")), 100.0)
  zp.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:10")), 800.0)

  const dimensions = new Cesium.PropertyBag({
    x: 400.0,
    y: 300.0,
    z: zp
  })
  marsBox.setStyle({ dimensions: dimensions })
}

//
export function demoVelocityVectorProperty() {
  graphicLayer.clear()

  const propertyFJ = getSampledPositionProperty([
    [117.198461, 31.834956, 40.2],
    [117.231979, 31.833411, 35.6]
  ])
  const graphic = new mars3d.graphic.BillboardEntity({
    position: propertyFJ,
    orientation: new Cesium.VelocityOrientationProperty(propertyFJ),
    style: {
      image: "img/icon/huojian.svg",
      scale: 0.5,
      alignedAxis: new Cesium.VelocityVectorProperty(propertyFJ, true)
    }
  })
  graphicLayer.addGraphic(graphic)
}

// 计算演示的SampledPositionProperty轨迹
function getSampledPositionProperty(points) {
  const property = new Cesium.SampledPositionProperty()

  const start = map.clock.currentTime
  const positions = mars3d.LngLatArray.toCartesians(points)
  for (let i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(start, i * 20, new Cesium.JulianDate())
    const position = positions[i]
    property.addSample(time, position)
  }
  return property
}
