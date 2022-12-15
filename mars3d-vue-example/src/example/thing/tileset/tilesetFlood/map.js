import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中
export const mapOptions = {
  scene: {
    center: { lat: 31.797067, lng: 117.21963, alt: 1512, heading: 360, pitch: -36 }
  }
}

export let tilesetLayer

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

  showTehDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function showTehDemo() {
  // 加模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 1024,
    dynamicScreenSpaceError: true,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true
  })
  map.addLayer(tilesetLayer)

  // 会执行多次，重新加载一次完成后都会回调
  // tilesetLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
  //   console.log("触发allTilesLoaded事件", event)
  // })

  // 模型淹没处理类
  const tilesetFlood = tilesetLayer.flood

  tilesetFlood.on(mars3d.EventType.start, function (e) {
    console.log("开始分析", e)
  })
  tilesetFlood.on(mars3d.EventType.change, function (e) {
    const height = e.height
    eventTarget.fire("heightChange", { height })
  })
  tilesetFlood.on(mars3d.EventType.end, function (e) {
    console.log("结束分析", e)
  })
}

// 高度选择
export function onChangeHeight(height) {
  tilesetLayer.flood.height = height
}

// 修改分析方式
export function changeFloodType(val) {
  if (val === "1") {
    tilesetLayer.flood.floodAll = true
  } else {
    tilesetLayer.flood.floodAll = false
  }
}

// 绘制矩形
export function btnDrawExtent() {
  stop()
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

      tilesetLayer.flood.addArea(positions)
    }
  })
}
// 绘制多边形
export function btnDraw() {
  stop()
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow

      tilesetLayer.flood.addArea(positions)

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标
    }
  })
}

// 开始分析
export function begin(data) {
  if (!tilesetLayer.flood.floodAll && tilesetLayer.flood.length === 0) {
    globalMsg("请首先绘制分析区域！")
    return false
  }
  map.graphicLayer.clear()

  const minValue = Number(data.minHeight)
  const maxValue = Number(data.maxHeight)
  const speed = Number(data.speed)
  if (minValue <= 27) {
    globalMsg("最低海拔过低，请耐心等候几秒")
  }
  if (minValue > maxValue) {
    globalMsg("当前最低海拔高于最高海拔")
    return false
  }

  console.log("当前参数", { minHeight: minValue, maxHeight: maxValue })

  tilesetLayer.flood.setOptions({
    minHeight: minValue,
    maxHeight: maxValue,
    speed: speed
  })

  tilesetLayer.flood.start()
  return true
}

export function stop() {
  tilesetLayer.flood.clear()
}
