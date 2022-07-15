/**
 * 电子沙盘
 *
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-01-05
 */
import * as mars3d from "mars3d"
import iconLayer from "./icon/manager-layers.svg"
import iconBasemaps from "./icon/manager-basemaps.svg"
export const eventTarget = new mars3d.BaseClass()

let map: mars3d.Map // mars3d.Map三维地图对象

let layersTool: mars3d.control.ToolButton
let basemapsTool: mars3d.control.ToolButton

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance: mars3d.Map): void {
  if (!mapInstance) { return }

  map = mapInstance // 记录map
  layersTool = new mars3d.control.ToolButton({
    title: "图层控制",
    icon: iconLayer,
    insertIndex: 1, // 插入的位置顺序, 1是home按钮后面
    click: () => {
      eventTarget.fire("openManageLayer")
    }
  })
  map.addControl(layersTool)

  if (!map.controls.baseLayerPicker && map.options.basemaps?.length > 0) {
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

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  console.log("卸载了")
  eventTarget.off()
  map.removeControl(basemapsTool)
  map.removeControl(layersTool)
  basemapsTool = null
  layersTool = null
  map = null
}
