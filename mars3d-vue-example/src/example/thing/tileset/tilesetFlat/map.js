import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let lineLayer // 矢量图层对象,用于graphic绑定展示
let tilesetLayer // 3dtiles模型；添加模型选择

export const mapOptions = {
  scene: {
    center: { lat: 34.215539, lng: 108.959582, alt: 817, heading: 2, pitch: -46 }
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
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  globalNotify(
    "已知问题提示",
    `(1) 对3dtiles数据有要求，仅适用于无自带着色器的纹理格式模型。
     (2) 目前不支持所有3dtile数据，请替换url进行自测`
  )

  // 创建矢量数据图层
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)

  showDytDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function showDytDemo() {
  removeLayer()

  // 加模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "大雁塔",
    url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
    position: { alt: -27 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,

    // 可传入TilesetFlat构造参数，下面是演示压平区域
    flat: {
      area: [
        {
          positions: [
            [108.959062, 34.220134, 397.3],
            [108.959802, 34.220147, 397.6],
            [108.959779, 34.219506, 398.7],
            [108.959106, 34.21953, 398.1]
          ]
        }
      ]
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat是TilesetFlat对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
}

export function showTehDemo() {
  removeLayer()

  // 以下数据为cesiumlab v3处理，目前其材质有做偏移处理，不知道内部逻辑及具体值，无法平整压平。
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 1024,
    dynamicScreenSpaceError: true,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    center: { lat: 31.795308, lng: 117.21948, alt: 1820, heading: 0, pitch: -39 },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat是TilesetFlat对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
}

export function showQxShequDemo() {
  removeLayer()

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "县城社区",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 11.5 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    dynamicScreenSpaceError: true,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    center: { lat: 28.439062, lng: 119.479517, alt: 484, heading: 4, pitch: -63 },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat是TilesetFlat对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
}

// 添加了压平区域后的回调事件
function onAddFlatArea(event) {
  const areaObj = event.area
  areaObj.lineId = addTestLine(areaObj.positions)

  // 触发自定义事件 addItem
  eventTarget.fire("addItem", event)
}

function removeLayer() {
  if (tilesetLayer) {
    map.removeLayer(tilesetLayer, true)
    tilesetLayer = null
  }
}

// 添加矩形
export function btnDrawExtent(height) {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      tilesetLayer.flat.addArea(positions, { height: height })
    }
  })
}
// 绘制多边形
export function btnDraw(height) {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      tilesetLayer.flat.addArea(positions, { height: height })
    }
  })
}
// 清除
export function removeAll() {
  tilesetLayer.flat.clear()

  map.graphicLayer.clear()
  lineLayer.clear()
}

// 改变压平的高度
export function changeFlatHeight(val) {
  tilesetLayer.flat.updateHeight(val)
}

// 是否显示测试边界线
export function chkShowLine(val) {
  lineLayer.show = val
}

export function showHideArea(id, selected) {
  if (selected) {
    tilesetLayer.flat.showArea(id)
  } else {
    tilesetLayer.flat.hideArea(id)
  }
}

// 定位至模型
export function flyToGraphic(item) {
  const graphic = tilesetLayer.flat.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

// 删除模型
export function deletedGraphic(areaId, lineId) {
  tilesetLayer.flat.removeArea(areaId)

  const graphicLine = lineLayer.getGraphicById(lineId)
  lineLayer.removeGraphic(graphicLine)
}

function addTestLine(positions) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: positions,
    style: {
      closure: true,
      color: "#ffffff",
      opacity: 0.8,
      width: 2,
      clampToGround: true
    }
  })
  lineLayer.addGraphic(graphic)

  return graphic.id
}
