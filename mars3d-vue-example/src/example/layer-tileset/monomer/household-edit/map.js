import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let geoJsonLayerDTH

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 43.823957, lng: 125.136704, alt: 286, heading: 11, pitch: -24 }
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

  // 模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    pid: 2030,
    type: "3dtiles",
    name: "校园",
    url: "//data.mars3d.cn/3dtiles/qx-xuexiao/tileset.json",
    position: { alt: 15.8 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    center: { lat: 43.821193, lng: 125.143124, alt: 990, heading: 342, pitch: -50 }
  })
  map.addLayer(tiles3dLayer)

  // 创建单体化图层
  geoJsonLayerDTH = new mars3d.layer.GeoJsonLayer()
  map.addLayer(geoJsonLayerDTH)

  geoJsonLayerDTH.bindPopup((e) => {
    const item = e.graphic.attr
    const html = `房号：${item.name}<br/>
                楼层：第${item.thisFloor}层 (共${item.allFloor}层)<br/>`
    return html
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 添加单体化数据
export function addData() {
  return map.graphicLayer.startDraw({
    type: "polygonP",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      geoJsonLayerDTH.addGraphic(graphic)
    }
  })
}

let houseTypeCount = 0

// 生成表格数据，绘制每层
export function produceData(drawGraphicId, dthPara, lastGraphicArrId) {
  if (dthPara.floorCount === 0) {
    globalMsg("楼层不能为0 ！")
    return
  } else if (dthPara.minHeight === 0) {
    globalMsg("最低高度不能为0 ！")
    return
  } else if (dthPara.maxHeight === 0) {
    globalMsg("最高高度不能为0 ！")
    return
  } else if (dthPara.maxHeight <= dthPara.minHeight) {
    globalMsg("最高高度不能小于等于最低高度 ！")
    return
  }

  const floorHeight = (dthPara.maxHeight - dthPara.minHeight) / dthPara.floorCount

  // 清除对应id的单体化数据
  if (lastGraphicArrId) {
    lastGraphicArrId.forEach((item) => {
      quitDraw(item)
    })
  }

  if (drawGraphicId) {
    quitDraw(drawGraphicId)
  }
  houseTypeCount++

  const generateGraphicIdArr = []

  for (let i = 0; i < dthPara.floorCount; i++) {
    const height = dthPara.minHeight * 1 + floorHeight * i
    const extrudedHeight = dthPara.minHeight * 1 + floorHeight * (i + 1)
    const color = i % 2 === 0 ? "red" : "#1e1e1e"
    // 用于popup展示的数据，可添加任意数据展示在popup内
    const attr = {
      name: i + 1,
      thisFloor: i + 1,
      houseType: `${houseTypeCount}号户型`,
      floorHeight: floorHeight.toFixed(2),
      allFloor: dthPara.floorCount,
      positions: dthPara.positions,
      minHeight: dthPara.minHeight,
      maxHeight: dthPara.maxHeight,
      houseTypeCount: houseTypeCount
    }
    const graphic = new mars3d.graphic.PolygonPrimitive({
      positions: dthPara.positions,
      style: {
        height: height,
        extrudedHeight: extrudedHeight,
        // 单体化默认显示样式
        color: getColor(),
        opacity: 0.3,
        classification: true,
        // 单体化鼠标移入或单击后高亮的样式
        highlight: {
          type: mars3d.EventType.click,
          color: color,
          opacity: 0.6
        }
      },
      attr
    })

    geoJsonLayerDTH.addGraphic(graphic)
    generateGraphicIdArr.push(graphic.id)
  }

  return {
    floorHeight,
    generateGraphicIdArr, // 单体化面的总id
    houseTypeCount
  }
}

export function getBuildingHeight() {
  return map.graphicLayer.startDraw({
    type: "point",
    style: {
      color: "#00fff2"
    },
    success: (graphic) => {
      const height = graphic.point?.alt
      map.graphicLayer.removeGraphic(graphic)

      if (!height) {
        return
      }
      return height
    }
  })
}

// 取消绘制
export function quitDraw(id) {
  const quitGraphic = geoJsonLayerDTH.getGraphicById(id)
  quitGraphic && geoJsonLayerDTH.removeGraphic(quitGraphic)
}

// 颜色
let index = 0
const colors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#0000FF"]
function getColor() {
  const i = index++ % colors.length
  return colors[i]
}

// 清除所有graphic数据
export function clearAllData() {
  geoJsonLayerDTH.clear(true)
}

/**
 * 打开geojson文件
 *
 * @export
 * @param {FileInfo} file 文件
 * @returns {void} 无
 */
export function openGeoJSON(file, resolve) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const geojson = this.result
      geoJsonLayerDTH.loadGeoJSON(geojson)

      resolve(geoJsonLayerDTH.getGraphics())
    }
  } else {
    globalMsg("暂不支持 " + fileType + " 文件类型的数据！")
  }
}

// 点击保存GeoJSON
export function saveGeoJSON() {
  if (geoJsonLayerDTH.length === 0) {
    globalMsg("当前没有任何数据，无需保存！")
    return
  }
  const geojson = geoJsonLayerDTH.toGeoJSON()
  mars3d.Util.downloadFile("分层分户矢量单体化.json", JSON.stringify(geojson))
}
