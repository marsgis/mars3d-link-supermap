import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象


const creditHtml = `地图服务由 超图 提供 <a href="https://doc.supermapol.com/zh-hans/CloudLicense/cloudbuy.html" target="_blank" trace="tos">帮助文档</a> `

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.361977, lng: 117.065547, alt: 855731.3, heading: 360, pitch: -87 },
    highDynamicRange: false
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "3857地图",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/google_vec.png",
      type: "xyz",
      url: `http://support.supermap.com:8090/iserver/services/map-china/rest/maps/China/tileImage.webp?transparent=true&cacheEnabled=true&_cache=true&width=256&height=256&redirect=false&overlapDisplayed=false&origin={origin}&x={x}&y={y}&scale={scale}`,
      show: true,
      credit: creditHtml
    },
    {
      name: "ChinaLight",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/bd-c-grayscale.png",
      type: "xyz",
      url: `http://support.supermap.com:8090/iserver/services/map-china/rest/maps/ChinaLight/tileImage.webp?transparent=true&cacheEnabled=true&_cache=true&width=256&height=256&redirect=false&overlapDisplayed=false&origin={origin}&x={x}&y={y}&scale={scale}`,
      credit: creditHtml
    },
    {
      name: "EPSG4326地图",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/bd-c-grassgreen.png",
      type: "xyz",
      url: `http://support.supermap.com:8090/iserver/services/map-china/rest/maps/China_4326/tileImage.webp?transparent=true&cacheEnabled=true&_cache=true&width=256&height=256&redirect=false&overlapDisplayed=false&origin={origin}&x={x}&y={y}&scale={scale}`,
      crs: "EPSG:4326",
      credit: creditHtml
    }
  ]
}

export const eventTarget = new mars3d.BaseClass()

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  addCreditDOM()

   globalNotify(
    "已知问题提示",
    `如图层未显示或服务URL访问超时，是因为超图本身服务问题，您可以参考超图示例代码的可用服务地址替换本地服务地址使用。`
  )
}


// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 叠加的图层
let tileLayer

export function addTileLayer() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  const baseUrl = "http://support.supermap.com:8090/iserver/services/map-world/rest/maps/World"
  tileLayer = new mars3d.layer.XyzLayer({
    url: baseUrl + "/tileImage.png?transparent=true&cacheEnabled=true&_cache=true&width=256&height=256&redirect=false&overlapDisplayed=false&origin={origin}&x={x}&y={y}&scale={scale}",
    crs: "EPSG:4326" // 坐标系，支持 "EPSG:4326" 、 "EPSG:4490"、 "EPSG:3857"
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}


// 在下侧状态栏增加一个额外div展示图层版权信息
let creditDOM
function addCreditDOM() {
  const locationBar = map.control.locationBar?.container
  if (locationBar) {
    creditDOM = mars3d.DomUtil.create("div", "mars3d-locationbar-content mars3d-locationbar-autohide", locationBar)
    creditDOM.style["pointer-events"] = "all"
    creditDOM.style.float = "left"
    creditDOM.style.marginLeft = "120px"

    creditDOM.innerHTML = map.basemap?.options?.credit || ""

    map.on(mars3d.EventType.changeBasemap, function (event) {
      creditDOM.innerHTML = event.layer?.options?.credit || ""
    })
  }
}
function removeCreditDOM() {
  if (creditDOM) {
    mars3d.DomUtil.remove(creditDOM)
    creditDOM = null
  }
}
