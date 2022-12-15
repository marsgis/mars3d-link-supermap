<template>
  <mars-dialog :visible="true" right="10" top="10" width="360">
    <!-- <div class="chart"></div> -->
    <div class="chartOne" id="chartOne">
      <h6>航线条数</h6>

      <div class="hx">
        <div class="_item_row _item_full_box_width justify-between">
          <mars-icon icon="airplane" :width="30" class="icon" />
          <div class="row1_right">
            <div class="right_title">{{ guonei }}(条)</div>
            <div class="right_sub_title">国内航班</div>
          </div>

          <mars-icon icon="take-off" :width="35" class="icon" />
          <airplane theme="outline" size="43" fill="#333" />
          <div class="row1_right">
            <div class="right_title">{{ guoji }}(条)</div>
            <div class="right_sub_title">国际航班</div>
          </div>
        </div>
      </div>
    </div>

    <div class="chartTwo" id="chartTwo">
      <h6>国内机场航线数</h6>
      <div id="ul_GNHX" class="chartTwo_ulgnhx"></div>
    </div>
    <div class="chartThree" id="chartThree">
      <h6>年度航班统计</h6>
      <div id="ul_HBTJ" class="chartThree_ulhbtj"></div>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import * as echarts from "echarts"
import * as mapWork from "./map.js"

const guoji = ref()
const guonei = ref()
let GNHX
let HBTJ

let route = [] // 国内机场航线数据
let flight = []

onMounted(() => {
  const airData = mapWork.getAirData()
  GNHX = document.getElementById("ul_GNHX")
  HBTJ = document.getElementById("ul_HBTJ")

  guonei.value = airData.guonei
  guoji.value = airData.guoji

  route = airData.route
  flight = airData.flight

  initCharts_Two()
  initCharts_Three()
})

function initCharts_Two() {
  const airportData = [] // 机场数据
  route.forEach((item) => {
    airportData.push({
      name: item.airport,
      value: item.routeNum
    })
  })
  const myChart = echarts.init(GNHX)
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "机场名：{b}<br/> 航线：{c}"
    },
    // legend: {
    //   orient: "horizontal",
    //   top: "0.1%",
    //   textStyle: {
    //     color: "#ffffff"
    //   }
    // },
    series: [
      {
        type: "pie",
        radius: "50%",
        label: {
          show: true
        },

        data: airportData
      }
    ]
  }
  myChart.setOption(option)
}

function initCharts_Three() {
  const year = []
  const domestic = [] // 国内航班
  const international = [] // 国际航班

  flight.forEach((item) => {
    year.push(item.year)
    domestic.push(item.domestic)
    international.push(item.international)
  })

  const myChart = echarts.init(HBTJ)

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "8%",
      right: "0%",
      bottom: "6%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: year,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: "value"
      }
    ],
    series: [
      {
        name: "国内航班",
        type: "bar",
        barWidth: "30%",
        data: domestic
      },
      {
        name: "国际航班",
        type: "bar",
        barWidth: "30%",
        data: international
      }
    ]
  }

  myChart.setOption(option)

  window.addEventListener("resize", function () {
    myChart.resize()
  })
}
</script>
<style scoped lang="less">
.chartOne,
.chartTwo,
.chartThree {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
  position: relative;
  border: 1px solid #17366c;
  background: linear-gradient(to left, #3897cf, #3897cf) left top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) right top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) left bottom no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left bottom no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat, linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  background-color: rgba(0, 0, 0, 0.1);

  h6 {
    margin-top: 5px;
    width: 10px;
    height: 5px;
    color: white;
  }
  .chartTwo .chartTwo_ulgnhx,
  .chartThree_ulhbtj {
    height: 100%;
    width: 91%;
    float: left;
    margin-top: 15px;
    font-size: 15px;
  }
  .chartTwo_ulgnhx,
  .chartThree_ulhbtj {
    width: 84%;
    height: 90%;
    position: absolute;
    left: 8%;
    bottom: 5px;
  }
}

.chartOne {
  height: 96px;
}

._item_row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  text-align: left;
}
._item_full_box_width {
  width: 100%;
}

.right_title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #febc04;
  line-height: 3rem;
  background: linear-gradient(180deg, #e5be38 0%, #ff882e 100%);
  -webkit-background-clip: text;
  white-space: nowrap;
  -webkit-text-fill-color: transparent;
  font-family: "UnidreamLED", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.right_sub_title {
  font-size: 0.85rem;
  color: #d8d8d8;
  line-height: 1;
  white-space: nowrap;
  background: linear-gradient(180deg, #e5be38 0%, #ff882e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.row1_right {
  margin-left: 0.6rem;
  text-align: left;
}
.row1 {
  // width: 100px;
  align-items: center;
  display: flex;
  margin-bottom: 1.15rem;
}
.icon {
  margin-left: 28px;
}
h6 {
  margin-left: 10px;
}
</style>
