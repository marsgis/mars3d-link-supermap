import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.773622, lng: 117.077444, alt: 5441, heading: 359, pitch: -57 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true // 是否显示时间线控件
  }
}

export const eventTarget = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 演示数据的时间
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2020-11-25 10:10:00"))

  // 加载车辆
  mars3d.Util.fetchJson({
    url: "//data.mars3d.cn/file/apidemo/car-list.json"
  })
    .then(function (res) {
      const tableData = res.data
      eventTarget.fire("carList", { tableData })
      showCarList(tableData)
    })
    .catch(function () {
      globalMsg("查询信息失败")
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

const colors = [
  "rgb(40, 40, 255)",
  "rgb(0, 88, 176)",
  "rgb(0, 128, 255)",
  "rgb(0, 217, 0)",
  "rgb(0, 151, 0)",
  "rgb(255, 199, 83)",
  "rgb(255, 144, 30)",
  "rgb(202, 101, 0)",
  "rgb(255, 0, 0)"
]

function showCarList(arr) {
  console.log("加载" + arr.length + "条")

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 鼠标移入提示信息
  graphicLayer.bindTooltip(function (event) {
    const attr = event.graphic?.attr
    if (!attr) {
      return
    }
    return `车辆编号：${attr.id}<br />车牌号码：${attr.name}`
  })

  // 单击地图空白处
  map.on(mars3d.EventType.clickMap, function (event) {
    if (lastClickCar) {
      lastClickCar.circle.show = false
      lastClickCar = null
    }
  })

  // 绑定点击事件
  graphicLayer.on(mars3d.EventType.click, (event, position) => {
    const car = event.graphic
    console.log("单击了车辆", car)

    if (lastClickCar) {
      if (lastClickCar === car) {
        return
      } // 重复单击，跳出
      lastClickCar.circle.show = false
      lastClickCar = null
    }

    car.circle.show = true
    lastClickCar = car

    // 视角定位下
    // car.flyToPoint({ radius: 1000 })
  })

  let lastClickCar

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    item.show = true
    let modelParam
    switch (item.type) {
      case 1:
        modelParam = {
          scale: 2,
          url: "//data.mars3d.cn/gltf/mars/car/tufangche.glb"
        }
        break
      case 2:
        modelParam = {
          scale: 1,
          url: "//data.mars3d.cn/gltf/mars/car/wajueji.glb"
        }
        break
      default:
    }

    const car = new mars3d.graphic.Route({
      id: item.id,
      name: item.name,
      model: {
        ...modelParam,
        clampToGround: true
      },
      circle: {
        radius: 50,
        materialType: mars3d.MaterialType.CircleWave,
        materialOptions: {
          color: "#ffff00",
          opacity: 0.3,
          speed: 10,
          count: 3,
          gradient: 0.1
        },
        clampToGround: true,
        show: false
      },
      polyline: {
        color: colors[i],
        width: 2,
        clampToGround: true,
        maxDistance: 500
      },
      attr: item
    })
    graphicLayer.addGraphic(car)
  }

  // 定时获取卡车和铲车的列表数据
  createPath()
}

// 取轨迹数据的时间间隔（单位：秒）
const timeStep = 10
let lastTime

// 首次获取并创建轨迹
function createPath() {
  // 取数据的时间范围，结束时间
  const date = Cesium.JulianDate.toDate(map.clock.currentTime)
  const endTime = mars3d.Util.formatDate(date, "yyyy-MM-dd HH:mm:ss")

  // 修改当前时间回退一分钟，因为数据永远是当前时间之前的。
  date.setSeconds(date.getSeconds() - 60)
  map.clock.currentTime = window.Cesium.JulianDate.fromDate(date)

  // 取数据的时间范围，开始时间
  date.setMinutes(date.getMinutes() - 10) // 初次取一定时间内的数据
  const beginTime = mars3d.Util.formatDate(date, "yyyy-MM-dd HH:mm:ss")

  // 记录最后一次读取数据的时间
  lastTime = endTime

  // 取数据
  getPathList(beginTime, endTime)

  // 定时更新
  setInterval(() => {
    updatePath()
  }, timeStep * 1000)
}

// 后续更新轨迹
function updatePath() {
  const beginTime = lastTime

  const date = new Date(beginTime)
  date.setSeconds(date.getSeconds() + timeStep)
  const endTime = mars3d.Util.formatDate(date, "yyyy-MM-dd HH:mm:ss")

  lastTime = endTime

  // 取数据
  getPathList(beginTime, endTime)
}

// 读取车辆gps坐标路径的接口
function getPathList(beginTime, endTime) {
  mars3d.Util.fetchJson({
    url: "//data.mars3d.cn/file/apidemo/car-path.json"
  })
    .then((res) => {
      const listALL = res.data || []
      // 因为读取静态json，为了演示动态，筛选数据内符合时间范围内的数据。
      // 真实接口中可以注释下面代码。
      const d_beginTime = new Date(beginTime)
      const d_endTime = new Date(endTime)
      const list = listALL.filter((item) => {
        const thistime = new Date(item.time)
        return thistime >= d_beginTime && thistime <= d_endTime
      })

      const path = `${endTime} 获取到 ${list.length} 条GPS坐标记录`

      eventTarget.fire("showPath", { path })

      // 循环车辆
      graphicLayer.eachGraphic((car) => {
        // 取出对应车辆的轨迹列表
        const path = list.filter((item) => {
          return item.id === car.id
        })

        path.forEach((item) => {
          const point = new mars3d.LngLatPoint(item.lon, item.lat, 0)
          car.addDynamicPosition(point, item.time)
        })
      })
    })
    .catch(() => {
      globalMsg("实时查询车辆路径信息失败，请稍候再试")
    })
}

export function onSelect(id, selected) {
  const car = graphicLayer.getGraphicById(id)
  if (!car) {
    return
  }
  if (selected) {
    car.show = true
    car.flyToPoint({ radius: 900 })
  } else {
    car.show = false
  }
}

export function onChange(data) {
  data.forEach((item) => {
    const car = graphicLayer.getGraphicById(item)
    if (car) {
      car.flyToPoint({ radius: 900 })
    }
  })
}

// 点击行
export function flyToModel(id) {
  const car = graphicLayer.getGraphicById(id)
  if (car) {
    car.flyToPoint({ radius: 900 })
  }
}
