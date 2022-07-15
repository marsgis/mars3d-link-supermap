import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let currSkyBox // 当前生效的Skybox
let defaultSkybox // cesium自带的Skybox

const qingtianSkybox = new mars3d.GroundSkyBox({
  sources: {
    positiveX: "img/skybox_near/qingtian/rightav9.jpg",
    negativeX: "img/skybox_near/qingtian/leftav9.jpg",
    positiveY: "img/skybox_near/qingtian/frontav9.jpg",
    negativeY: "img/skybox_near/qingtian/backav9.jpg",
    positiveZ: "img/skybox_near/qingtian/topav9.jpg",
    negativeZ: "img/skybox_near/qingtian/bottomav9.jpg"
  }
})

const wanxiaSkybox = new mars3d.GroundSkyBox({
  sources: {
    positiveX: "img/skybox_near/wanxia/SunSetRight.png",
    negativeX: "img/skybox_near/wanxia/SunSetLeft.png",
    positiveY: "img/skybox_near/wanxia/SunSetFront.png",
    negativeY: "img/skybox_near/wanxia/SunSetBack.png",
    positiveZ: "img/skybox_near/wanxia/SunSetUp.png",
    negativeZ: "img/skybox_near/wanxia/SunSetDown.png"
  }
})

const lantianSkybox = new mars3d.GroundSkyBox({
  sources: {
    positiveX: "img/skybox_near/lantian/Right.jpg",
    negativeX: "img/skybox_near/lantian/Left.jpg",
    positiveY: "img/skybox_near/lantian/Front.jpg",
    negativeY: "img/skybox_near/lantian/Back.jpg",
    positiveZ: "img/skybox_near/lantian/Up.jpg",
    negativeZ: "img/skybox_near/lantian/Down.jpg"
  }
})

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.830035, lng: 117.159801, alt: 409, heading: 41, pitch: 0 }
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

  defaultSkybox = map.scene.skyBox
  currSkyBox = qingtianSkybox

  map.on(mars3d.EventType.postRender, function () {
    const position = map.camera.position
    const height = Cesium.Cartographic.fromCartesian(position).height
    if (height < 230000) {
      if (currSkyBox) {
        map.scene.skyBox = currSkyBox
      }
      map.scene.skyAtmosphere.show = false
    } else {
      if (defaultSkybox) {
        map.scene.skyBox = defaultSkybox
      }
      map.scene.skyAtmosphere.show = true
    }
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function sunny() {
  currSkyBox = qingtianSkybox
}

export function sunsetGlow() {
  currSkyBox = wanxiaSkybox
}

export function blueSky() {
  currSkyBox = lantianSkybox
}

export function defaultSky() {
  currSkyBox = defaultSkybox
}
