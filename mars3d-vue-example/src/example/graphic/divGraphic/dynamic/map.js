import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer
const centerArr = [] // 视角数组
// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.84646, lng: 117.223095, alt: 790, heading: 189, pitch: -13 },
    clock: {
      startTime: "2017/08/25 08:00:00",
      stopTime: "2017/08/25 08:01:30"
    }
  },
  control: {
    // animation: true, //是否创建 动画小器件，左下角仪表
    timeline: true // 是否显示 时间线控件
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

  // 创建DIV数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    flatHeight: 120,
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 1024,
    dynamicScreenSpaceError: true,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true
  })
  map.addLayer(tilesetLayer)

  showDitailInfo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

const arrData = [
  {
    title: "中国安徽广播电视台",
    description: "安徽广播电视台（AHTV）是集广播、电视、报纸、</br>网络、新媒体等多种业务为一体的省级广播电视综合传</br>媒机构。",
    center: { lat: 31.817346, lng: 117.216403, alt: 342, heading: 168, pitch: -13, duration: 2 },
    position: [117.219971, 31.808482, 264.9],
    startTime: "2017/08/25 08:00:04",
    endTime: "2017/08/25 08:00:07"
  },
  {
    title: "合肥市政务中心",
    description: "合肥市人民政府政务服务中心为市委、市政府派出机构，</br>服务中心成立党工委和管委会，内设综合处、</br>督查处、审批项目协调处",
    center: { lat: 31.818069, lng: 117.221763, alt: 173, heading: 355, pitch: -5, duration: 3 },
    position: [117.222139, 31.822782, 166.6],
    startTime: "2017/08/25 08:00:09",
    endTime: "2017/08/25 08:00:12"
  },
  {
    title: "合肥市文化旅游局",
    description: "合肥市文化和旅游局和市文化和旅游局是市政府工作部门，</br>为正处级，加挂市广播电视新闻出版局牌子",
    center: { lat: 31.813929, lng: 117.217225, alt: 142, heading: 330, pitch: -14, duration: 3 },
    position: [117.215827, 31.818229, 84.6],
    startTime: "2017/08/25 08:00:14",
    endTime: "2017/08/25 08:00:17"
  },
  {
    title: "合肥大剧院",
    description: "合肥大剧院又名天鹅湖大剧院，主要由歌剧厅、</br>音乐厅、多功能厅等部分组成。",
    center: { lat: 31.815301, lng: 117.218273, alt: 107, heading: 11, pitch: -13, duration: 3 },
    position: [117.218782, 31.8176, 64.9],
    startTime: "2017/08/25 08:00:19",
    endTime: "2017/08/25 08:00:22"
  }
]

function showDitailInfo() {
  for (let i = 0; i < arrData.length; i++) {
    // 动态坐标属性
    const property = new Cesium.SampledPositionProperty()
    const startTime = Cesium.JulianDate.fromDate(new Date(arrData[i].startTime))
    const endTime = Cesium.JulianDate.fromDate(new Date(arrData[i].endTime))

    property.addSample(startTime, Cesium.Cartesian3.fromDegrees(...arrData[i].position)) // 此刻显示
    property.addSample(endTime, Cesium.Cartesian3.fromDegrees(...arrData[i].position)) // 此刻不显示

    const stopTime = new Date(arrData[i].endTime).getSeconds() - new Date(arrData[i].startTime).getSeconds()

    arrData[i].center.stop = stopTime // 停顿视角
    centerArr.push(arrData[i].center) // center集合

    const graphic = new mars3d.graphic.DivGraphic({
      position: property,
      style: {
        html: `<div class="marsTiltPanel marsTiltPanel-theme-red">
      <div class="marsTiltPanel-wrap">
          <div class="area">
              <div class="arrow-lt"></div>
              <div class="b-t"></div>
              <div class="b-r"></div>
              <div class="b-b"></div>
              <div class="b-l"></div>
              <div class="arrow-rb"></div>
              <div class="label-wrap">
                  <div class="title">${arrData[i].title}</div>
                  <div class="label-content">
                      <div class="data-li">
                          <div class="data-value"><span class="label-unit">${arrData[i].description}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="b-t-l"></div>
          <div class="b-b-r"></div>
      </div>
      <div class="arrow" ></div>
  </div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    })
    graphicLayer.addGraphic(graphic)
  }
  map.setCameraViewList(centerArr) // 视角
}
