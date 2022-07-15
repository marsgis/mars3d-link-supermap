<template>
  <mars-dialog :visible="true" top="10" right="10" bottom="40" width="450">
    <!-- 右侧图表面板-->
    <div class="bg">
      <div class="_item_top">
        <div class="_item_title">接入建筑栋数</div>
      </div>
      <div class="_item_row _item_full_box_width justify-between">
        <div class="row1 flex-1">
          <img src="/img/icon/监测建筑.png" alt="" class="icon" />
          <div class="row1_right">
            <div class="right_title">87</div>
            <div class="right_sub_title">监测建筑</div>
          </div>
        </div>
        <div class="row1 flex-1 ml">
          <img src="/img/icon/监测面积.png" alt="" class="icon" />
          <div class="row1_right">
            <div class="right_title">2021</div>
            <div class="right_sub_title">监测面积(万m²)</div>
          </div>
        </div>
      </div>
      <div class="_item_row" style="align-items: flex-start">
        <div class="row3">
          <div class="_item_row_box3">
            <div class="ring1">
              <div ref="ring" id="ring"></div>
            </div>
          </div>
        </div>
        <div class="row2 flex items-center">
          <div class="_item_row_box2">
            <div class="box2_item" count="64">办公建筑</div>
            <div class="box2_item1" count="1">综合建筑</div>
            <div class="box2_item2" count="4">商场建筑</div>
            <div class="box2_item3" count="10">宾馆饭店</div>
            <div class="box2_item4" count="1">医疗卫生</div>
            <div class="box2_item5" count="1">文化教育</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg">
      <div class="right_item">
        <div class="_item_top item_bottom">
          <div class="_item_title">各类建筑接入情况</div>
        </div>
        <div class="_item_full_box">
          <div class="bar">
            <div id="bar" ref="bar"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg container-last-chart">
      <div class="right_item">
        <div class="_item_top item_bottom">
          <div class="_item_title">能耗趋势</div>
        </div>
        <div class="_item_full_box">
          <div class="bar">
            <div id="line" ref="line" class="bar_chart"></div>
          </div>
        </div>
      </div>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue"
import * as echarts from "echarts"

const ring = ref()
const line = ref()
const bar = ref()

onMounted(() => {
  nextTick(() => {
    initEcharts()
  })
})

function initEcharts() {
  // 饼形图
  const myChart = echarts.init(ring.value)
  const option = {
    backgroundColor: "transparent",
    legend: {
      show: false,
      top: "0%",
      left: "center",
      icon: "roundRect",
      itemWidth: 8,
      textStyle: {
        fontSize: fontSize(0.68)
      }
    },

    series: [
      {
        type: "pie",
        radius: "80%",
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderType: "solid",
          borderColor: "#ffffff"
        },
        emphasis: {
          scale: false,
          scaleSize: 2
        },
        label: {
          show: true,
          position: "center",
          lineHeight: 28,
          formatter: () => {
            return ""
          },
          emphasis: {
            formatter: (params: any) => {
              return "{p|" + params.data.name + "}" + "\n{nm|" + params.data.value + "}"
            }
          },
          rich: {
            p: {
              width: 130,
              itemWidth: 100,
              color: "#fff",
              fontSize: fontSize(1),
              lineHeight: fontSize(1),
              fontWeight: "bold"
              //   backgroundColor: "rgba(15, 21, 70, 1)", // 覆盖index=0时的数据
            },
            nm: {
              width: 130,
              itemWidth: 100,
              color: "#fff",
              fontSize: fontSize(1.5),
              lineHeight: fontSize(1.625),
              fontWeight: "bold"
              //   backgroundColor: "rgba(15, 21, 70, 1)", // 覆盖index=0时的数据
            }
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: 64,
            name: "办公建筑",
            itemStyle: {
              color: "rgba(14,227,247, 0.58)"
            }
          },
          {
            value: 1,
            name: "综合建筑",
            itemStyle: {
              color: "rgba(255,113,94, 0.58)"
            }
          },
          {
            value: 4,
            name: "商场建筑",
            itemStyle: {
              color: "rgba(254,  217,  118, 0.64)"
            }
          },
          {
            value: 10,
            name: "宾馆饭店",
            itemStyle: {
              color: "rgba(234,94,230, 0.64)"
            }
          },
          {
            value: 1,
            name: "医疗卫生",
            itemStyle: {
              color: "rgba(94, 225, 186, 0.58)"
            }
          },
          {
            value: 1,
            name: "文化教育",
            itemStyle: {
              color: "rgba(113, 204, 78, 0.58)"
            }
          }
        ]
      }
    ]
  }
  myChart.setOption(option)

  // 柱状图
  const myChart2 = echarts.init(bar.value, "dark")
  const option2 = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "axis",
      show: true,
      confine: true,
      textStyle: {
        align: "left"
      },
      formatter: function (item: any) {
        let html = `${item[0].name}:${item[0].data}`
        item.slice(1).forEach((s: any) => {
          if (s.seriesName.indexOf("series") === -1) {
            html += `<br/> ${s.seriesName}:${s.data}`
          }
        })
        return html
      },
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "none" // cross 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      show: false,
      top: "5%",
      left: "center",
      icon: "roundRect",
      itemWidth: 8,
      textStyle: {
        fontSize: fontSize(0.6875)
      }
    },
    grid: {
      left: "0%",
      right: "0%",
      top: "20%",
      bottom: "5%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: ["办公建筑", "综合建筑", "商场建筑", "宾馆饭店", "医疗卫生", "文化教育"],
      axisTick: {
        alignWithLabel: false,
        show: true,
        lineStyle: {
          color: "#ccc"
        }
      },
      axisLabel: {
        fontSize: fontSize(0.6875),
        interval: 0,
        padding: [10, 0, 0, 0]
      },
      axisLine: {
        lineStyle: {
          color: "#ccc"
        }
      },
      splitLine: {
        show: false
      },
      show: true
    },

    yAxis: {
      max: 70,
      name: "栋",
      nameTextStyle: {
        // color: "rgba(217, 35, 35, 1)",
        align: "right",
        verticalAlign: "middle",
        borderDashOffset: 0,
        padding: [6, 6, 6, 6]
      },
      axisLabel: {
        // color: '#ff0000',
        fontSize: fontSize(0.6875),
        interval: 0,
        padding: [0, 0, 0, 0]
      },
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: "#ccc"
        }
      },
      axisTick: {
        alignWithLabel: false,
        show: true,
        lineStyle: {
          color: "#ccc"
        }
      }
    },
    series: [
      {
        name: "dotted",
        type: "pictorialBar",
        symbol: "rect",
        barGap: "-100%",
        showBackground: true,
        itemStyle: {
          color: "rgba(14,227,247, 1)"
        },
        symbolRepeat: true,
        symbolSize: [12, 4],
        symbolMargin: 1,
        data: [64, 1, 4, 10, 1, 1],
        z: -8
      },
      {
        type: "bar",
        itemStyle: {
          color: "rgba(0,0,0,0.2)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -9,
        showBackground: true,

        data: [70, 70, 70, 70, 70, 70]
      }
    ]
  }
  myChart2.setOption(option2)

  // 折线图
  const myChart3 = echarts.init(line.value, "dark")
  const option3 = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "axis",
      show: true,
      confine: true,
      textStyle: {
        align: "left"
      },
      formatter: function (item: any) {
        let html = item[0].axisValue * 1 + "月"
        item.slice(0).forEach((s: any) => {
          if (s.seriesName.indexOf("series") === -1) {
            html += `<br/> ${s.seriesName}:${s.data}%`
          }
        })
        return html
        // return  '{b0}<br/>{a1}: {c1}<br/>{a2}: {c2}'
      },
      // formatter: '{b0}<br/>{a1}: {c1}<br/>{a2}: {c2}',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "none" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      show: true,
      // data:[""]
      top: "0%",
      left: "center",
      icon: "circle",
      type: "scroll",
      itemHeight: fontSize(0.5),
      itemWidth: fontSize(0.5),
      textStyle: {
        fontSize: fontSize(0.6)
      }
    },
    grid: {
      left: "0%",
      right: "0%",
      top: "18%",
      bottom: "5%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      axisTick: {
        alignWithLabel: false,
        show: true,
        lineStyle: {
          color: "#ccc"
        }
      },
      axisLine: {
        lineStyle: {
          color: "#ccc"
        }
      },
      axisLabel: {
        // X轴文字样式
        fontSize: fontSize(0.6875),
        interval: 0,
        padding: [10, 0, 0, 0]
      },
      splitLine: {
        show: false
      },
      show: true
    },
    yAxis: {
      // max:100,
      type: "value",
      name: "kwh",
      axisLabel: {
        fontSize: fontSize(0.6875),
        interval: 0,
        padding: [0, 0, 0, 0]
      },
      nameLocation: "end",
      nameTextStyle: {
        align: "right",
        verticalAlign: "middle",
        borderDashOffset: 0,
        padding: [6, 6, 6, 6]
      },
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: "#ccc"
        }
      },
      axisTick: {
        alignWithLabel: false,
        show: true,
        lineStyle: {
          color: "#ccc"
        }
      }
    },
    series: [
      {
        name: "办公建筑",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(14,227,247,1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: [4, 3, 5, 4, 0]
      },
      {
        name: "综合建筑",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(255,113,94, 1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: [0.8, 0.6, 1, 0.6, 0]
      },
      {
        name: "商场建筑",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(254,  217,  118, 1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: [0.6, 0.5, 0.8, 0.4, 0]
      },
      {
        name: "宾馆饭店",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(234,94,230, 1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: []
      },
      {
        name: "医疗卫生",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(94, 225, 186, 1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: [1, 1, 1]
      },
      {
        name: "文化教育",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        itemStyle: {
          color: "rgba(113, 204, 78, 1)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -8,
        data: [1, 2, 1, 1, 2]
      },
      {
        type: "bar",
        itemStyle: {
          color: "rgba(0,0,0,0.2)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -9,
        showBackground: true,
        data: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
      }
    ]
  }
  myChart3.setOption(option3)
}

function fontSize(res: number) {
  return res * 16
}
</script>
<style scoped lang="less">
.achart_container {
  position: absolute;
  padding: 10px;
  top: 0;
  right: 0;
  width: 29rem;
  height: 100%;
  background: linear-gradient(to right, rgba(84, 97, 117, 0.5), rgba(42, 52, 69, 1));
}

._item_top {
  position: relative;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.22rem;
}

.item_bottom {
  margin-bottom: -2rem;
}

._item_title {
  position: relative;
  height: 1.56rem;
  padding-left: 1.25rem;
  line-height: 1.56rem;
  font-size: 1.25rem;
  font-weight: 400;
  color: #ffffff;
  letter-spacing: 1px;
  margin-bottom: 0.7rem;
}

._item_title::before {
  content: "";
  width: 0.5rem;
  height: 1rem;
  background: rgba(229, 237, 255, 1);
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

._item_title::after {
  content: "";
  width: 26.5rem;
  height: 0.63rem;
  background: url("/img/icon/分割.png");
  background-repeat: no-repeat;
  position: absolute;
  left: 0;
  top: calc(100% + 0.13rem);
}

._item_row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  text-align: left;
}

._item_row_title {
  font-size: 0.88rem;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.25rem;
  letter-spacing: 2px;
  text-shadow: 0px 0px 0px #02e1ff;
}

.row1 {
  width: 10rem;
  align-items: center;
  display: flex;
  margin-bottom: 1.19rem;
}

.icon {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
}

.row1_right {
  margin-left: 0.75rem;
  text-align: left;
}

.ml {
  margin-left: 50px;
}

.right_title {
  font-size: 2rem;
  font-weight: bold;
  color: #febc04;
  line-height: 2rem;
  background: linear-gradient(180deg, #e5be38 0%, #ff882e 100%);
  -webkit-background-clip: text;
  white-space: nowrap;
  -webkit-text-fill-color: transparent;
  font-family: "UnidreamLED", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.right_sub_title {
  font-size: 0.88rem;
  color: #d8d8d8;
  line-height: 1;
  white-space: nowrap;
  background: linear-gradient(180deg, #e5be38 0%, #ff882e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

._item_full_box {
  width: 100%;
  height: 14rem;
  margin-top: 35px;
}

._item_full_box_width {
  width: 100%;
}

.row3 {
  flex: 1;
  position: relative;
}

._item_row_box3 {
  width: 12rem;
  height: 12rem;
}

._item_row_box2 {
  width: 10rem;
  margin-right: 40px;
  margin-top: 20px;
  transform: translateX(-1rem);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.box2_item,
.box2_item1,
.box2_item2,
.box2_item3,
.box2_item4,
.box2_item5 {
  position: relative;
  width: 100%;
  height: 1.5rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.box2_item::before,
.box2_item1::before,
.box2_item2::before,
.box2_item3::before,
.box2_item4::before,
.box2_item5::before {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  border: 0.06rem solid #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 0.5rem;
  transform: translateY(-50%);
}

.box2_item::before {
  background: rgba(14, 227, 247, 0.58);
}

.box2_item1::before {
  background: rgba(255, 113, 94, 0.58);
}

.box2_item2::before {
  background: rgba(254, 217, 118, 0.64);
}

.box2_item3::before {
  background: rgba(234, 94, 230, 0.64);
}

.box2_item4::before {
  background: rgba(94, 225, 186, 0.58);
}

.box2_item5::before {
  background: rgba(113, 204, 78, 0.58);
}

.box2_item::after,
.box2_item1::after,
.box2_item2::after,
.box2_item3::after,
.box2_item4::after,
.box2_item5::after {
  content: attr(count);
  font-size: 1rem;
  font-weight: 600;
  color: #87c1fa;
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
}

.box2_item:last-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0);
}

.ring1 {
  width: 100%;
  height: 100%;
  padding-top: 1rem;
  overflow: hidden;
}

#ring {
  width: 100%;
  height: 100%;
}
.bar {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.bar_chart {
  width: 100%;
  height: 100%;
}
#bar {
  width: 100%;
  height: 100%;
}
.container-last-chart {
  margin-top: 8px;
}
</style>
