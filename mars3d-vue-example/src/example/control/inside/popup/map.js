import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let geoJsonLayer // 矢量图层对象,用于layer绑定展示
let graphicLayer // 矢量图层对象,用于graphic绑定展示

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

  map.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // popup对应的DOM
    console.log("打开了popup(全局监听)", event)
  })
  map.on(mars3d.EventType.popupClose, function (event) {
    const container = event.container // popup对应的DOM
    console.log("关闭了popup(全局监听)", event)
  })

  bindLayerDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function removeDemoLayer() {
  graphicLayer.clear()

  if (geoJsonLayer) {
    geoJsonLayer.remove(true)
    geoJsonLayer = null
  }
}

// 1.在map地图上绑定Popup单击弹窗
export function bindMapDemo() {
  removeDemoLayer()

  // 关闭弹窗
  map.closePopup()

  // 传入坐标和内容，可以直接任意弹出
  const position = [116.328539, 30.978731, 1521]
  map.openPopup(position, "我是地图上直接弹出的")
}

// 2.在layer图层上绑定Popup单击弹窗
export function bindLayerDemo() {
  removeDemoLayer()

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "标绘示例数据",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json"
  })
  map.addLayer(geoJsonLayer)

  // 在layer上绑定Popup单击弹窗
  geoJsonLayer.bindPopup(
    function (event) {
      const attr = event.graphic.attr
      return attr.type + " 我是layer上绑定的Popup" + new Date().toLocaleTimeString()

      // return new Promise((resolve) => {
      //   //这里可以进行后端接口请求数据，setTimeout测试异步
      //   setTimeout(() => {
      //     resolve("Promise异步回调显示的弹窗内容信息");
      //   }, 2000);
      // });
    },
    { timeRender: true, closeButton: false } // timeRender实时刷新
  )

  geoJsonLayer.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // popup对应的DOM
    console.log("图层上打开了popup", container)
  })
  geoJsonLayer.on(mars3d.EventType.popupClose, function (event) {
    const container = event.container // popup对应的DOM
    console.log("图层上移除了popup", container)
  })
}

// 2.在layer图层上预定义Popup单击弹窗
export function bindLayerDemo2() {
  removeDemoLayer()

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "标绘示例数据",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
    // popup按属性字段配置，可以是字符串模板或数组
    // popup: 'all', //显示所有属性，常用于测试
    // popup: '{name} {type}',
    popup: [
      { field: "id", name: "编码" },
      { field: "name", name: "名称" },
      { field: "type", name: "类型" },
      {
        type: "html",
        html: "<label>视频</label><video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style=\"width: 300px;\" ></video>"
      }
    ],
    popupOptions: {
      autoCenter: true
    }
  })
  map.addLayer(geoJsonLayer)
}

// 2.在layer图层上绑定Popup单击弹窗
export function bindLayerTemplateDemo() {
  removeDemoLayer()

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "标绘示例数据",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json"
  })
  map.addLayer(geoJsonLayer)

  // 在layer上绑定Popup单击弹窗
  geoJsonLayer.bindPopup(
    function (event) {
      const attr = event.graphic.attr
      return "我是layer上绑定的自定义模版Popup<br />" + attr.type
    },
    {
      template: `<div class="marsBlackPanel animation-spaceInDown">
                        <div class="marsBlackPanel-text">{content}</div>
                        <span class="mars3d-popup-close-button closeButton" >×</span>
                      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    }
  )

  geoJsonLayer.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // popup对应的DOM
    console.log("图层上打开了popup", container)
  })
  geoJsonLayer.on(mars3d.EventType.popupClose, function (event) {
    const container = event.container // popup对应的DOM
    console.log("图层上移除了popup", container)
  })
}

// 3.在graphic数据上绑定Popup单击弹窗局部刷新
export function bindGraphicDemo1() {
  removeDemoLayer()

  const graphic = new mars3d.graphic.BoxEntity({
    position: new mars3d.LngLatPoint(116.328539, 30.978731, 1521),
    style: {
      dimensions: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      fill: true,
      color: "#00ff00",
      opacity: 0.9,
      label: {
        text: "graphic绑定的演示",
        font_size: 19,
        pixelOffsetY: -45,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)

  function getInnerHtml(event) {
    // let attr = event.graphic.attr
    const inthtml = `<table style="width:280px;">
                <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">graphic.bindPopup</th></tr>
                <tr><td >说明：</td><td >Popup鼠标单击信息弹窗1 </td></tr>
                <tr><td >方式：</td><td >可以绑定任意html </td></tr>
                <tr><td >备注：</td><td >我是graphic上绑定的Popup</td></tr>
                <tr><td colspan="4" style="text-align:right;cursor: pointer;"><button id="btnDetails">更多</button></td></tr>
              </table>`
    return inthtml
  }

  graphic.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // popup对应的DOM
    console.log("打开了popup", container)

    const btnDetails = container.querySelector("#btnDetails")
    if (btnDetails) {
      btnDetails.addEventListener("click", (e) => {
        showXQ()
      })
    }
  })
  graphic.on(mars3d.EventType.popupClose, function (event) {
    const container = event.container // popup对应的DOM
    console.log("移除了popup", container)
  })


  // 绑定Popup
  graphic.bindPopup(getInnerHtml).openPopup()
}

// 4.在graphic数据上绑定Popup单击弹窗
export function bindGraphicDemo2() {
  removeDemoLayer()

  const graphic = new mars3d.graphic.BillboardEntity({
    position: new mars3d.LngLatPoint(116.328539, 30.978731, 1521),
    style: {
      image: "img/marker/point-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: {
        text: "Popup局部更新绑定的演示",
        font_size: 18,
        font_family: "楷体",
        pixelOffsetY: -45,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)

  const innerHtml = `<table style="width:280px;">
                <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">graphic.bindPopup局部刷新</th></tr>
                <tr><td >说明：</td><td >Popup鼠标单击信息弹窗2 </td></tr>
                <tr><td >方式：</td><td >可以绑定任意html </td></tr>
                <tr><td >备注：</td><td >我是graphic上绑定的Popup</td></tr>
                <tr><td >时间：</td><td id="tdTime"></td></tr>
                <tr><td colspan="4" style="text-align:right;cursor: pointer;"><button id="btnDetails">更多</button></td></tr>
              </table>`

  graphic.on(mars3d.EventType.popupOpen, function (event) {
    const container = event.container // popup对应的DOM
    const btnDetails = container.querySelector("#btnDetails")
    if (btnDetails) {
      btnDetails.addEventListener("click", (e) => {
        showXQ()
      })
    }
  })

  // 刷新局部DOM,不影响popup面板的其他控件操作
  graphic.on(mars3d.EventType.postRender, function (event) {
    const container = event.container // popup对应的DOM
    const tdTime = container.querySelector("#tdTime")
    if (tdTime) {
      const date = mars3d.Util.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss S")

      tdTime.innerHTML = date
    }
  })

  // 绑定Popup
  graphic.bindPopup(innerHtml, { offsetY: -30 }).openPopup()
}

// 只是为了演示，可以单击详情
function showXQ() {
  const showHistoryLayer = true
  eventTarget.fire("showWebsite", { showHistoryLayer })
}
