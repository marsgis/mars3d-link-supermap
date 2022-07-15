import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
let allCount
let lastSelectWX

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.646563, lng: 96.25028, alt: 150004581, heading: 352, pitch: -90 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1,
      maximumZoomDistance: 500000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    },
    clock: {
      multiplier: 2 // 速度
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
  },
  terrain: false
}
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式

  // 修改天空盒
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

  // 访问后端接口，取数据
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tle.json" })
    .then(function (arr) {
      initData(arr.list)
    })
    .catch(function () {
      globalMsg("获取空间目标轨道数据异常！")
    })

  // 单击地图空白处
  map.on(mars3d.EventType.clickMap, function (event) {
    if (lastSelectWX) {
      // 重置上次选中的轨道样式
      lastSelectWX.remove()
      lastSelectWX = null
    }
    eventTarget.fire("clickMap")
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function initData(arr) {
  allCount = arr.length
  globalMsg("当前外太空物数量: " + allCount)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const countryNumber = { 美国: 1, 前苏联: 1, 中国: 1, 英国: 1, 法国: 1, 加拿大: 1, 澳大利亚: 1, 日本: 1, 印度: 1 }
  const yearNumber = {}
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    const style = {
      pixelSize: 5,
      color: "rgba(0,255,0,0.6)",
      outlineWidth: 1,
      outlineColor: "#000000",
      scaleByDistance: new Cesium.NearFarScalar(20000000, 1.0, 150000000, 0.4)
    }

    // 转为属性，方便使用
    if (item.info) {
      item.type = item.info[0] // 对象类型
      item.status = item.info[1] // 操作状态代码
      item.country = item.info[2] // 所有权(国家)
      item.launchDate = item.info[3] && new Date(item.info[3]) // 发射日期
      item.launchSite = item.info[4] // 发射地点
      item.decayDate = item.info[5] // 衰减日期
      item.period = item.info[6] // 轨道周期[分钟]
      item.inclination = item.info[7] // 倾角[度]
      item.apogee = item.info[8] // 远地点高度[公里]
      item.perigee = item.info[9] // 近地点高度[公里]
      item.rcs = item.info[10] // 雷达截面
      // item.dataStatus = item.info[11]; // 数据状态码
      item.orbitCenter = item.info[12] // 轨道中心
      item.orbitType = item.info[13] // 轨道类型

      delete item.info
    }

    // 获取所有的国家数量
    if (countryNumber[getCountryName(item.country)]) {
      countryNumber[getCountryName(item.country)]++
    }
    // 获取所有的年份
    if (yearNumber[new Date(item.launchDate).getFullYear()]) {
      yearNumber[new Date(item.launchDate).getFullYear()]++
    } else {
      yearNumber[new Date(item.launchDate).getFullYear()] = 1
    }

    const graphic = new mars3d.graphic.PointPrimitive({
      id: item.id,
      style: style,
      attr: item
    })
    graphicLayer.addGraphic(graphic)
  }

  // 在面板加载 echars 图表
  eventTarget.fire("loadEchartsData", { allCount, countryNumber, yearNumber })

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了卫星", event)
    const satelliteObj = event.graphic

    if (lastSelectWX) {
      // 重置上次选中的轨道样式
      lastSelectWX.remove()
      lastSelectWX = null
    }
    if (satelliteObj) {
      const item = satelliteObj.attr
      if (!item.name) {
        return
      }

      let launchDate, status, country, launchSite
      if (item.launchDate) {
        launchDate = mars3d.Util.formatDate(item.launchDate, "yyyy-MM-dd")
      }
      if (item.status) {
        status = getStatusName(item.status)
      } else {
        status = ""
      }
      if (item.country) {
        country = getCountryName(item.country)
      }
      if (item.launchSite) {
        launchSite = getLaunchSiteName(item.launchSite)
      }
      const period = mars3d.Util.formatNum(item.period, 2) + " 分钟"
      const inclination = item.inclination + "°"
      const apogee = mars3d.Util.formatNum(item.apogee, 0) + " km"
      const perigee = mars3d.Util.formatNum(item.perigee, 0) + " km"

      const inhtml = `<a href="https://www.n2yo.com/satellite/?s=${item.id}" target="_blank">N2YO...</a>`

      const weixinList = [
        item.name,
        item.id,
        item.cospar,
        item.type,
        status,
        country,
        launchDate,
        launchSite,
        period,
        inclination,
        apogee,
        perigee,
        item.rcs || "未知",
        item.orbitCenter,
        item.orbitType,
        inhtml
      ]

      eventTarget.fire("clickWeixin", { weixinList })

      weixingStyle(item)
    }
  })

  initWorker(arr)
}

// 采用多线程来计算卫星位置
let worker
function initWorker(arr) {
  worker = new Worker(window.currentPath + "tleWorker.js") // currentPath为当前目录，内置在示例框架中
  worker.onmessage = function (event) {
    const time = event.data.time
    const positionObj = event.data.positionObj

    for (const id in positionObj) {
      const item = positionObj[id]
      if (!item) {
        continue
      }

      const graphic = graphicLayer.getGraphicById(id)
      if (graphic) {
        graphic.position = new Cesium.Cartesian3(item.x, item.y, item.z)
      }
    }

    // 循环继续发送请求消息
    postWorkerMessage(arr)
  }

  // 主线程调用worker.postMessage()方法，向 Worker 发消息。
  postWorkerMessage(arr)
}

function postWorkerMessage(arr) {
  // 取数据的时间范围，开始时间
  const date = Cesium.JulianDate.toDate(map.clock.currentTime)

  // 主线程调用worker.postMessage()方法，向 Worker 发消息。
  worker.postMessage({
    time: date,
    list: arr
  })
}

function weixingStyle(item) {
  // 高亮选中的轨道样式
  const weixin = new mars3d.graphic.Satellite({
    tle1: item.tle1,
    tle2: item.tle2,
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      autoHeading: true,
      minimumPixelSize: 50,
      show: !!item.name
    },
    label: {
      color: "#ffffff",
      opacity: 1,
      font_family: "楷体",
      font_size: 30,
      outline: true,
      outlineColor: "#000000",
      outlineWidth: 3,
      background: true,
      backgroundColor: "#000000",
      backgroundOpacity: 0.5,
      font_weight: "normal",
      font_style: "normal",
      pixelOffsetX: 0,
      pixelOffsetY: -20,
      scaleByDistance: true,
      scaleByDistance_far: 10000000,
      scaleByDistance_farValue: 0.4,
      scaleByDistance_near: 100000,
      scaleByDistance_nearValue: 1,
      show: true
    },
    path: {
      show: true,
      color: "#e2e2e2",
      opacity: 0.8,
      width: 1
    }
  })
  map.graphicLayer.addGraphic(weixin)
  lastSelectWX = weixin
}

// Orbital altitude definitions.

// 重置
export function resetGraphic() {
  // 循环所有卫星
  if (!graphicLayer) {
    globalMsg("当前数据正在加载")
    return
  }
  graphicLayer.eachGraphic(function (graphic) {
    if (graphic.selected) {
      graphic.setStyle({
        color: "rgba(0,255,0,0.6)",
        outlineColor: "#000000"
      })
      graphic.selected = false
    }
  })
}

// Well known satellite constellations.
const GPS = [
  20959, 22877, 23953, 24876, 25933, 26360, 26407, 26605, 26690, 27663, 27704, 28129, 28190, 28361, 28474, 28874, 29486, 29601, 32260, 32384, 32711,
  35752, 36585, 37753, 38833, 39166, 39533, 39741, 40105, 40294, 40534
]
const GLONASS = [
  28915, 29672, 29670, 29671, 32276, 32275, 32393, 32395, 36111, 36112, 36113, 36400, 36402, 36401, 37139, 37138, 37137, 37829, 37869, 37867, 37868,
  39155, 39620, 40001
]
const INMARSAT = [20918, 21149, 21814, 21940, 23839, 24307, 24674, 24819, 25153, 28628, 28899, 33278, 40384, 39476]
const LANDSAT = [25682, 39084]
const DIGITALGLOBE = [25919, 32060, 33331, 35946, 40115]

// 判断卫星数据
export function selectSatellites(data) {
  if (!graphicLayer) {
    return
  }

  const name = data.name
  const xilie = data.selXiLie // 系列卫星
  const country = data.selCountry // 所属国家
  const type = data.selType // 对象类型

  const val1 = data.sliLaunchdate
  const min1 = 1950
  const max1 = 2022

  const val2 = data.sliPeriod
  const min2 = 0
  const max2 = 60000

  const val3 = data.sliInclination
  const min3 = 0
  const max3 = 150

  const val4 = data.sliApogee
  const min4 = 0
  const max4 = 600000

  const val5 = data.sliPerigee
  const min5 = 0
  const max5 = 500000

  const val6 = data.sliRcs
  const min6 = 0
  const max6 = 1000

  let selCount = 0

  // 循环所有卫星
  graphicLayer.eachGraphic(function (graphic) {
    // 先将所有样式还原
    if (graphic.selected) {
      graphic.setStyle({
        color: "rgba(0,255,0,0.6)",
        outlineColor: "#000000"
      })
      graphic.selected = false
    }

    const attr = graphic.attr // 卫星的属性

    // 名称
    if (name) {
      if ((attr.name && attr.name.indexOf(name) !== -1) || (attr.id && attr.id === name) || (attr.cospar && attr.cospar.indexOf(name) !== -1)) {
        //
      } else {
        return
      }
    }

    // 系列卫星时
    if (xilie) {
      let selected
      switch (xilie) {
        case "gps":
          selected = GPS.indexOf(attr.id) !== -1
          break
        case "bd":
          selected = attr.name.indexOf("BD") !== -1 || attr.name.indexOf("BEIDOU") !== -1
          break
        case "glonass":
          selected = GLONASS.indexOf(attr.id) !== -1
          break
        case "inmarsat":
          selected = INMARSAT.indexOf(attr.id) !== -1
          break
        case "landsat":
          selected = LANDSAT.indexOf(attr.id) !== -1
          break
        case "digitalglobe":
          selected = DIGITALGLOBE.indexOf(attr.id) !== -1
          break
      }
      if (!selected) {
        return
      }
    }

    // 国家
    if (country && country !== attr.country) {
      return
    }

    // 类型的判断
    if (type) {
      const name = attr.name
      if (type === "junk" && name.indexOf(" DEB") === -1 && name.indexOf(" R/B") === -1) {
        return
      }
      if (type === "satellite" && (name.indexOf(" DEB") !== -1 || name.indexOf(" R/B") !== -1)) {
        return
      }
    }

    // 滑动轨的判断
    // Launch date
    if (val1[0] !== min1 || val1[1] !== max1) {
      if (!attr.launchDate) {
        return
      }

      const y = attr.launchDate.getFullYear()
      if (y <= val1[0] || y >= val1[1]) {
        return
      }
    }

    // Orbital period
    if (val2[0] !== min2 || val2[1] !== max2) {
      if (!attr.period) {
        return
      }
      if (attr.period < val2[0] || attr.period > val2[1]) {
        return
      }
    }

    // Inclination
    if (val3[0] !== min3 || val3[1] !== max3) {
      if (!attr.inclination) {
        return
      }
      if (attr.inclination < val3[0] || attr.inclination > val3[1]) {
        return
      }
    }

    // Apogee
    if (val4[0] !== min4 || val4[1] !== max4) {
      if (!attr.apogee) {
        return
      }
      if (attr.apogee < val4[0] || attr.apogee > val4[1]) {
        return
      }
    }

    // Perigee
    if (val5[0] !== min5 || val5[1] !== max5) {
      if (!attr.perigee) {
        return
      }
      if (attr.perigee < val5[0] || attr.perigee > val5[1]) {
        return
      }
    }

    // 尺寸的判断
    if (val6[0] !== min6 || val6[1] !== max6) {
      if (!attr.rcs) {
        return
      }
      if (attr.rcs <= val6[0] || attr.rcs >= val6[1]) {
        return
      }
    }

    // 将筛选到的数据修改为红色
    if (!graphic.selected) {
      graphic.selected = true
      graphic.setStyle({
        color: "rgba(255,0,0,1.0)",
        outlineColor: "#FFFFFF"
      })
    }
    selCount++
  })

  globalMsg(`${allCount}个对象中，有 ${selCount} 个符合条件`)
}

function getStatusName(code) {
  switch (code) {
    case "+":
      return "运作的"
    case "-":
      return "非运转的"
    case "P":
      return "部分运转,部分完成主要任务或次要任务"
    case "B":
      return "备份/备用,先前运行的卫星进入储备状态"
    case "S":
      return "备用,新卫星等待完全激活"
    case "X":
      return "扩展的任务"
    case "D":
      return "衰退的"
    case "?":
      return "未知的"
  }
  return code
}

function getLaunchSiteName(code) {
  switch (code) {
    case "AFETR":
      return "美国佛罗里达州空军东部试验场"
    case "AFWTR":
      return "美国加州空军西部试验场"
    case "CAS":
      return "Canaries Airspace"
    case "DLS":
      return "俄罗斯Dombarovskiy发射场"
    case "ERAS":
      return "东部领空范围"
    case "FRGUI":
      return "法属圭亚那库鲁的欧洲太空港"
    case "HGSTR":
      return "阿尔及利亚的Hammaguira空间轨道靶场"
    case "JSC":
      return "中国酒泉航天中心"
    case "KODAK":
      return "美国阿拉斯加科迪亚克发射中心"
    case "KSCUT":
      return "日本内浦航天中心"
    case "KWAJ":
      return "美国陆军夸贾林环礁"
    case "KYMSC":
      return "俄罗斯Kapustin Yar导弹和太空综合体"
    case "NSC":
      return "韩国罗老宇航中心"
    case "PLMSC":
      return "俄罗斯普列谢茨克导弹和太空综合体"
    case "RLLB":
      return "火箭实验室发射基地"
    case "SEAL":
      return "海上发射平台(流动)"
    case "SEMLS":
      return "伊朗塞姆南卫星发射场"
    case "SMTS":
      return "伊朗沙赫鲁德导弹试验场"
    case "SNMLP":
      return "印度洋(肯尼亚)圣马可发射平台"
    case "SRILR":
      return "印度萨迪什·达万航天中心"
    case "SUBL":
      return "潜艇发射平台(移动式)"
    case "SVOBO":
      return "俄罗斯Svobodnyy发射中心"
    case "TAISC":
      return "中国太原航天中心"
    case "TANSC":
      return "日本种子岛宇宙中心"
    case "TYMSC":
      return "哈萨克斯坦秋拉坦导弹和航天中心"
    case "VOSTO":
      return "俄罗斯东方港航天器发射场"
    case "WLPIS":
      return "美国弗吉尼亚州瓦勒普斯岛"
    case "WOMRA":
      return "澳大利亚Woomera"
    case "WRAS":
      return "西方领空范围"
    case "WSC":
      return "中国文昌卫星发射场"
    case "XICLF":
      return "中国西昌发射场"
    case "YAVNE":
      return "以色列Yavne发射设施"
    case "YUN":
      return "朝鲜云松发射场"
    case "UNK":
      return "未知的"
  }
  return code
}

function getCountryName(code) {
  switch (code) {
    case "AB":
      return "阿拉伯卫星通信组织"
    case "ABS":
      return "亚洲广播卫星"
    case "AC":
      return "亚洲卫星电讯公司"
    case "ALG":
      return "阿尔及利亚"
    case "ANG":
      return "安哥拉"
    case "ARGN":
      return "阿根廷"
    case "ASRA":
      return "奥地利"
    case "AUS":
      return "澳大利亚"
    case "AZER":
      return "阿塞拜疆"
    case "BEL":
      return "比利时"
    case "BELA":
      return "白俄罗斯"
    case "BERM":
      return "百慕大"
    case "BGD":
      return "孟加拉国"
    case "BHUT":
      return "不丹王国"
    case "BOL":
      return "玻利维亚"
    case "BRAZ":
      return "巴西"
    case "BUL":
      return "保加利亚"
    case "CA":
      return "加拿大"
    case "CHBZ":
      return "中国/巴西"
    case "CHLE":
      return "智利"
    case "CIS":
      return "前苏联"
    case "COL":
      return "哥伦比亚"
    case "CRI":
      return "哥斯达黎加共和国"
    case "CZCH":
      return "捷克"
    case "DEN":
      return "丹麦"
    case "ECU":
      return "厄瓜多尔"
    case "EGYP":
      return "埃及"
    case "ESA":
      return "欧洲太空总署"
    case "ESRO":
      return "欧洲空间研究组织"
    case "EST":
      return "爱沙尼亚"
    case "EUME":
      return "欧洲气象卫星开发组织"
    case "EUTE":
      return "欧洲电信卫星组织"
    case "FGER":
      return "法国/德国"
    case "FIN":
      return "芬兰"
    case "FR":
      return "法国"
    case "FRIT":
      return "法国/意大利"
    case "GER":
      return "德国"
    case "GHA":
      return "加纳共和国"
    case "GLOB":
      return "全球星"
    case "GREC":
      return "希腊"
    case "GRSA":
      return "希腊/沙特阿拉伯"
    case "GUAT":
      return "危地马拉"
    case "HUN":
      return "匈牙利"
    case "IM":
      return "国际移动卫星组织(INMARSAT)"
    case "IND":
      return "印度"
    case "INDO":
      return "印尼"
    case "IRAN":
      return "伊朗"
    case "IRAQ":
      return "伊拉克"
    case "IRID":
      return "IRID"
    case "ISRA":
      return "以色列"
    case "ISRO":
      return "印度空间研究组织"
    case "ISS":
      return "国际空间站"
    case "IT":
      return "意大利"
    case "ITSO":
      return "国际电信卫星组织"
    case "JPN":
      return "日本"
    case "KAZ":
      return "哈萨克斯坦"
    case "KEN":
      return "肯尼亚"
    case "LAOS":
      return "老挝"
    case "LKA":
      return "斯里兰卡"
    case "LTU":
      return "立陶宛"
    case "LUXE":
      return "卢森堡"
    case "MA":
      return "摩洛哥"
    case "MALA":
      return "马来西亚"
    case "MEX":
      return "墨西哥"
    case "MMR":
      return "缅甸"
    case "MNG":
      return "蒙古"
    case "MUS":
      return "毛里求斯"
    case "NATO":
      return "北大西洋公约组织"
    case "NETH":
      return "荷兰"
    case "NICO":
      return "新图标"
    case "NIG":
      return "尼日利亚"
    case "NKOR":
      return "朝鲜"
    case "NOR":
      return "挪威"
    case "NPL":
      return "尼泊尔"
    case "NZ":
      return "新西兰"
    case "O3B":
      return "O3b Networks公司"
    case "ORB":
      return "ORBCOMM卫星公司"
    case "PAKI":
      return "巴基斯坦"
    case "PERU":
      return "秘鲁"
    case "POL":
      return "波兰"
    case "POR":
      return "葡萄牙"
    case "PRC":
      return "中国"
    case "PRY":
      return "巴拉圭"
    case "PRES":
      return "中国/欧洲航天局"
    case "QAT":
      return "卡塔尔的状态"
    case "RASC":
      return "非洲区域卫星通信组织"
    case "ROC":
      return "台湾"
    case "ROM":
      return "罗马尼亚"
    case "RP":
      return "菲律宾"
    case "RWA":
      return "卢旺达"
    case "SAFR":
      return "南非"
    case "SAUD":
      return "沙特阿拉伯"
    case "SDN":
      return "苏丹"
    case "SEAL":
      return "Sea Launch公司"
    case "SES":
      return "SES电信公司"
    case "SGJP":
      return "新加坡/日本"
    case "SING":
      return "新加坡"
    case "SKOR":
      return "韩国"
    case "SPN":
      return "西班牙"
    case "STCT":
      return "新加坡/台湾"
    case "SVN":
      return "斯洛文尼亚"
    case "SWED":
      return "瑞典"
    case "SWTZ":
      return "瑞士"
    case "TBD":
      return "待定"
    case "THAI":
      return "泰国"
    case "TMMC":
      return "土库曼斯坦/摩纳哥"
    case "TUN":
      return "突尼斯共和国"
    case "TURK":
      return "土耳其"
    case "UAE":
      return "阿拉伯联合酋长国"
    case "UK":
      return "英国"
    case "UKR":
      return "乌克兰"
    case "URY":
      return "乌拉圭"
    case "US":
      return "美国"
    case "USBZ":
      return "美国/巴西"
    case "VENZ":
      return "委内瑞拉"
    case "VTNM":
      return "越南"
    case "UNK":
      return "未知"
  }
  return code
}

// 清除卫星的点击事件,隐藏卫星的面板
export function highlightSatellite() {
  lastSelectWX.remove()
  lastSelectWX = null
}
