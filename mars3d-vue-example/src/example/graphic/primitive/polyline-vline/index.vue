<template>
  <mars-dialog :visible="true" right="10" top="10" bottom="auto" width="386">
    <div class="populationView">
      <!-- 实有人口 -->
      <div class="realPopulation">
        <div class="populationView_text">
          <span class="firstBox text_population">实有人口</span>
          <span class="firstBox text_icon">/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/</span>
        </div>

        <div class="container">
          <div class="comment populationNumber">
            <span class="columnar"></span>
            <span class="number">250685</span>
            <p class="text-num">实有人口（人）</p>
          </div>

          <div class="comment birthRate">
            <span class="columnar"></span>
            <span class="number">12.6%</span>
            <p class="text-num">人口出生率</p>
          </div>

          <div class="comment deathRate">
            <span class="columnar"></span>
            <span class="number">57.0%</span>
            <p class="text-num">人口死亡率</p>
          </div>
        </div>
        <div id="population" class="population"></div>
      </div>

      <!-- 人口结构 -->
      <div class="populationStructure">
        <div class="populationView_text">
          <span class="firstBox text_population">人口结构</span>
          <span class="firstBox text_icon">/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/</span>
        </div>
        <div class="male">
          <mars-icon icon="boy-two" width="35" color="#00f6ff" />
          <span>男性</span>
        </div>
        <div class="female">
          <mars-icon icon="girl" width="35" color="#ff6ac4" />
          <span>女性</span>
        </div>
        <div id="structure" class="structure"></div>
      </div>

      <!-- 老龄化分析 -->
      <div class="aging">
        <div class="populationView_text">
          <span class="firstBox text_population">老龄化分析</span>
          <span class="firstBox text_icon">/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/</span>
        </div>
        <span class="man_icon">
          <mars-icon icon="boy-two" width="35" color="#00f6ff" />
        </span>
        <span class="woman_icon">
          <mars-icon icon="girl" width="35" color="#ff6ac4" />
        </span>
        <div class="man_display">
          <mars-icon icon="boy-two" color="#00f6ff" />
          <span>38.53%</span>
        </div>
        <div class="woman_display">
          <mars-icon icon="girl" color="#ff6ac4" />
          <span>61.49%</span>
        </div>

        <div id="agingAnalysis" class="agingAnalysis"></div>
      </div>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted } from "vue"

import * as echarts from "echarts"

onMounted(() => {
  const realPopulationDom = document.getElementById("population")
  const populationStructureDom = document.getElementById("structure")
  const agingDom = document.getElementById("agingAnalysis")

  initRealPopulation(realPopulationDom)
  initPopulationStructure(populationStructureDom)
  initAging(agingDom)
})

// 实有人口
function initRealPopulation(dom: any) {
  const realEcharts = echarts.init(dom)
  const realPopulationOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      top: "30%",
      left: "3%",
      right: "4%",
      bottom: "-10%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.5],
      show: false
    },
    yAxis: {
      type: "category",
      data: ["常住人口", "流动人口"],
      axisLabel: {
        show: true,
        color: "#fff" // 坐标轴文字颜色}
      },
      axisLine: {
        show: false
      }
    },
    series: [
      {
        type: "bar",
        label: {
          show: true,
          color: "#fff",
          fontSize: 10
        },
        data: [130365, 52729],
        itemStyle: {
          borderRadius: [15, 15, 15, 15],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#4d68ee" // 0%处的颜色
            },
            {
              offset: 0.6,
              color: "#25b1f5" // 50%处的颜色
            },
            {
              offset: 1,
              color: "#01f5ff" // 100%处的颜色
            }
          ])
        }
      }
    ]
  }
  realEcharts.setOption(realPopulationOption)

  window.addEventListener("resize", function () {
    realEcharts.resize()
  })
}
// 人口结构
function initPopulationStructure(dom: any) {
  const structureEcharts = echarts.init(dom)
  const structureOption = {
    tooltip: {
      trigger: "item"
    },
    legend: {
      textStyle: {
        color: "#fff"
      },

      top: "8%",
      left: "center",
      icon: "circle",
      itemWidth: 10
    },
    color: ["#a20bd1", "#b2ba00", "#49ad00", "#03dfa7", "#8185b3", "#4c67eb", "#ab7900"],
    series: [
      {
        name: "男性",
        type: "pie",
        radius: ["60%", "40%"],
        center: ["25%", "65%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "inner",
          formatter: "{d}%",
          fontSize: 10
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "10",
            fontWeight: "bold",
            color: "#fff"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: "0-0.6" },
          { value: 735, name: "0.6-2" },
          { value: 580, name: "3-6" },
          { value: 484, name: "7-14" },
          { value: 300, name: "15-35" },
          { value: 300, name: "36-60" },
          { value: 300, name: "61以上" }
        ]
      },
      {
        name: "女性",
        type: "pie",
        radius: ["60%", "40%"],
        center: ["75%", "65%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "inner",
          formatter: "{d}%",
          fontSize: 10
        },
        data: [
          { value: 148, name: "0-0.6" },
          { value: 735, name: "0.6-2" },
          { value: 580, name: "3-6" },
          { value: 484, name: "7-14" },
          { value: 300, name: "15-35" },
          { value: 300, name: "36-60" },
          { value: 300, name: "61以上" }
        ]
      }
    ]
  }
  structureEcharts.setOption(structureOption)

  window.addEventListener("resize", function () {
    structureEcharts.resize()
  })
}

// 人口老龄化分析
function initAging(dom: any) {
  const agingEcharts = echarts.init(dom)
  const agingOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (params: any) {
        return "女性：" + params[0].value + "<br/>男性：" + Math.abs(params[1].value)
      }
    },
    color: ["#c145c5", "#21b8f6"],
    grid: {
      x: 0,
      y: 0,
      x2: 0,
      y2: 0,
      top: "10%",
      left: "10%",
      containLabel: true
    },
    xAxis: [
      {
        type: "value",
        axisTick: {
          show: false
        },
        show: false
      }
    ],
    yAxis: [
      {
        type: "category",
        data: ["60-65岁", "65-70岁", "70-75岁", "75-80岁", "80岁以上"],
        axisLabel: {
          color: "#fff" // 坐标轴文字颜色
        }
      }
    ],

    series: [
      {
        type: "bar",
        stack: "总量",
        label: {
          show: false
        },
        emphasis: {
          focus: "series"
        },

        data: [700, 300, 330, 160, 70],
        barCategoryGap: "50%",
        itemStyle: {
          borderRadius: [15, 15, 15, 15]
        }
      },
      {
        type: "bar",
        stack: "总量",
        label: {
          show: false,
          position: "left"
        },
        emphasis: {
          focus: "series"
        },
        data: [-800, -400, -350, -200, -100],
        itemStyle: {
          borderRadius: [15, 15, 15, 15]
        }
      }
    ]
  }
  agingEcharts.setOption(agingOption)

  window.addEventListener("resize", function () {
    agingEcharts.resize()
  })
}
</script>
<style scoped lang="less">
.genderIcon {
  font-family: "GenderIcon" !important;
  font-size: 30px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.genderIcon-nan:before {
  content: "\e6a6";
}
.genderIcon-nv:before {
  content: "\e6a7";
}
.genderIcon-nan1:before {
  content: "\e6c2";
}
.genderIcon-nv1:before {
  content: "\e6c3";
}
.populationView {
  height: calc(100% - 80px);
}
.realPopulation{
  width: 100%;
  /* height: 35.5%; */
  border: 1px solid rgb(11, 59, 75);
  margin-bottom: 1.066667rem;
  background: linear-gradient(to left, #3897cf, #3897cf) left top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) right top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) left bottom no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left bottom no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat, linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  background-color: rgba(0, 0, 0, 0.3);
}
.populationStructure{
width: 100%;
  /* height: 35.5%; */
  border: 1px solid rgb(11, 59, 75);
  margin-bottom: 1.066667rem;
  background: linear-gradient(to left, #3897cf, #3897cf) left top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) right top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) left bottom no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left bottom no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat, linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  background-color: rgba(0, 0, 0, 0.3);
}
.aging {
  width: 100%;
  /* height: 35.5%; */
  border: 1px solid rgb(11, 59, 75);
  background: linear-gradient(to left, #3897cf, #3897cf) left top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) right top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) left bottom no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left bottom no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat, linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  background-color: rgba(0, 0, 0, 0.3);
}
.populationView_text {
  margin-top: 20px;
  padding-left: 6px;
  width: 100%;
  height: 20px;
}
.firstBox {
  margin-left: 10px;
}
.text_icon {
  font-weight: bold;
  color: rgb(6, 84, 123);
}

/* 实有人口数据显示样式 */
.comment {
  position: absolute;
  top: 40px;
  left: 10px;
  width: 33%;
  height: 80px;
}
.populationNumber {
  left: 10px;
}
.birthRate {
  left: 133px;
}
.deathRate {
  left: 266px;
}

.columnar {
  float: left;
  display: block;
  margin-top: 16px;
  width: 8px;
  height: 50px;
  background-color: #0e6de9;
}
.birthRate .columnar {
  background-color: #00af6d;
}

.deathRate .columnar {
  background-color: #b150d9;
}
.number {
  display: block;
  margin-left: 20px;
  margin-top: 10px;
  font-size: 26px;
  color: #1ae9f1;
  font-family: "UnidreamLED", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.text-num {
  display: block;
  position: absolute;
  left: 20px;
  bottom: 0;
}
/* 人口结构样式 */
.male {
  position: absolute;
  top: 435px;
  left: 21%;
  width: 8%;
  height: 8%;
  text-align: center;
  border-radius: 20px;
  font-size: 10px;
}
.female {
  position: absolute;
  top: 440px;
  left: 68.5%;
  width: 8%;
  height: 8%;
  text-align: center;
  border-radius: 20px;
  font-size: 10px;
}
.genderIcon-nan1 {
  color: #00f6ff;
}
.genderIcon-nv1 {
  color: #ff6ac4;
}
/* 老龄化分析样式 */
.man_icon {
  position: relative;
  top: 10%;
  left: 25%;
  width: 8%;
  height: 8%;
  color: rgb(43, 167, 244);
}
.woman_icon {
  position: relative;
  top: 10%;
  left: 37%;
  width: 8%;
  height: 8%;
  color: rgb(201, 25, 199);
}

.man_display {
  position: absolute;
  top: 620px;
  left: 70%;
  width: 100px;
  font-size: 17px;
  text-align: center;
  border: 1px solid rgb(43, 167, 244);
  color: rgb(43, 167, 244);
  background-color: rgba(21, 180, 192, 0.3);
  border-radius: 4px;
  padding: 5px;
  * {
    vertical-align: middle;
  }
  :deep(svg) {
    font-size: 25px;
    vertical-align: middle;
  }
}
.woman_display {
  position: absolute;
  top: 670px;
  left: 70%;
  width: 100px;
  font-size: 17px;
  border: 1px solid rgb(201, 25, 199);
  text-align: center;
  color: rgb(201, 25, 199);
  background-color: rgba(201, 25, 199, 0.3);
  border-radius: 4px;
  padding: 5px;
  * {
    vertical-align: middle;
  }
  :deep(svg) {
    font-size: 25px;
    vertical-align: middle;
  }
}

/* echarts 图表容器 */
.population {
  margin-top: 55px;
  width: 100%;
  height: 125px;
}
.structure {
  margin-top: -13px;
  width: 100%;
  height: 300px;
}
.agingAnalysis {
  width: 58%;
  height: 150px;
}
</style>
