import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let poiLayer
let queryGaodePOI
let drawGraphic // 限定区域
let resultList = [] // 查询结果
let lastQueryOptions // 上一次请求参数，用于 下一页使用
let graphic
// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.797919, lng: 117.281329, alt: 36236, heading: 358, pitch: -81 }
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
  poiLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(poiLayer)

  poiLayer.bindPopup(function (event) {
    const item = event.graphic.attr

    let inHtml = '<div class="mars3d-template-titile">' + item.name + '</div><div class="mars3d-template-content" >'

    const type = String(item.type).trim()
    if (type) {
      inHtml += "<div><label>类别</label>" + type + "</div>"
    }
    const xzqh = String(item.xzqh).trim()
    if (xzqh) {
      inHtml += "<div><label>区域</label>" + xzqh + "</div>"
    }
    const tel = String(item.tel).trim()
    if (tel) {
      inHtml += "<div><label>电话</label>" + tel + "</div>"
    }
    const address = String(item.address).trim()
    if (address) {
      inHtml += "<div><label>地址</label>" + address + "</div>"
    }
    inHtml += "</div>"
    return inHtml
  })

  queryGaodePOI = new mars3d.query.GaodePOI()

  // 右键菜单
  const defaultContextmenuItems = map.getDefaultContextMenu()
  defaultContextmenuItems.push({
    text: "查看此处地址",
    icon: "fa fa-eye",
    show: function (e) {
      return Cesium.defined(e.cartesian)
    },
    callback: (e) => {
      queryGaodePOI.getAddress({
        location: e.cartesian,
        success: (result) => {
          console.log("根据经纬度坐标获取地址，逆地理编码", result)
          globalAlert(result.address)
        }
      })
    }
  })
  map.bindContextMenu(defaultContextmenuItems)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

/**
 * 查询
 *
 * @export
 * @param {string} radioFanwei 范围选择
 * @param {string} cityShi 城市
 * @param {string} text 关键字
 * @returns {void}
 */
export function query(radioFanwei, cityShi, text) {
  resultList = []
  switch (radioFanwei) {
    case "2": {
      // 当前视角范围
      const extent = map.getExtent()
      loadData(
        {
          page: 0,
          polygon: [
            [extent.xmin, extent.ymin],
            [extent.xmax, extent.ymax]
          ],
          limit: true
        },
        text
      )
      break
    }
    case "3": // 按范围
      if (!drawGraphic) {
        globalMsg("请绘制限定范围！")
        return
      }
      loadData(
        {
          page: 0,
          graphic: drawGraphic,
          limit: true
        },
        text
      )
      break
    default: {
      const dmmc = cityShi
      loadData(
        {
          page: 0,
          city: dmmc,
          citylimit: true
        },
        text
      )
      break
    }
  }
}

function loadData(queryOptions, text) {
  if (!text) {
    globalMsg("请输入 名称 关键字筛选数据！")
    return
  }
  showLoading()

  lastQueryOptions = {
    ...queryOptions,
    count: 25, // count 每页数量
    text: text,
    success: function (res) {
      const data = res.list
      if (data.length <= 1) {
        globalMsg("未搜索到相关数据！")
      }
      resultList = resultList.concat(data)
      addDemoGraphics(data)

      eventTarget.fire("tableData", { data }) // 抛出数据给组件

      hideLoading()
    },
    error: function (msg) {
      hideLoading()
      globalAlert(msg)
    }
  }
  queryGaodePOI.query(lastQueryOptions)
}

export function clearAll(noClearDraw) {
  lastQueryOptions = null
  resultList = []
  poiLayer.clear()

  if (!noClearDraw) {
    drawGraphic = null
    map.graphicLayer.clear()
  }
}

function addDemoGraphics(arr) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    graphic = new mars3d.graphic.BillboardEntity({
      position: Cesium.Cartesian3.fromDegrees(item.lng, item.lat),
      style: {
        image: "img/marker/mark-blue.png",
        scale: 1,
        scaleByDistance: true,
        scaleByDistance_far: 20000,
        scaleByDistance_farValue: 0.5,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        clampToGround: true, // 贴地
        highlight: { type: "click", image: "img/marker/mark-red.png" },
        label: {
          text: item.name,
          font: "20px 楷体",
          color: Cesium.Color.AZURE,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -30), // 偏移量
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000),
          clampToGround: true // 贴地
        }
      },
      attr: item
    })
    poiLayer.addGraphic(graphic)

    item.graphic = graphic
  }
}

// 框选查询 矩形
export function drawRectangle() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic

      console.log("矩形：", drawGraphic.toGeoJSON({ outline: true }))
    }
  })
}

// 框选查询   圆
export function drawCircle() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
      console.log("圆：", drawGraphic.toGeoJSON({ outline: true }))
    }
  })
}

// 框选查询   多边行
export function drawPolygon() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
      console.log("多边行：", drawGraphic.toGeoJSON())
    }
  })
}

export function flyToGraphic(graphic) {
  graphic.openHighlight()
  graphic.flyTo({
    radius: 1000, // 点数据：radius控制视距距离
    scale: 1.5, // 线面数据：scale控制边界的放大比例
    complete: () => {
      graphic.openPopup()
    }
  })
}
