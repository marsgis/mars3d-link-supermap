import * as mars3d from "mars3d"

export let map

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: {
      lat: 28.440864,
      lng: 119.486477,
      alt: 588.23,
      heading: 268.6,
      pitch: -37.8,
      roll: 359.8
    },
    fxaa: true,
    requestRenderMode: true // 显式渲染
  },
  control: {
    infoBox: false
  },
  layers: []
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  globalNotify("已知问题提示", `当前使用的是原生Cesium+SuperMap3D插件方式，很多API不支持，完整方式需要参考Github开源代码切换Cesium到超图版Cesium。`)

  // showMaxNiaochaoDemo()
  showQxSuofeiyaDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  removeLayer()
  map = null
}
let s3mLayer

function removeLayer() {
  if (s3mLayer) {
    map.basemap = 2021 // 切换到默认影像底图

    map.removeLayer(s3mLayer, true)
    s3mLayer = null
  }
}

// 示例：人工建模 鸟巢
export function showMaxNiaochaoDemo() {
  removeLayer()

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "鸟巢",
    url: "http://www.supermapol.com/realspace/services/3D-OlympicGreen/rest/realspace",
    flyTo: true
  })
  map.addLayer(s3mLayer)

  // 可以绑定Popup弹窗，回调方法中任意处理
  // s3mLayer.bindPopup(function (event) {
  //   var attr = event.graphic.attr;
  //   // attr["视频"] = `<video src='//data.mars3d.cn/file/video/lukou.mp4' controls autoplay style="width: 300px;" ></video>`;
  //   return mars3d.Util.getTemplateHtml({ title: "石化工厂", template: "all", attr: attr });
  // });

  // 单击事件
  // s3mLayer.on(mars3d.EventType.click, function (event) {
  //   console.log("单击了3dtiles图层", event);
  // });
}

// 示例：人工建模 CBD
export function showMaxCBDDemo() {
  removeLayer()

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "人工建模CBD",
    url: "http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace",
    flyTo: true
  })
  map.addLayer(s3mLayer)
}

// 示例：  地下管网
export function showMaxPipeDemo() {
  removeLayer()
  globalMsg("插件版暂不支持 “fillForeColor” 参数的修改")

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "地下管网",
    url: "http://www.supermapol.com/realspace/services/3D-pipe/rest/realspace",
    center: { lat: 45.768407, lng: 126.621981, alt: 101, heading: 162, pitch: -38 },
    flyTo: true
  })
  map.addLayer(s3mLayer)

  // 加载完成Promise
  s3mLayer.readyPromise.then(function (s3mLayer) {
    console.log("s3m模型加载完成", s3mLayer)

    const layers = s3mLayer.layer

    const overGroundLayer = layers[25]
    overGroundLayer.style3D.fillForeColor.alpha = 0.5

    // for (var i = 0; i < layers.length; i++) {
    //   var layerName = layers[i].name;
    //   if (
    //     layerName === "雨水井盖" ||
    //     layerName === "消防水井盖" ||
    //     layerName === "中水井盖" ||
    //     layerName === "生活水井盖" ||
    //     layerName === "路灯井盖"
    //   ) {
    //     layers[i].setPBRMaterialFromJSON("./data/pbr/showUnderGround/jing2/UnityUDBJG2.json");
    //   }

    //   if (
    //     layerName === "中水管线" ||
    //     layerName === "雨水管线" ||
    //     layerName === "消防水管线" ||
    //     layerName === "生活水管线" ||
    //     layerName === "路灯管线"
    //   ) {
    //     layers[i].setPBRMaterialFromJSON("./data/pbr/showUnderGround/piple.json");
    //   }
    // }
  })
}

// 示例：BIM
export function showBIMQiaoDemo() {
  removeLayer()

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "BIM桥梁",
    url: "http://www.supermapol.com/realspace/services/3D-BIMMoXing/rest/realspace",
    center: { lat: 40.234379, lng: 116.148777, alt: 223, heading: 331, pitch: -19 },
    flyTo: true
  })
  map.addLayer(s3mLayer)

  // 加载完成Promise
  s3mLayer.readyPromise.then(function (s3mLayer) {
    console.log("s3m模型加载完成", s3mLayer)

    const layers = s3mLayer.layer
    for (const layer of layers) {
      // 设置边框线
      layer.style3D.lineWidth = 0.5
      layer.style3D.lineColor = new Cesium.Color(60 / 255, 60 / 255, 60 / 255, 1)
      layer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame
      layer.wireFrameMode = Cesium.WireFrameType?.EffectOutline
    }
  })
}

// 示例：倾斜摄影 哈尔滨索菲亚教堂
export function showQxSuofeiyaDemo() {
  removeLayer()

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "哈尔滨索菲亚教堂",
    type: "supermap_s3m",
    url: "http://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace",
    s3mOptions: {
      selectEnabled: false
    },
    position: { alt: 140 },
    center: { lat: 45.769034, lng: 126.623702, alt: 291, heading: 250, pitch: -36 },
    flyTo: true
  })
  map.addLayer(s3mLayer)

  // 事件
  s3mLayer.on(mars3d.EventType.load, function (event) {
    console.log("s3m模型加载完成", event)
  })
}

// 示例：倾斜摄影 萨尔茨堡
export function showQxSrsbDemo() {
  removeLayer()

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "萨尔茨堡",
    url: "http://www.supermapol.com/realspace/services/3D-srsb/rest/realspace",
    // position: { alt: 400 },
    center: { lat: 47.803782, lng: 13.04465, alt: 582, heading: 0, pitch: -40 },
    flyTo: true
  })
  map.addLayer(s3mLayer)

  // 加载完成Promise
  s3mLayer.readyPromise.then(function (s3mLayer) {
    console.log("s3m模型加载完成", s3mLayer)

    // 查找水面图层
    // var waterLayer = s3mLayer.layer[1];
    // var style = new Cesium.Style3D();
    // style.bottomAltitude = 5; //设置水面图层的底部高程，确保水面与模型贴合
    // waterLayer.style3D = style;
  })
}
