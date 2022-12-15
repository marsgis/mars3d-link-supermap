import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -89 },
    scene3DOnly: true,
    contextOptions: {
      requestWebgl2: false
    }
  },
  control: {
    sceneModePicker: false
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
  map.basemap = 2017 // 蓝色底图

  map.mouseEvent.enabledMoveTarget = false // 是否开启鼠标移动事件的拾取矢量数据

  // map.scene.globe.showGroundAtmosphere = false// 关闭大气层
  // map.scene.skyAtmosphere.show = true
  // map.scene.fog.enabled = true
  // map.scene.fog.density = 0.00005 // 地面 0.00005 海底0.00008
  // map.scene.fog.minimumBrightness = 0.03 // 0.03

  // map.scene.skyAtmosphere.hueShift = 0.0
  // map.scene.skyAtmosphere.saturationShift = 0.1
  // map.scene.skyAtmosphere.brightnessShift = 0.08 // 地面0.08 海底

  addLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let windLayer
function addLayer() {
  windLayer = new mars3d.layer.WindLayer({
    particlesNumber: 9000,
    fadeOpacity: 0.996,
    dropRate: 0.003,
    dropRateBump: 0.01,
    speedFactor: 0.2,
    lineWidth: 4.0,
    // 色带配置
    colors: [
      "rgb(4,14,216)",
      "rgb(32,80,255)",
      "rgb(65,150,255)",
      "rgb(109,193,255)",
      "rgb(134,217,255)",
      "rgb(156,238,255)",
      "rgb(175,245,255)",
      "rgb(206,255,255)",
      "rgb(255,254,71)",
      "rgb(255,235,0)",
      "rgb(255,196,0)",
      "rgb(255,144,0)",
      "rgb(255,72,0)",
      "rgb(255,0,0)",
      "rgb(213,0,0)",
      "rgb(158,0,0)"
    ]
  })
  map.addLayer(windLayer)

  loadNetCDF("//data.mars3d.cn/file/apidemo/wind.nc").then((data) => {
    windLayer.setData(data)
  })
}

let canrefresh

// 参数调整面板
export function onParticleSystemOptionsChange(options) {
  clearTimeout(canrefresh)
  canrefresh = setTimeout(() => {
    windLayer.setOptions(options)
  }, 500)
}

// 加载并解析NC数据
function loadNetCDF(filePath) {
  return new Promise(function (resolve) {
    const request = new XMLHttpRequest()
    request.open("GET", filePath)
    request.responseType = "arraybuffer"

    request.onload = function () {
      const arrayToMap = function (array) {
        return array.reduce(function (map, object) {
          map[object.name] = object
          return map
        }, {})
      }

      // eslint-disable-next-line new-cap
      const NetCDF = new netcdfjs(request.response)
      const variables = arrayToMap(NetCDF.variables)
      const uAttributes = arrayToMap(variables.U.attributes)
      const vAttributes = arrayToMap(variables.V.attributes)

      const arrLon = NetCDF.getDataVariable("lon").flat()
      const arrLat = NetCDF.getDataVariable("lat").flat()
      const arrU = NetCDF.getDataVariable("U").flat()
      const maxU = uAttributes.max.value
      const minU = uAttributes.min.value
      const arrV = NetCDF.getDataVariable("V").flat()
      const maxV = vAttributes.max.value
      const minV = vAttributes.min.value

      // 构造WindLayer类需要的格式数据
      const result = {
        xmin: Math.min(...arrLon),
        xmax: Math.max(...arrLon),
        ymin: Math.min(...arrLat),
        ymax: Math.max(...arrLat),
        rows: arrLat.length,
        cols: arrLon.length,
        udata: arrU, // 横向风速
        vdata: arrV, // 纵向风速
        umin: minU,
        umax: maxU,
        vmin: minV,
        vmax: maxV
      }
      resolve(result)
    }
    request.send()
  })
}

// 改变颜色
export function changeColor(color) {
  windLayer.colors = [color]
}
