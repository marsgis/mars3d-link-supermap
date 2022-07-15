import * as mars3d from "mars3d"
import { Typhoon, PlayTyphoon } from "./Typhoon"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 8.560501, lng: 111.849127, alt: 10725692, heading: 358, pitch: -87 }
  }
}

export const eventTarget = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 绘制24/48小时警戒线
  drawWarningLine()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 所有已构造的台风集合
const typhoonListObj = {}

// 当前选择的台风
let selectTyphoon

// 勾选台风
export function selectOneTyphoon(row) {
  stopPlay()

  const id = row.id
  if (!typhoonListObj[id]) {
    typhoonListObj[id] = new Typhoon({ ...row }, map)
  }

  const typhoon = typhoonListObj[id]
  typhoon.show = true
  typhoon.flyTo()

  selectTyphoon = typhoon
}

// 取消勾选台风
export function unSelectOneTyphoon(id) {
  const typhoon = typhoonListObj[id]
  if (!typhoon) {
    return
  }

  if (typhoon.playTyphoon) {
    typhoon.playTyphoon.stop()
  }
  typhoon.show = false

  selectTyphoon = null
}

// 定位到台风
export function clickTyRow(row) {
  const typhoon = typhoonListObj[row.id]
  if (typhoon) {
    typhoon.flyTo()
  }
}

// 定位到轨迹点
export function clickPathRow(row) {
  selectTyphoon.showPointFQ(row)
  const graphic = selectTyphoon.getPointById(row.id)
  if (graphic) {
    graphic.flyTo({
      radius: 1600000,
      complete() {
        graphic.openTooltip()
      }
    })
  }
}

// 开始播放
export function startPlay() {
  if (!selectTyphoon) {
    return
  }

  if (!selectTyphoon.playTyphoon) {
    selectTyphoon.playTyphoon = new PlayTyphoon(selectTyphoon.options, map)
  }

  selectTyphoon.playTyphoon.start()
  selectTyphoon.show = false
}

// 停止播放
export function stopPlay() {
  if (selectTyphoon?.playTyphoon) {
    selectTyphoon.playTyphoon.stop()
    selectTyphoon.show = true
  }
}

// 绘制警戒线
function drawWarningLine() {
  // 绘制24小时警戒线
  const lineWarning24 = new mars3d.graphic.PolylineEntity({
    positions: [
      [127, 34],
      [127, 22],
      [119, 18],
      [119, 11],
      [113, 4.5],
      [105, 0]
    ],
    style: {
      color: "#828314",
      width: 2,
      zIndex: 1
    }
  })
  map.graphicLayer.addGraphic(lineWarning24)

  // 注记文本
  const textWarning24 = new mars3d.graphic.RectangleEntity({
    positions: [
      [128.129019, 29.104287],
      [125.850451, 28.424599]
    ],
    style: {
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "24小时警戒线",
        font: "80px 楷体",
        color: "#828314",
        backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0)
      },
      rotationDegree: 90
    }
  })
  map.graphicLayer.addGraphic(textWarning24)

  // 绘制48小时警戒线
  const lineWarning48 = new mars3d.graphic.PolylineEntity({
    positions: [
      [132, 34],
      [132, 22],
      [119, 0],
      [105, 0]
    ],
    style: {
      width: 2,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        dashLength: 20.0,
        color: "#4dba3d"
      }
    }
  })
  map.graphicLayer.addGraphic(lineWarning48)

  // 注记文本
  const textWarning48 = new mars3d.graphic.RectangleEntity({
    positions: [
      [130.502492, 25.959716],
      [133.423638, 26.772991]
    ],
    style: {
      materialType: mars3d.MaterialType.Text,
      materialOptions: {
        text: "48小时警戒线",
        font: "80px 楷体",
        color: "#4dba3d",
        backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0)
      },
      rotationDegree: 90,
      zIndex: 4
    }
  })
  map.graphicLayer.addGraphic(textWarning48)
}

export const formatDate = mars3d.Util.formatDate
