import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const fixedRoute = new mars3d.graphic.FixedRoute({
    name: "空中漫游",
    timeField: "datatime",
    positions: [
      { lng: 117.217898, lat: 31.80021, alt: 500, datatime: "2021/3/25 0:01:00" },
      { lng: 117.217535, lat: 31.815032, alt: 500, datatime: "2021/3/25 0:01:30" },
      { lng: 117.21596, lat: 31.853067, alt: 500, datatime: "2021/3/25 0:02:10" }
    ],
    clockLoop: true, // 是否循环播放
    interpolation: true, // setInterpolationOptions插值
    camera: {
      type: "dy",
      followedX: 50,
      followedZ: 10
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  // ui面板信息展示
  fixedRoute.on(mars3d.EventType.change, (event) => {
    eventTarget.fire("roamLineChange", event)
  })

  // 开始漫游
  fixedRoute.start()

  addDivPoint(fixedRoute.property)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDivPoint(position) {
  // 创建DIV数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const graphic = new mars3d.graphic.DivGraphic({
    position: position,
    hasCache: false,
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-blue">
                  <div class="marsTiltPanel-wrap">
                      <div class="area">
                          <div class="arrow-lt"></div>
                          <div class="b-t"></div>
                          <div class="b-r"></div>
                          <div class="b-b"></div>
                          <div class="b-l"></div>
                          <div class="arrow-rb"></div>
                          <div class="label-wrap">
                              <div class="title">创业大道</div>
                              <div class="label-content">
                                  <div class="data-li">
                                      <div class="data-label">当前位置：</div>
                                      <div class="data-value">安徽省合肥市蜀山区XX号 </div>
                                  </div>
                                  <div class="data-li">
                                      <div class="data-label">今年产值：</div>
                                      <div class="data-value"><span class="label-num">99</span><span class="label-unit">亿元</span>
                                      </div>
                                  </div>
                                  <div class="data-li">
                                      <div class="data-label">当前照片：</div>
                                      <div class="data-value"><img src="http://marsgis.cn/img/common/logo.png"> </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="b-t-l"></div>
                      <div class="b-b-r"></div>
                  </div>
                  <div class="arrow" ></div>
              </div>`,
      scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 100000, 0.1)
    }
  })
  graphicLayer.addGraphic(graphic)
}

// ui层使用
export const formatDistance = mars3d.MeasureUtil.formatDistance
export const formatTime = mars3d.Util.formatTime
