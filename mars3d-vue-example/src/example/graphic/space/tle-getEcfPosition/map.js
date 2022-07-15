import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

let tleArr
let drawGraphic
let tableList = []

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 21.105826, lng: 108.202174, alt: 4426845, heading: 0, pitch: -77 },
    cameraController: {
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    }
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

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  queryTleChinaApiData()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 访问后端接口，取数据
function queryTleChinaApiData() {
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tle-china.json" })
    .then(function (data) {
      tleArr = data.data
      console.log("卫星数量：" + tleArr.length)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

// 框选查询 矩形

export function drawRectangle() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    allowDrillPick: true,
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff"
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}

// 框选查询   多边
export function drawPolygon() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    allowDrillPick: true,
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff"
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}

// 框选查询   圆
export function drawCircle() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "circle",
    allowDrillPick: true,
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff"
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}

export function drawClear() {
  map.graphicLayer.clear()
  drawGraphic = null
}

// 清除效果
export function clearResult() {
  tableList = []
  map.graphicLayer.clear()
}

//= ===============卫星过境===================================

// 颜色
const pointClr = Cesium.Color.fromCssColorString("#ff0000").withAlpha(0.7)
/**
 *
 * @export
 * @param {time} startTimes 开始时间
 * @param {time} endTimes 结束时间
 * @returns {void}
 */
export function startFX(startTimes, endTimes) {
  if (!drawGraphic) {
    globalMsg("请先在图上绘制区域")
    return
  }

  // 范围相关信息
  const options = {
    startTimes: startTimes,
    endTimes: endTimes,
    graphic: drawGraphic
  }

  // 分析卫星位置
  const newSatelliteArr = [] // 存储飞过指定范围的卫星的数据
  for (let ind = 0; ind < tleArr.length; ind++) {
    const item = tleArr[ind]
    const arr = fxOneSatellite(item, options)

    if (arr.length === 0) {
      continue
    }

    item.inAreaPath = arr
    newSatelliteArr.push(item)
  }

  showResult(newSatelliteArr)
}

function fxOneSatellite(item, options) {
  const inAreaPath = []
  let lastObj = null

  const graphic = options.graphic
  const startTimes = options.startTimes
  const endTimes = options.endTimes
  const step = 10 * 1000 // 插值数

  let nowTime = startTimes

  let position
  while (nowTime <= endTimes) {
    // 根据时间计算卫星的位置
    const position = mars3d.Tle.getEcfPosition(item.tle1, item.tle2, nowTime)
    if (!position) {
      break
    }
    // 显示点[参考比较结果是否正确]
    // let timeStr = new Date(nowTime).format("yyyy-MM-dd HH:mm:ss")
    const pointPrimitive = new mars3d.graphic.PointPrimitive({
      position: position,
      style: {
        color: pointClr,
        pixelSize: 3
      },
      attr: item
      // tooltip: `编号：${item.norad} <br />卫星：${item.name} <br />时间：${timeStr}`
    })
    map.graphicLayer.addGraphic(pointPrimitive)

    // 判断是卫星否在缓冲区内
    const isInPoly = graphic.isInPoly(position)

    // console.log(`${item.name},时间：${timeStr},结果：${isInPoly}`);

    if (lastObj && !lastObj.isInPoly && isInPoly) {
      // 表示进入范围
      inAreaPath.push({
        lastPosition: lastObj.position,
        lastTime: lastObj.time,
        time: nowTime,
        position: position,
        inOrOut: "in"
      })
    }

    if (lastObj && lastObj.isInPoly && !isInPoly) {
      // 表示出范围
      inAreaPath.push({
        position: position,
        lastPosition: lastObj.position,
        lastTime: lastObj.time,
        time: nowTime,
        inOrOut: "out"
      })
      break
    }

    lastObj = {
      position: position,
      isInPoly: isInPoly,
      time: nowTime
    }
    nowTime += step
  }

  if (lastObj && lastObj.isInPoly) {
    // 表示出范围
    inAreaPath.push({
      position: position,
      lastPosition: lastObj.position,
      lastTime: lastObj.time,
      time: nowTime,
      inOrOut: "out"
    })
  }

  return inAreaPath
}

//= ====================结果展示==================================

function showResult(newSatelliteArr) {
  // 显示卫星条带

  for (let ind = 0; ind < newSatelliteArr.length; ind++) {
    const item = newSatelliteArr[ind]
    const inAreaPath = item.inAreaPath
    if (inAreaPath.length < 2) {
      continue
    }

    let index = 0
    if (inAreaPath[0].inOrOut === "out") {
      // 保证从进入 开始计算
      index = 1
    }

    for (let i = index; i < inAreaPath.length; i = i + 2) {
      const positions = []
      let inTime
      let outTime
      if (inAreaPath[i].inOrOut === "in" && inAreaPath[i + 1].inOrOut === "out") {
        const inAttr = inAreaPath[i]
        const outAttr = inAreaPath[i + 1]
        if (inAttr?.lastPosition) {
          inTime = mars3d.Util.formatDate(new Date(inAttr.lastTime), "yyyy-M-d HH:mm:ss")
          positions.push(inAttr.lastPosition)
        }
        if (outAttr?.position) {
          positions.push(outAttr.position)
          outTime = mars3d.Util.formatDate(new Date(outAttr.time), "yyyy-M-d HH:mm:ss")
        }
        if (positions.length > 1) {
          const data = {
            positions: positions,
            name: item.name,
            inTime: inTime,
            outTime: outTime,
            often: mars3d.Util.formatTime((outAttr.time - inAttr.lastTime) / 1000),
            distance: mars3d.MeasureUtil.formatDistance(Cesium.Cartesian3.distance(positions[1], positions[0]))
          }
          tableList.push(data)

          eventTarget.fire("dataList", { tableList })

          showCorridor(data)
        }
      }
    }
  }

  globalMsg("分析完成，共" + tableList.length + "条过境记录")
}


function showCorridor(data) {
  const graphic = new mars3d.graphic.CorridorPrimitive({
    positions: data.positions,
    style: {
      width: 6000,
      cornerType: Cesium.CornerType.MITERED, // 指定转角处样式
      color: "#00ff00"
    }
  })
  map.graphicLayer.addGraphic(graphic)

  const inthtml =
    '<table style="width:280px;">' +
    '<tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">信息</th></tr>' +
    "<tr><td >卫星名称：</td><td >" +
    data.name +
    " </td></tr>" +
    "<tr><td >进入时间：</td><td >" +
    data.inTime +
    " </td></tr>" +
    "<tr><td >飞出时间：</td><td >" +
    data.outTime +
    " </td></tr>" +
    "<tr><td >过境时长：</td><td >" +
    data.often +
    " </td></tr>" +
    "<tr><td >过境距离：</td><td >" +
    data.distance +
    " </td></tr>" +
    "</table>"
  graphic.bindPopup(inthtml)

  data._graphic = graphic
}
