<template>
  <!--查询条件面板-->
  <mars-dialog :visible="formState.viewContorUi === true" right="10" top="10" width="355">
    <div>
      <a-form>
        <a-form-item label="名称">
          <mars-input v-model:value="formState.name" :allowClear="true" @change="selectSatellites" />
        </a-form-item>
        <a-form-item label="系列卫星">
          <mars-select v-model:value="formState.selXiLie" :options="selXiLieOptions" @change="selectSatellites"> </mars-select>
        </a-form-item>
        <a-form-item label="所属国家">
          <mars-select v-model:value="formState.selCountry" :options="selectCountryOptions" @change="selectSatellites"> </mars-select>
        </a-form-item>
        <a-form-item label="对象类型">
          <mars-select v-model:value="formState.selType" :options="selTypeOptions" @change="selectSatellites"> </mars-select>
        </a-form-item>

        <a-form-item label="雷达截面">
          <mars-slider
            range
            v-model:value="formState.sliRcs"
            :marks="{ 0: '0', 1000: '1000' }"
            :min="0"
            :max="1000"
            :step="1"
            @change="changeSlider"
          />
        </a-form-item>
        <a-form-item label="发射日期">
          <mars-slider
            range
            v-model:value="formState.sliLaunchdate"
            :marks="{ 1950: '50', 2022: '22' }"
            :min="1950"
            :max="2022"
            :step="1"
            @change="changeSlider"
          />
        </a-form-item>
        <a-form-item label="轨道周期">
          <mars-slider
            range
            v-model:value="formState.sliPeriod"
            :marks="{ 0: '0', 60000: '6w' }"
            :min="0"
            :max="60000"
            :step="1"
            @change="changeSlider"
          />
        </a-form-item>

        <div class="track-type">
          <a-form-item label="轨道类型" class="track-type">
            <mars-select v-model:value="formState.selGuidao" :options="selGuidaoOptions" @change="selectSatellites"> </mars-select>
          </a-form-item>
        </div>
        <a-form-item label="倾斜角度">
          <mars-slider
            range
            v-model:value="formState.sliInclination"
            :marks="{ 0: '0°', 150: '150°' }"
            :min="0"
            :max="150"
            :step="1"
            @change="changeSlider"
          />
        </a-form-item>
        <a-form-item label="远地点高度">
          <mars-slider
            range
            v-model:value="formState.sliApogee"
            :marks="{ 0: '0', 600000: '600km' }"
            :min="0"
            :max="600000"
            :step="1"
            @change="changeSlider"
          />
        </a-form-item>
        <a-form-item label="近地点高度">
          <mars-slider
            range
            v-model:value="formState.sliPerigee"
            :marks="{ 0: '0', 500000: '500km' }"
            :min="0"
            :max="500000"
            :step="1000"
            @change="changeSlider"
          />
        </a-form-item>

        <a-form-item style="text-align: center">
          <mars-button @click="reset">重置</mars-button>
        </a-form-item>
      </a-form>
    </div>
  </mars-dialog>

  <!--卫星详情面板-->
  <mars-dialog :visible="formState.pointInfo === true" right="10" top="10" width="335">
    <mars-button @click="highlightSatellite"> 返回 </mars-button>
    <table class="mars-table tb-border">
      <tr v-for="(item, index) in weixinNameList" :key="item">
        <td class="nametd">{{ item }}</td>
        <td v-html="weixinValueList[index]"></td>
      </tr>
    </table>
  </mars-dialog>

  <!-- 引入同文件夹下的mars-echart -->
  <mars-echarts-example></mars-echarts-example>

</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from "vue"
import * as mapWork from "./map.js"
import MarsEchartsExample from "@mars/example/graphic/space/point/mars-echartsExample.vue"

interface FormState {
  name: string
  selXiLie: string
  selCountry: string
  selType: string
  selGuidao: string
  sliRcs: any[]
  sliLaunchdate: any[]
  sliPeriod: any[]
  sliInclination: any[]
  sliApogee: any[]
  sliPerigee: any[]
  pointInfo: boolean
  viewContorUi: boolean
}
const formState = reactive<FormState>({
  name: "",
  selXiLie: "",
  selCountry: "",
  selType: "",
  selGuidao: "",
  sliRcs: [0, 1000],
  sliLaunchdate: [1950, 2022],
  sliPeriod: [0, 60000],
  sliInclination: [0, 150],
  sliApogee: [0, 600000],
  sliPerigee: [0, 500000],
  pointInfo: false,
  viewContorUi: true
})

mapWork.eventTarget.on("clickWeixin", function (event: any) {
  formState.pointInfo = false
  formState.viewContorUi = true
  formState.pointInfo = true
  formState.viewContorUi = false
  weixinValueList.value = event.weixinList
})

// 单击地图空白处
mapWork.eventTarget.on("clickMap", function () {
  formState.pointInfo = false
  formState.viewContorUi = true
})

// 卫星详情面板
const weixinNameList = ref([
  "名称",
  "目录号",
  "国际代号",
  "对象类型",
  "操作状态",
  "所有者/国家",
  "发射日期",
  "发射地点",
  "轨道周期（分钟）",
  "倾角（度）",
  "远地点高度（公里）",
  "近地点高度（公里）",
  "雷达截面",
  "轨道中心",
  "轨道类型",
  "更多资料"
])
const weixinValueList: any = ref([])

// 下拉菜单
const selXiLieOptions = ref([
  {
    value: "",
    label: "无"
  },
  {
    value: "gps",
    label: "美国GPS系统"
  },
  {
    value: "bd",
    label: "中国 北斗卫星系统"
  },
  {
    value: "glonass",
    label: "俄罗斯 格洛纳斯系统"
  },
  {
    value: "inmarsat",
    label: "国际海事卫星(Inmarsat)"
  },
  {
    value: "landsat",
    label: "地球资源卫星(Landsat)"
  },
  {
    value: "digitalglobe",
    label: "数位全球(DigitalGlobe)"
  }
])
const selectCountryOptions = ref([
  {
    value: "",
    label: "全部"
  },
  {
    value: "US",
    label: "美国"
  },
  {
    value: "CIS",
    label: "前苏联"
  },
  {
    value: "PRC",
    label: "中国"
  },
  {
    value: "UK",
    label: "英国"
  },
  {
    value: "FR",
    label: "法国"
  },
  {
    value: "CA",
    label: "加拿大"
  },
  {
    value: "AUS",
    label: "澳大利亚"
  },
  {
    value: "JPN",
    label: "小日本"
  },
  {
    value: "IND",
    label: "印度"
  }
])
const selTypeOptions = ref([
  {
    value: "",
    label: "全部"
  },
  {
    value: "satellite",
    label: "普通卫星"
  },
  {
    value: "junk",
    label: "垃圾(卫星碎片、火箭和助推器)"
  }
])
const selGuidaoOptions = ref([
  {
    value: "",
    label: "全部"
  },
  {
    value: "low",
    label: "低地球轨道"
  },
  {
    value: "medium",
    label: "中地球轨道"
  },
  {
    value: "geosynchronous",
    label: "地球同步轨道"
  },
  {
    value: "geostationary",
    label: "地球静止轨道"
  },
  {
    value: "high",
    label: "高地球轨道"
  }
])

let num: any
// 滑动条改变事件
const changeSlider = () => {
  clearTimeout(num)
  num = setTimeout(() => {
    mapWork.selectSatellites(formState)
  }, 500)
}

const LOW_ORBIT = 2000
const GEOSYNCHRONOUS_ORBIT = 35786

const selectSatellites = () => {
  switch (formState.selGuidao) {
    case "low":
      formState.sliApogee = [0, LOW_ORBIT]
      formState.sliPerigee = [0, LOW_ORBIT]
      break
    case "medium":
      formState.sliApogee = [LOW_ORBIT, GEOSYNCHRONOUS_ORBIT]
      formState.sliPerigee = [LOW_ORBIT, GEOSYNCHRONOUS_ORBIT]
      break
    case "geosynchronous":
      formState.sliApogee = [GEOSYNCHRONOUS_ORBIT * 0.98, GEOSYNCHRONOUS_ORBIT * 1.02]
      formState.sliPerigee = [GEOSYNCHRONOUS_ORBIT * 0.98, GEOSYNCHRONOUS_ORBIT * 1.02]
      break
    case "geostationary":
      formState.sliApogee = [GEOSYNCHRONOUS_ORBIT * 0.98, GEOSYNCHRONOUS_ORBIT * 1.02]
      formState.sliPerigee = [GEOSYNCHRONOUS_ORBIT * 0.98, GEOSYNCHRONOUS_ORBIT * 1.02]
      formState.sliInclination = [0, 1]
      break
    case "high":
      formState.sliApogee = [GEOSYNCHRONOUS_ORBIT * 1.02, 600000]
      formState.sliPerigee = [GEOSYNCHRONOUS_ORBIT * 1.02, 500000]
      break
    default:
      break
  }
  mapWork.selectSatellites(formState)
}

// 重置参数
const reset = () => {
  formState.name = ""
  formState.selXiLie = ""
  formState.selCountry = ""
  formState.selType = ""
  formState.selGuidao = ""
  formState.sliRcs = [0, 1000]
  formState.sliLaunchdate = [1950, 2022]
  formState.sliPeriod = [0, 60000]
  formState.sliInclination = [0, 150]
  formState.sliApogee = [0, 600000]
  formState.sliPerigee = [0, 500000]

  mapWork.resetGraphic()
}

const highlightSatellite = () => {
  formState.pointInfo = false
  formState.viewContorUi = true
  // 重置上次选中的轨道样式
  mapWork.highlightSatellite()
}

</script>
<style scoped lang="less">
:deep(.ant-form-item-label) {
  width: 80px;
}
:deep(.ant-form) {
  margin-right: 12px;
}
.mars-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
.mars-table tr td {
  padding: 5px 10px;
  text-align: left;
}
.mars-table tr td:first-child {
  border-left: none;
}
.mars-table .nametd {
  padding: 5px 20px 5px 10px;
}
.tb-border {
  border: 1px solid #4db3ff70;
}
.tb-border tr td {
  border: 1px solid #4db3ff70;
}

.track-type {
  margin-top: 18px;
}

</style>
