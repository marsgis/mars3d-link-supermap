<template>
  <!-- 图例面板 -->
  <div class="divPanel">
    <img src="/img/legend/heatmap.png" />
  </div>

  <!-- 按钮 -->
  <mars-dialog :visible="true" left="10" top="10">
    <mars-button @click="btnUpdate">更新数据</mars-button>
  </mars-dialog>

  <!-- echarts图表 -->
  <div class="chart">
    <div class="chartOne">
      <h6>分类统计</h6>
      <ul class="chartList">
        <li :key="item" v-for="item in fltjData">
          <div class="title">{{ item.name }}</div>
          <div class="conter">
            <span>{{ item.xms }}</span
            >个， 投资<span>{{ item.zds }}</span
            >亿，占地<span>{{ item.zjl }}</span
            >亩
          </div>
        </li>
      </ul>
    </div>
    <div class="chartTwo" id="chartTwo">
      <h6>分资金来源统计</h6>
      <div id="ul_ZJLY" class="chartTwo_ulzjly"></div>
    </div>

    <div class="chartThree" id="chartThree">
      <h6>分年度统计</h6>
      <button @click="btnNDTJ_xms(chartsData.ndtj)">项目数</button>
      <button @click="btnNDTJ_zds(chartsData.ndtj)">占地数</button>
      <button @click="btnNDTJ_zjl(chartsData.ndtj)">资金量</button>
      <div id="ul_NDTJ" class="chartThree_ulndtj"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import * as echarts from "echarts"
import * as mapWork from "./map.js"

const fltjData = ref([])
let ZJLY
const NDTJ = ref()

onMounted(() => {
  ZJLY = document.getElementById("ul_ZJLY")
  NDTJ.value = document.getElementById("ul_NDTJ")
  // 分类统计
  fltjData.value = chartsData.fltj
  // 分资金来源统计
  initCharts_Two(chartsData.zjly, ZJLY)
  // 分年度统计
  initCharts_Three(chartsData.ndtj)
})
const btnUpdate = () => {
  mapWork.btnUpdate()
}

const chartsData = {
  fltj: [
    { name: "公共文化", xms: 160, zds: 10, zjl: 645 },
    { name: "公共教育", xms: 848, zds: 580, zjl: 10 },
    { name: "医疗卫生", xms: 370, zds: 10, zjl: 150560 },
    { name: "公共体育", xms: 91, zds: 0, zjl: 182 },
    { name: "社会保障", xms: 233, zds: 10, zjl: 808 },
    { name: "基层公共服务", xms: 20, zds: 10, zjl: 10 }
  ],
  zjly: [
    { name: "省级", value: 88 },
    { name: "市级", value: 127 },
    { name: "区县级", value: 175 },
    { name: "街道级", value: 270 },
    { name: "社会资本", value: 42 }
  ],
  ndtj: {
    xms: [
      { name: "2013", value: 1 },
      { name: "2014", value: 2 },
      { name: "2015", value: 6 },
      { name: "2016", value: 36 },
      { name: "2017", value: 85 },
      { name: "2018", value: 10 },
      { name: "2019年", value: 17 }
    ],
    zds: [
      { name: "2013", value: 10 },
      { name: "2014", value: 20 },
      { name: "2015", value: 30 },
      { name: "2016", value: 40 },
      { name: "2017", value: 50 },
      { name: "2018", value: 60 }
    ],
    zjl: [
      { name: "2013", value: 55600 },
      { name: "2014", value: 95600 },
      { name: "2015", value: 162896 },
      { name: "2016", value: 195761 },
      { name: "2017", value: 87068 },
      { name: "2018", value: 68393 }
    ]
  }
}

// chartTwo  Echart圆形  分类资金来源
function initCharts_Two(arr: any, ZJLY: any) {
  const data = []
  for (let i = 0; i < arr.length; i++) {
    const object: any = {}
    object.name = arr[i].name
    object.value = arr[i].value
    data[i] = object
  }

  const myChart = echarts.init(ZJLY)
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{c}"
    },
    // 图例 的相关设置
    legend: {
      orient: "vertical",
      left: "right",
      textStyle: {
        color: "#fff"
      }
    },
    // 图形的设置
    series: [
      {
        // name: '访问来源',
        type: "pie",
        radius: "80%",
        right: "20%",
        // 图形上文本标签的样式设置
        label: {
          show: false
        },
        color: [
          "#37A2DA",
          "#32C5E9",
          "#67E0E3",
          "#9FE6B8",
          "#FFDB5C",
          "#ff9f7f",
          "#fb7293",
          "#E062AE",
          "#E690D1",
          "#e7bcf3",
          "#9d96f5",
          "#8378EA",
          "#96BFFF"
        ],
        center: ["45%", "55%"],
        data: data, // 使用for循环添加
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  }
  myChart.setOption(option)

  window.addEventListener("resize", function () {
    myChart.resize()
  })
}

// chartThree   Echart柱状   年度统计
function initCharts_Three(arr: any) {
  histogram(arr.xms, "个")
}
// 分年度统计，按钮事件
function btnNDTJ_xms(arr: any) {
  histogram(arr.xms, "个")
}
function btnNDTJ_zds(arr: any) {
  histogram(arr.zds, "亩")
}
function btnNDTJ_zjl(arr: any) {
  histogram(arr.zjl, "亿")
}

// 项目、占地、资金    按钮点击切换
function histogram(arr: any, Word: string) {
  const arrName = []
  const arrValue = []
  for (let i = 0; i < arr.length; i++) {
    arrName[i] = arr[i].name
    arrValue[i] = arr[i].value
  }

  const myChart = echarts.init(NDTJ.value)
  const option = {
    // xAxis和yAxis的nameTextStyle不起作用
    // 因此设置了字体的全局样式
    textStyle: {
      color: "#ccc"
    },
    title: {
      text: "单位:" + Word,
      // 全局样式对此不生效，
      textStyle: {
        color: "#fff"
      }
    },
    // 移入柱子时的阴影
    tooltip: {
      trigger: "axis",
      formatter: "{b}<br/>{c}" + Word,
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "5px",
      right: "0",
      bottom: "5px",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: arrName
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        // 柱子的相关设置
        itemStyle: {
          color: "rgb(0, 174, 255)"
        },
        barWidth: "20px",
        type: "bar",
        emphasis: {
          focus: "series"
        },
        data: arrValue
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
.divPanel {
  position: absolute;
  bottom: 40px;
  left: 55px;
}
.divPanel img {
  width: 40px;
  height: 180px;
}
.infoView {
  left: 10px;
  width: 100px;
}

/* m10右侧统计图表1 */
.chart {
  position: absolute;
  right: 10px;
  top: 10px;
  height: 100%;
  font-size: 15px;
  border: none;
  color: #ffffff;
  background: none;
}
.chartOne,
.chartTwo,
.chartThree {
  width: 393px;
  height: 30%;
  margin-bottom: 6px;
  position: relative;
  border: 1px solid #17366c;
  background: linear-gradient(to left, #3897cf, #3897cf) left top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) right top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) left bottom no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left bottom no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat, linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  background-color: rgba(0, 0, 0, 0.1);
  h6 {
    color: #ffffff;
  }

  button {
    padding: 2px 6px;
  }
}
.chart h6 {
  padding: 4px;
  width: 10px;
  margin-left: 5%;
  float: left;
  margin-top: 3%;
  font-size: 16px;
  line-height: 16px;
  text-align: center;
}
.chartOne h6::before {
  position: absolute;
  top: 10px;
  left: 6%;
  width: 20px;
  height: 2px;
  background: red;
  content: " ";
}
.chartTwo h6::before {
  position: absolute;
  top: 10px;
  left: 6%;
  width: 20px;
  height: 2px;
  background: red;
  content: " ";
}
.chartThree h6::before {
  position: absolute;
  top: 10px;
  left: 6%;
  width: 20px;
  height: 2px;
  background: red;
  content: " ";
}
.chartOne .chartList {
  height: 30%;
  width: 91%;
  float: left;
  margin-top: 15px;
  font-size: 15px;
}
.chartOne .title {
  float: left;
}
.chartOne .conter {
  float: right;
}
.chartOne .title {
  margin-right: 10px;
}
.chartOne .chartList li {
  height: 40px;
  width: 95%;
  margin-left: 23px;
  border-bottom: white 0.5px dashed;
  line-height: 50%;
  padding: 13px;
}
.chartOne .chartList li:hover {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.4);
}
.chartOne .chartList span {
  color: rgb(0, 174, 255);
}

/*chartTwo ul_ZJLY */
.chartTwo_ulzjly,
.chartThree_ulndtj {
  width: 84%;
  height: 90%;
  position: absolute;
  left: 13%;
  bottom: 5px;
}

/* chartThree ul_NDTJ */
.chartThree button {
  background: none;
  border: 0.06px solid rgb(0, 174, 255);
  z-index: 1000;
  font-size: 1rem;
}
.chartThree button:nth-child(2) {
  position: absolute;
  top: 10px;
  right: 160px;
}
.chartThree button:nth-child(3) {
  position: absolute;
  top: 10px;
  right: 90px;
}
.chartThree button:nth-child(4) {
  position: absolute;
  top: 10px;
  right: 15px;
  margin-right: 5px;
}

.chartThree button:active {
  background-color: rgb(19, 166, 224);
}
.chartThree button:visited {
  background-color: rgb(19, 166, 224);
}
</style>
