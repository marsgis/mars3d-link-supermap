import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.516143, lng: 117.282937, alt: 46242, heading: 2, pitch: -49 }
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

  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true // 绘制完成后是否自动激活编辑
  })
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function startDrawModel(url, isProxy) {
  if (isProxy) {
    url = "//server.mars3d.cn/proxy/" + url
  }

  graphicLayer.startDraw({
    type: "model",
    drawShow: true, // 绘制时，是否显示模型，可避免在3dtiles上拾取坐标存在问题。
    style: {
      url: url,
      scale: 1
    }
  })
}



// 地形
export function chkHasTerrain(isStkTerrain) {
  map.hasTerrain = isStkTerrain
}

// 深度检测
export function chkTestTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
  if (val) {
    globalMsg("深度监测打开后，您将无法看到地下或被地形遮挡的对象。")
  }
}

export function onlyPickModelPosition(val) {
  map.onlyPickModelPosition = val // 控制鼠标只取模型上的点，忽略地形上的点的拾取
}

/**
 *打开geojson文件
 *
 * @export
 * @param {FileInfo} file 文件名称
 * @returns {void} 无
 */
export function openGeoJSON(file) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader()
    console.log("reader")
    console.log(reader)
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const json = this.result
      graphicLayer.loadGeoJSON(json, {
        flyTo: true
      })
    }
  } else {
    globalMsg("暂不支持 " + fileType + " 文件类型的数据！")
  }
}

export function saveGeoJSON() {
  if (graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  const geojson = graphicLayer.toGeoJSON()
  mars3d.Util.downloadFile("我的标注.json", JSON.stringify(geojson))
}
