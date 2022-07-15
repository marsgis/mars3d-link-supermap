import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  control: {
    homeButton: true, // 回到默认视域按钮
    navigationHelpButton: false, // 是否显示帮助信息控件
    fullscreenButton: false, // 右下角全屏按钮
    geocoder: false,
    sceneModePicker: false,
    vrButton: false
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

  let hasSelected = false
  const toolButton = new mars3d.control.ToolButton({
    title: "示例按钮bookmark",
    icon: "img/icon/bookmark-one.svg",
    insertIndex: 1, // 插入的位置顺序, 1是home按钮后面
    click: () => {
      hasSelected = !hasSelected
      if (hasSelected) {
        mars3d.DomUtil.addClass(toolButton.container, "toolButton-selected")
        globalMsg("选中了 示例按钮bookmark，回调中想干啥就干啥~")
      } else {
        mars3d.DomUtil.removeClass(toolButton.container, "toolButton-selected")
        globalMsg("取消选中了 示例按钮bookmark，回调中想干啥就干啥~")
      }
    }
  })
  map.addControl(toolButton)

  const toolButton2 = new mars3d.control.ToolButton({
    title: "示例按钮good",
    icon: "img/icon/good.svg",
    insertIndex: 0, // 插入的位置顺序
    click: () => {
      globalMsg("单击了 示例按钮good，回调中想干啥就干啥~")
    }
  })
  map.addControl(toolButton2)

  const toolButton3 = new mars3d.control.ToolButton({
    title: "示例按钮chinese",
    icon: "img/icon/chinese.svg",
    click: () => {
      globalMsg("单击了 示例按钮chinese，回调中想干啥就干啥~")
    }
  })
  map.addControl(toolButton3)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
