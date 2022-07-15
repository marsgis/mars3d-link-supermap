import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.control = {
    locationBar: false // 当前演示的示例控件-比例尺控件
  }
  return option
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 方式2：在创建地球后按需调用addControl添加(直接new对应type类型的控件)
  const locationBar = new mars3d.control.LocationBar({
    fps: true,
    template:
      "<div>经度:{lng}</div><div>纬度:{lat}</div> <div>海拔：{alt}米</div> <div>层级：{level}</div><div>方向：{heading}度</div> <div>俯仰角：{pitch}度</div><div>视高：{cameraHeight}米</div>"
    // template: function (locationData) {
    //   let pitch
    //   if (locationData.pitch < 0) {
    //     pitch = '俯视:' + -locationData.pitch
    //   } else {
    //     pitch = '仰视:' + locationData.pitch
    //   }

    //   let dfmX = mars3d.Util.formatDegree(locationData.lng)
    //   let dfmY = mars3d.Util.formatDegree(locationData.lat)

    //   return ` <div>经度:${locationData.lat} , ${dfmX}</div>
    //           <div>纬度:${locationData.lng} , ${dfmY}</div>
    //           <div>海拔：${locationData.alt}米</div>
    //           <div>方向：${locationData.heading}度</div>
    //           <div>${pitch}度</div>
    //           <div>视高：${locationData.cameraHeight}米</div>`
    // },
  })
  map.addControl(locationBar)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
