<template>
  <mars-button class="control_btn" @click="showPannel = !showPannel">{{ showPannel ? "显示图表" : "隐藏图表" }}</mars-button>
  <mars-dialog :visible="!showPannel" width="340" left="10" top="40" bottom="40">
    <div id="echartViewLeft_top" class="viewLeft_top"></div>
    <p class="echarts-title">卫星数统计</p>
    <div id="echartViewLeft_bottom" class="viewLeft_bottom"></div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import * as echarts from "echarts"
import { ref } from "vue"
import * as mapWork from "./map.js"


const showPannel = ref(false) // 用于控制面板的显示与隐藏
let allCount: number
let firstEcharts: any //
let secondEcharts: any

mapWork.eventTarget.on("loadEchartsData", (item) => {
  allCount = item.allCount

  // 饼状图
  const topDom = document.getElementById("echartViewLeft_top")
  firstChart(item.countryNumber, topDom)

  // 柱状图
  const bottomDom = document.getElementById("echartViewLeft_bottom")
  secondChart(item.yearNumber, bottomDom)
})

const colorList = ["#6648FE", "#18AF92", "#0A7CE5", "#22CEEA", "#F35267", "#F68048"]

// 配置第一个图表的数据(圆环)
function firstChart(data, dom) {
  const arrData = []
  // ts中遍历对象，将对象中的数据，拆分成name和value对，放入数组中
  for (const [key, val] of Object.entries(data)) {
    const itemObj: any = {}
    itemObj.name = key
    itemObj.value = val
    arrData.push(itemObj)
  }

  // 初始化echarts
  firstEcharts = echarts.init(dom)

  // 进行相关的配置
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>共{c}个&nbsp;({d}%)"
    },
    title: [
      {
        text: "总数",
        left: "49%",
        top: "44%",
        textAlign: "center",
        textBaseline: "middle",
        textStyle: {
          color: "#A4D5FF",
          fontWeight: "normal",
          fontSize: 15
        }
      },
      {
        text: allCount,
        left: "49%",
        top: "55%",
        textAlign: "center",
        textBaseline: "middle",
        textStyle: {
          color: "#FFFFFF",
          fontWeight: "normal",
          fontSize: 25
        }
      }
    ],
    series: [
      {
        name: "pie",
        type: "pie",
        radius: ["40%", "50%"],
        selectedMode: "single",
        selectedOffset: 16, // 选中是扇区偏移量
        clockwise: true,
        startAngle: 90,
        color: colorList,
        emphasis: {
          borderWidth: 0,
          shadowBlur: 5,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.2)",
          scale: false, // 设置饼图默认的展开样式
          itemStyle: {
            borderWidth: 3,
            borderColor: "#ffffff"
          }
        },
        data: arrData,
        label: {
          overflow: "none",
          ellipsis: "...",
          minMargin: 10,
          alignTo: "none"
        }
      }
    ]
  }

  firstEcharts.setOption(option)
}

// 配置第二个图表的数据(柱状图)
function secondChart(data, dom) {
  // 年份的数组
  const yearData = []
  // 对应的卫星数组
  const weiXinData = []
  // ts中遍历对象，将对象中的数据，拆分成name和value对，放入数组中
  for (const [key, val] of Object.entries(data)) {
    yearData.push(key)
    weiXinData.push(val)
  }

  // 过滤数据，将数据中年份为NaN的数据去除
  const indexArr = yearData.filter((item) => !isNaN(item))
  // 初始化echarts
  secondEcharts = echarts.init(dom)

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (params: any) {
        let inhtml = ""
        for (const i in params) {
          const item = params[i]
          inhtml += "<label>" + "卫星" + item.value + "</label>&nbsp;个"
        }
        return inhtml
      },
      textStyle: {
        color: "#cacaca"
      }
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: 2,
      containLabel: true
    },
    xAxis: {
      type: "value",
      axisLabel: {
        show: false
      }
    },
    yAxis: {
      type: "category",
      data: indexArr,
      axisLabel: {
        color: "#FFFFFF" // 字体颜色
      }
    },
    dataZoom: [
      {
        type: "inside",
        start: Math.ceil(((yearData.length - 12) * 100) / yearData.length), // 数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%。
        // start: 80,
        end: 100, // 数据窗口范围的结束百分比。范围是：0 ~ 100。
        yAxisIndex: 0
      },
      {
        type: "slider",
        fillerColor: "#134875",
        yAxisIndex: 0,
        width: 10,
        height: "40%",
        right: 0
      }
    ],
    series: [
      {
        name: name,
        type: "bar",
        data: weiXinData,
        barWidth: "50%",
        itemStyle: {
          color: {
            type: "linear",
            x: 1, // 右
            y: 0, // 下
            x2: 0, // 左
            y2: 0, // 上
            colorStops: [
              {
                offset: 0,
                color: "#18AF92" // 0% 处的颜色
              },
              {
                offset: 0.9,
                color: "#7ceef9" // 90% 处的颜色
              }
            ]
          }
        }
      }
    ]
  }

  secondEcharts.setOption(option)
}
</script>

<style scoped lang="less">
.viewLeft_top {
  width: 100%;
  height: 39%;
  &:before {
    content: "";
    z-index: -1;
    width: 80%;
    height: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: transparent;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
}
.viewLeft_bottom {
  width: 100%;
  height: 55%;
}
.echarts-title {
  font-size: 18px;
  font-weight: bold;
  position: relative;
}
.control_btn {
  position: absolute;
  left: 10px;
  top: 10px;
}
</style>
