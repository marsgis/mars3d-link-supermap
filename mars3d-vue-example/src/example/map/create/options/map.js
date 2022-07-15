import * as mars3d from "mars3d"

function initMap() {
  // 创建三维地球场景
  const map = new mars3d.Map("mars3dContainer", {
    scene: {
      center: { lat: 30.054604, lng: 108.885436, alt: 17036414, heading: 0, pitch: -90 },
      showSun: true,
      showMoon: true,
      showSkyBox: true,
      showSkyAtmosphere: false, // 关闭球周边的白色轮廓 map.scene.skyAtmosphere = false
      fog: true,
      fxaa: true,
      globe: {
        showGroundAtmosphere: false, // 关闭大气（球表面白蒙蒙的效果）
        depthTestAgainstTerrain: false,
        baseColor: "#546a53"
      },
      cameraController: {
        zoomFactor: 3.0,
        minimumZoomDistance: 1,
        maximumZoomDistance: 50000000,
        enableRotate: true,
        enableZoom: true
      }
    },
    control: {
      baseLayerPicker: true, // basemaps底图切换按钮
      homeButton: true, // 视角复位按钮
      sceneModePicker: true, // 二三维切换按钮
      navigationHelpButton: true, // 帮助按钮
      fullscreenButton: true, // 全屏按钮
      contextmenu: { hasDefault: true } // 右键菜单
    },
    terrain: {
      url: "//data.mars3d.cn/terrain",
      show: true
    },
    basemaps: [
      {
        name: "天地图影像",
        icon: "img/basemaps/tdt_img.png",
        type: "tdt",
        layer: "img_d",
        show: true
      }
    ]
  })

  // 打印测试信息
  console.log("mars3d的Map主对象构造完成", map)
  console.log("其中Cesium原生的Cesium.Viewer为", map.viewer)

  return map
}
