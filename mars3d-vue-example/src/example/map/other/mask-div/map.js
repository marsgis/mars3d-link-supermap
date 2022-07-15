import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.795863, lng: 117.212909, alt: 2113, heading: 25, pitch: -34 }
  },
  layers: [
    {
      pid: 2040,
      type: "3dtiles",
      name: "合肥市区2",
      url: "//data.mars3d.cn/3dtiles/jzw-hefei2/tileset.json",
      maximumScreenSpaceError: 1,
      maximumMemoryUsage: 1024,
      style: {
        color: {
          conditions: [["true", "color('rgba(42, 160, 224, 1)')"]]
        }
      },
      marsJzwStyle: true,
      highlight: { type: "click", color: "#FFFF00" },
      popup: "all",
      show: true
    },
    {
      type: "geojson",
      name: "道路线",
      url: "//data.mars3d.cn/file/geojson/hefei-road.json",
      symbol: {
        styleOptions: {
          width: 12,
          materialType: "PolylineGlow",
          materialOptions: {
            glowPower: 0.2,
            color: "#FF4500",
            opacity: 0.8
          }
        }
      },
      popup: "{name}",
      show: true
    },
    {
      type: "geojson",
      name: "河流(面状)",
      url: "//data.mars3d.cn/file/geojson/hefei-water.json",
      symbol: {
        type: "waterC",
        styleOptions: {
          normalMap: "img/textures/waterNormals.jpg", // 水正常扰动的法线图
          frequency: 5000.0, // 控制波数的数字。
          animationSpeed: 0.05, // 控制水的动画速度的数字。
          amplitude: 9.0, // 控制水波振幅的数字。
          specularIntensity: 0.8, // 控制镜面反射强度的数字。
          baseWaterColor: "#00baff", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
          blendColor: "#00baff" // 从水中混合到非水域时使用的rgba颜色对象。
        }
      },
      popup: "{name}",
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance
  map.basemap = 2017 // 切换至蓝色底图

  maskDiv()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 添加蒙版
function maskDiv() {
  const maskDiv = document.createElement("div")
  maskDiv.style.cssText = `
      position: absolute;
      top:0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
      background-image:
      radial-gradient(rgba(139, 138, 138, 0.219) 50%, rgba(65, 57, 57, 0.658) 70%, rgba(17, 16, 16, 1) 90%);
      `
  document.body.appendChild(maskDiv)
}
