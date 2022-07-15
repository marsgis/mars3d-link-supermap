import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 36.873519, lng: 106.863496, alt: 19999205, heading: 354, pitch: -89 },
    cameraController: {
      maximumZoomDistance: 50000000
    }
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

  show6()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function show1() {
  // 修改天空盒
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/1/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/1/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/1/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/1/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/1/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/1/tycho2t3_80_pz.jpg"
    }
  })
}

export function show2() {
  // 修改天空盒
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/2/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/2/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/2/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/2/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/2/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/2/tycho2t3_80_pz.jpg"
    }
  })
}

export function show3() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/3/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/3/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/3/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/3/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/3/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/3/tycho2t3_80_pz.jpg"
    }
  })
}

export function show4() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/4/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/4/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/4/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/4/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/4/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/4/tycho2t3_80_pz.jpg"
    }
  })
}

export function show5() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/5/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/5/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/5/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/5/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/5/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/5/tycho2t3_80_pz.jpg"
    }
  })
}

export function show6() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/6/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/6/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/6/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/6/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/6/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/6/tycho2t3_80_pz.jpg"
    }
  })
}
