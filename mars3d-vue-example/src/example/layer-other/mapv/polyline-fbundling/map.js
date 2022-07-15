import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.808307, lng: 110.597446, alt: 7852846, heading: 353, pitch: -86 }
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

  // 创建mapv图层
  createMapvLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function createMapvLayer() {
  const nodeData = {
    0: {
      x: 108.154518,
      y: 36.643346
    },
    1: {
      x: 121.485124,
      y: 31.235317
    }
  }

  const edgeData = [
    {
      source: "1",
      target: "0"
    }
  ]

  const citys = [
    "北京",
    "天津",
    "上海",
    "重庆",
    "石家庄",
    "太原",
    "呼和浩特",
    "哈尔滨",
    "长春",
    "沈阳",
    "济南",
    "南京",
    "合肥",
    "杭州",
    "南昌",
    "福州",
    "郑州",
    "武汉",
    "长沙",
    "广州",
    "南宁",
    "西安",
    "银川",
    "兰州",
    "西宁",
    "乌鲁木齐",
    "成都",
    "贵阳",
    "昆明",
    "拉萨",
    "海口"
  ]

  // 自定义数据
  for (let i = 1; i < 500; i++) {
    const cityCenter = this.mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)])
    nodeData[i] = {
      x: cityCenter.lng - 5 + Math.random() * 10,
      y: cityCenter.lat - 5 + Math.random() * 10
    }
    edgeData.push({
      source: ~~(i * Math.random()),
      target: "0"
    })
  }

  const fbundling = this.mapv.utilForceEdgeBundling().nodes(nodeData).edges(edgeData)

  const results = fbundling()

  const data = []
  const timeData = []

  for (let i = 0; i < results.length; i++) {
    const line = results[i]
    const coordinates = []
    for (let j = 0; j < line.length; j++) {
      coordinates.push([line[j].x, line[j].y])
      timeData.push({
        geometry: {
          type: "Point",
          coordinates: [line[j].x, line[j].y]
        },
        count: 1,
        time: j
      })
    }
    data.push({
      geometry: {
        type: "LineString",
        coordinates: coordinates
      }
    })
  }

  const options1 = {
    strokeStyle: "rgba(55, 50, 250, 0.3)",
    globalCompositeOperation: "lighter",
    shadowColor: "rgba(55, 50, 250, 0.5)",
    shadowBlur: 10,
    lineWidth: 1.0,
    draw: "simple",
    data: data // 数据
  }

  // 创建MapV图层
  const mapVLayer1 = new mars3d.layer.MapVLayer(options1)
  map.addLayer(mapVLayer1)


  const options2 = {
    fillStyle: "rgba(255, 250, 250, 0.9)",
    globalCompositeOperation: "lighter",
    size: 1.5,
    animation: {
      type: "time",
      stepsRange: {
        start: 0,
        end: 100
      },
      trails: 1,
      duration: 5
    },
    draw: "simple",
    data: timeData // 数据
  }

  // 创建MapV图层
  const mapVLayer2 = new mars3d.layer.MapVLayer(options2)
  map.addLayer(mapVLayer2)

}
