import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 22.126801, lng: 119.173814, alt: 4100099, heading: 351, pitch: -74 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/mapvchina.json" })
    .then(function (data) {
      createMapvLayer(data)
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

// 创建mapv图层
function createMapvLayer(geojson) {
  const geojsonDataSet = this.mapv.geojson.getDataSet(geojson)

  const to = "北京"
  const qianxi = new this.mapv.DataSet([
    {
      from: "河北",
      count: 354551,
      to: to
    },
    {
      from: "天津",
      count: 97323,
      to: to
    },
    {
      from: "山东",
      count: 28664,
      to: to
    },
    {
      from: "山西",
      count: 16650,
      to: to
    },
    {
      from: "辽宁",
      count: 14379,
      to: to
    },
    {
      from: "河南",
      count: 10980,
      to: to
    },
    {
      from: "内蒙古自治区",
      count: 9603,
      to: to
    },
    {
      from: "江苏",
      count: 4536,
      to: to
    },
    {
      from: "上海",
      count: 3556,
      to: to
    },
    {
      from: "广东",
      count: 2600,
      to: to
    }
  ])

  const lineData = []
  const pointData = []
  const textData = []
  const timeData = []

  const citys = {}

  const qianxiData = qianxi.get()
  for (let i = 0; i < qianxiData.length; i++) {
    const fromCenter = this.mapv.utilCityCenter.getCenterByCityName(qianxiData[i].from)
    const toCenter = this.mapv.utilCityCenter.getCenterByCityName(qianxiData[i].to)
    if (!fromCenter || !toCenter) {
      continue
    }
    citys[qianxiData[i].from] = qianxiData[i].count
    citys[qianxiData[i].to] = 100
    pointData.push({
      geometry: {
        type: "Point",
        coordinates: [fromCenter.lng, fromCenter.lat]
      }
    })
    pointData.push({
      geometry: {
        type: "Point",
        coordinates: [toCenter.lng, toCenter.lat]
      }
    })
    textData.push({
      geometry: {
        type: "Point",
        coordinates: [fromCenter.lng, fromCenter.lat]
      },
      text: qianxiData[i].from
    })
    textData.push({
      geometry: {
        type: "Point",
        coordinates: [toCenter.lng, toCenter.lat]
      },
      text: qianxiData[i].to
    })

    const curve = this.mapv.utilCurve.getPoints([fromCenter, toCenter])

    for (let j = 0; j < curve.length; j++) {
      timeData.push({
        geometry: {
          type: "Point",
          coordinates: curve[j]
        },
        count: 1,
        time: j
      })
    }

    lineData.push({
      geometry: {
        type: "LineString",
        coordinates: curve
        // coordinates: [[fromCenter.lng, fromCenter.lat], [toCenter.lng, toCenter.lat]]
      },
      count: 30 * Math.random()
    })
  }

  const data = geojsonDataSet.get({
    filter: function (item) {
      if (!citys[item.name]) {
        return false
      }

      item.count = citys[item.name]
      return true
    }
  })

  const geojsonOptions = {
    gradient: {
      0: "rgba(55, 50, 250, 0.4)",
      1: "rgba(55, 50, 250, 1)"
    },
    max: 354551,
    draw: "intensity",
    depthTest: false,
    data: data // 数据
  }
  const mapVLayer = new mars3d.layer.MapVLayer(geojsonOptions) // 创建MapV图层
  map.addLayer(mapVLayer)

  const textOptions = {
    draw: "text",
    font: "14px Arial",
    fillStyle: "white",
    shadowColor: "yellow",
    shadowBlue: 10,
    zIndex: 11,
    shadowBlur: 10,
    data: textData // 数据
  }
  const textmapVLayer = new mars3d.layer.MapVLayer(textOptions) // 创建MapV图层
  map.addLayer(textmapVLayer)

  const lineOptions = {
    strokeStyle: "rgba(255, 250, 50, 0.8)",
    shadowColor: "rgba(255, 250, 50, 1)",
    shadowBlur: 20,
    lineWidth: 2,
    zIndex: 100,
    draw: "simple",
    data: lineData // 数据
  }
  const linemapVLayer = new mars3d.layer.MapVLayer(lineOptions) // 创建MapV图层
  map.addLayer(linemapVLayer)

  const pointOptions = {
    fillStyle: "rgba(254,175,3,0.7)",
    shadowColor: "rgba(55, 50, 250, 0.5)",
    shadowBlur: 10,
    size: 5,
    zIndex: 10,
    draw: "simple",
    data: pointData // 数据
  }
  const pointmapVLayer = new mars3d.layer.MapVLayer(pointOptions) // 创建MapV图层
  map.addLayer(pointmapVLayer)

  const timeOptions = {
    fillStyle: "rgba(255, 250, 250, 0.5)",
    zIndex: 200,
    size: 2.5,
    animation: {
      type: "time",
      stepsRange: {
        start: 0,
        end: 50
      },
      trails: 10,
      duration: 2
    },
    draw: "simple",
    data: timeData // 数据
  }
  const timemapVLayer = new mars3d.layer.MapVLayer(timeOptions) // 创建MapV图层
  map.addLayer(timemapVLayer)
}
