import * as mars3d from "mars3d"

function initMap() {
  // 添加控件有2种方式:

  const map = new mars3d.Map("mars3dContainer", {
    scene: {
      center: { lat: 33.938752, lng: 103.753712, alt: 18401000, heading: 0, pitch: -90 }
    },
    // 方式1：在创建地球前的传参中配置control参数
    control: {
      // 以下是Cesium.Viewer所支持的控件相关的options
      baseLayerPicker: true, // basemaps底图切换按钮
      homeButton: true, // 视角复位按钮
      sceneModePicker: true, // 二三维切换按钮
      navigationHelpButton: true, // 帮助按钮
      infoBox: false, // 信息框
      selectionIndicator: true, // 选择框
      vrButton: true, // vr模式按钮
      fullscreenButton: true, // 全屏按钮
      animation: true, // 动画部件按钮
      timeline: true, // 时间线

      // 以下是mars3d.control定义的控件
      contextmenu: { hasDefault: true },
      mouseDownView: true,
      zoom: { insertIndex: 1 },
      compass: { top: "10px", left: "5px" },
      distanceLegend: { left: "100px", bottom: "2px" }
    },
    basemaps: [
      {
        name: "单张图片",
        icon: "img/basemaps/offline.png",
        type: "image",
        url: "//data.mars3d.cn/file/img/world/world.jpg",
        show: true
      }
    ]
  })
  map.toolbar.style.bottom = "120px" // 修改toolbar控件的样式

  // 方式2：在创建地球后按需调用addControl添加(直接new对应type类型的控件)
  const locationBar = new mars3d.control.LocationBar({
    fps: true,
    template:
      "<div>经度:{lng}</div> <div>纬度:{lat}</div> <div>海拔：{alt}米</div> <div>层级：{level}</div><div>方向：{heading}度</div> <div>俯仰角：{pitch}度</div><div>视高：{cameraHeight}米</div>"
  })
  map.addControl(locationBar)

  console.log("地图上已有控件", map.controls)
}
