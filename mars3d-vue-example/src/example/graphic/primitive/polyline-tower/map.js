import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export const echartTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.526546, lng: 119.823425, alt: 803, heading: 178, pitch: -27 },
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

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tower.json" })
    .then(function (res) {
      showData(res.data)
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

function showData(arrdata) {
  let polylines1 = []
  let polylines2 = []
  let polylines3 = []
  let polylines4 = []
  let polylines5 = []
  const polylinesTB = []
  for (let i = 0; i < arrdata.length; i++) {
    const item = arrdata[i]

    // 所在经纬度坐标及海拔高度
    const longitude = Number(item.longitude)
    const latitude = Number(item.latitude)
    const height = Number(item.height)

    const originPoint = {
      longitude: longitude,
      latitude: latitude,
      height: height
    }
    const position = Cesium.Cartesian3.fromDegrees(originPoint.longitude, originPoint.latitude, originPoint.height)

    // 计算电线塔转角角度
    const degree = parseInt(item.degree)

    // 5条线路坐标
    const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(degree), 0, 0)
    const newPoint1 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0.341789, 16.837972, 50.717621), hpr)
    const newPoint2 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0.34241, -16.838163, 50.717617), hpr)
    const newPoint3 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(-0.025005, 0.022878, 39.540545), hpr)
    const newPoint4 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(-0.024999, 15.009109, 39.303012), hpr)
    const newPoint5 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(-0.025001, -15.009585, 39.301099), hpr)

    polylinesTB.push(newPoint3) // 图标显示的点

    if (i === 0) {
      polylines1.push(newPoint1)
      polylines2.push(newPoint2)
      polylines3.push(newPoint3)
      polylines4.push(newPoint4)
      polylines5.push(newPoint5)
    } else {
      const angularityFactor = -5000
      const num = 50
      let positions = mars3d.PolyUtil.getLinkedPointList(polylines1[polylines1.length - 1], newPoint1, angularityFactor, num) // 计算曲线点
      polylines1 = polylines1.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines2[polylines2.length - 1], newPoint2, angularityFactor, num) // 计算曲线点
      polylines2 = polylines2.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines3[polylines3.length - 1], newPoint3, angularityFactor, num) // 计算曲线点
      polylines3 = polylines3.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines4[polylines4.length - 1], newPoint4, angularityFactor, num) // 计算曲线点
      polylines4 = polylines4.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines5[polylines5.length - 1], newPoint5, angularityFactor, num) // 计算曲线点
      polylines5 = polylines5.concat(positions)
    }

    const html = mars3d.Util.getTemplateHtml({
      title: "塔杆",
      template: [
        { field: "roadName", name: "所属线路" },
        { field: "towerId", name: "杆塔编号" },
        { field: "杆塔型号", name: "杆塔型号" },
        { field: "杆塔性质", name: "杆塔性质" },
        { field: "杆塔类型", name: "杆塔类型" },
        { field: "投运日期", name: "投运日期" },
        { field: "杆塔全高", name: "杆塔全高" },
        { field: "设计单位", name: "设计单位" },
        { field: "施工单位", name: "施工单位" },
        { field: "height", name: "海拔高度" }
      ],
      attr: item
    })

    drawWireTowerModel(position, degree, html)
  }

  // 绘制路线
  drawGuideLine(polylines1, "#ffffff")
  drawGuideLine(polylines2, "#ffffff")
  drawGuideLine(polylines3)
  drawGuideLine(polylines4, "#ff0000")
  drawGuideLine(polylines5, "#0000ff")

  // 绘制断面图echarts图表
  computeSurfacePointsHeight(polylinesTB)
}

// 绘制电线塔模型
function drawWireTowerModel(position, degree, inthtml) {
  const modelUrls = ["tower.glb", "V.glb", "vertical01.glb", "vertical02.glb"]
  for (let j = 0; j < modelUrls.length; j++) {
    const graphic = new mars3d.graphic.ModelPrimitive({
      position: position,
      style: {
        url: "//data.mars3d.cn/gltf/mars/tower/" + modelUrls[j],
        heading: degree,
        scale: 1,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000.0)
      }
    })
    graphicLayer.addGraphic(graphic)

    graphic.bindPopup(inthtml)
  }
}

function drawGuideLine(positions, color) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: positions,
    style: {
      width: 4,
      color: color
    }
  })
  graphicLayer.addGraphic(graphic)
}

// 绘制断面图echarts图表
function computeSurfacePointsHeight(polylines5) {
  // 绘制断面图
  mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: polylines5 // 需要计算的源路线坐标数组
  }).then((result) => {
    const heightArry = []
    const heightTDArray = []
    let distanceArray
    for (let i = 0; i < polylines5.length; i++) {
      const item = polylines5[i]
      const carto = Cesium.Cartographic.fromCartesian(item)

      const height = mars3d.Util.formatNum(carto.height) // 设计高度  当小数点后面的数字一致时，会省略小数点，不显示
      const tdHeight = mars3d.Util.formatNum(Cesium.Cartographic.fromCartesian(result.positions[i]).height) // 地面高度
      heightArry.push(height)
      heightTDArray.push(tdHeight)

      // 距离数组
      const positionsLineFirst = result.positions[0]
      distanceArray = result.positions.map(function (data) {
        return Math.round(Cesium.Cartesian3.distance(data, positionsLineFirst)) // 计算两点之间的距离,返回距离
      })
    }
    echartTarget.fire("addEchart", { heightArry, heightTDArray, distanceArray })
  })
}
