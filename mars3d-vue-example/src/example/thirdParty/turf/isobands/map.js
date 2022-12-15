import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export const mapOptions = {
  scene: {
    center: { lat: 23.359088, lng: 116.19963, alt: 1262727, heading: 2, pitch: -60 }
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
  map = mapInstance // 记录map

  map.imageryLayers._layers.forEach(function (layer, index, arr) {
    layer.brightness = 0.4
  })

  // 加载气象
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/windpoint.json" })
    .then(function (res) {
      showWindLine(res.data)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

const colors = ["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"]
const breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 99] // 等值面的级数

// 等值线面
function showWindLine(arr) {
  const pointGrid = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    pointGrid.push({
      type: "Feature",
      properties: item,
      geometry: {
        type: "Point",
        coordinates: [item.x, item.y]
      }
    })
  }

  const points = {
    type: "FeatureCollection",
    features: pointGrid
  }

  // 如果下面没有展示，可能是数据精度不够，可以取消下面注释，对数据插值。
  // turf.interpolate() 提供了基于 IDW（反距离权重）算法的将数据插值为格点的方法。
  // 插值的精度是由第二个参数与 interpolate_options.units 共同决定的，单位支持 degrees, radians, miles, or kilometers，
  // IDW 要为每个格点计算所有散点的权重，计算规模是 (散点数 * 格点数)，所以要在精度与性能间做好平衡。

  // points = turf.interpolate(points, 10, {
  //   gridType: 'point', // 'square' | 'point' | 'hex' | 'triangle'
  //   property: 'speed',
  //   units: 'kilometers', // degrees, radians, miles, or kilometers
  //   weight: 1
  // })
  // points.features.map((i) => (i.properties.speed = Number(i.properties.speed.toFixed(2)))) // 适当降低插值结果的精度便于显示

  // 等值面
  const geojsonPoly = turf.isobands(points, breaks, {
    zProperty: "speed"
  })

  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "等值面",
    data: geojsonPoly,
    popup: "{speed}",
    symbol: {
      styleOptions: {
        fill: true, // 是否填充
        color: "#ffff00", // 颜色
        opacity: 0.7 // 透明度
      },
      callback: function (attr, styleOpt) {
        // 得到点的权重，计算落在那个色度带
        const val = Number(attr.speed.split("-")[0] || 0)
        const color = getColor(val)
        return {
          color: color
        }
      }
    }
  })
  map.addLayer(geoJsonLayer)

  // 等值线
  const geojsonLine = turf.isolines(points, breaks, {
    zProperty: "speed"
  })

  // 进行平滑处理
  // let features = geojsonLine.features;
  // for (let i = 0; i < features.length; i++) {
  //     let _coords = features[i].geometry.coordinates;
  //     let _lCoords = [];
  //     for (let j = 0; j < _coords.length; j++) {
  //         let _coord = _coords[j];
  //         let line = turf.lineString(_coord);
  //         let curved = turf.bezierSpline(line);
  //         _lCoords.push(curved.geometry.coordinates);
  //     }
  //     features[i].geometry.coordinates = _lCoords;
  // }

  const layerDZX = new mars3d.layer.GeoJsonLayer({
    name: "等值线",
    data: geojsonLine,
    popup: "{speed}",
    symbol: {
      styleOptions: {
        width: 2, // 边框宽度
        color: "#000000", // 边框颜色
        opacity: 0.5, // 边框透明度
        clampToGround: false // 是否贴地
      }
    }
  })
  map.addLayer(layerDZX)
}

function getColor(value) {
  for (let i = 0; i < breaks.length; i++) {
    if (breaks[i] === value) {
      return colors[i]
    }
  }
  return colors[0]
}
