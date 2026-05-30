/**
 * 电子沙盘
 *
 * @copyright mars3d.cn
 * @author 火星渣渣灰 2022-01-05
 */
import * as mars3d from "mars3d"
import iconBasemaps from "./icon/manager-basemaps.svg"
export const eventTarget = new mars3d.BaseClass()

let map: mars3d.Map // mars3d.Map三维地图对象

let layersTool: mars3d.control.ToolButton
let basemapsTool: mars3d.control.ToolButton

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance: mars3d.Map, mars3d): void {
  if (!mapInstance) { return }

  console.log("tools-button onMounted 初始化")

  map = mapInstance // 记录map
  layersTool = new mars3d.control.ToolButton({
    // @ts-ignore
    title: (e) => { return map.lang.type === "cn" ? "图层控制" : "Layer control" }, // 切换语音的支持
    icon: "img/svg/layers.svg",
    insertBefore: "homeButton",
    click: () => {
      eventTarget.fire("openManageLayer")
    }
  })
  map.addControl(layersTool)

  if (!map.control.baseLayerPicker && map.options.basemaps?.length > 0) {
    basemapsTool = new mars3d.control.ToolButton({
      title: "底图切换",
      icon: iconBasemaps,
      insertIndex: 1, // 插入的位置顺序, 1是home按钮后面
      click: () => {
        eventTarget.fire("openManageBasemaps")
      }
    })
    map.addControl(basemapsTool)
  }
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  if (!map.options) {
    return
  }

  console.log("tools-button onUnmounted 卸载了")
  eventTarget.off()

  if (layersTool) {
    map.removeControl(layersTool, true)
    layersTool = null
  }

  if (basemapsTool) {
    map.removeControl(basemapsTool, true)
    basemapsTool = null
  }

  map = null
}
