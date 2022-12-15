<template>
  <mars-dialog :visible="true" right="10" top="10" width="320">
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">视椎体状态:</span>
        <a-checkbox v-model:checked="formState.enabledShowHide" @change="chkShowModelMatrix">显示/隐藏</a-checkbox>

        <mars-button @click="locate">定位至卫星</mars-button>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">前后侧摆:</span>
        <mars-slider @change="pitchChange" v-model:value="pitchValue" :min="-180" :max="180" :step="1" />当前值{{ pitchValue }}
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">左右侧摆:</span>
        <mars-slider @change="rollChange" v-model:value="rollValue" :min="-180" :max="180" :step="1" />当前值{{ rollValue }}
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;夹角:</span>
        <mars-slider @change="angle" v-model:value="angleValue" :min="1" :max="60" :step="0.01" />当前值{{ angleValue }}
      </a-space>
    </div>

    <table class="mars-table tb-border">
      <tr>
        <td class="nametd">名称</td>
        <td id="td_name">{{ formState.name }}</td>
      </tr>
      <tr>
        <td class="nametd">TLE1</td>
        <td id="td_tle1">{{ formState.tle1 }}</td>
      </tr>
      <tr>
        <td class="nametd">TLE2</td>
        <td id="td_tle2">{{ formState.tle2 }}</td>
      </tr>
      <tr>
        <td class="nametd">时间</td>
        <td id="td_time">{{ formState.time }}</td>
      </tr>

      <tr>
        <td class="nametd">经度</td>
        <td id="td_jd">{{ formState.td_jd }}</td>
      </tr>
      <tr>
        <td class="nametd">经度</td>
        <td id="td_wd">{{ formState.td_wd }}</td>
      </tr>
      <tr>
        <td class="nametd">高程</td>
        <td id="td_gd">{{ formState.td_gd }}</td>
      </tr>
    </table>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  enabledShowHide: boolean // 参考轴系
  name: string
  tle1: string
  tle2: string
  time: string
  td_jd: number
  td_wd: number
  td_gd: number
}

// 角度
const angleValue = ref<number>(10)
const pitchValue = ref<number>(0) // 仰角
const rollValue = ref<number>(0) // 左右

const formState = reactive<FormState>({
  enabledShowHide: false,
  name: "",
  tle1: "",
  tle2: "",
  time: "",
  td_jd: 0,
  td_wd: 0,
  td_gd: 0
})

mapWork.eventTarget.on("satelliteChange", (event: any) => {
  mapWork.centerPoint(angleValue.value)
  formState.name = event.weixinData.name
  formState.tle1 = event.weixinData.tle1
  formState.tle2 = event.weixinData.tle2
  formState.time = event.weixinData.time
  formState.td_jd = event.weixinData.td_jd
  formState.td_wd = event.weixinData.td_wd
  formState.td_gd = event.weixinData.td_gd
})

// 俯仰角
const pitchChange = () => {
  mapWork.pitchChange(pitchValue.value)
}

// 左右角
const rollChange = () => {
  mapWork.rollChange(rollValue.value)
}

// 夹角
const angle = () => {
  mapWork.angle(angleValue.value)
}
// 定位至卫星
const locate = () => {
  mapWork.locate()
}

// 显示/隐藏
const chkShowModelMatrix = () => {
  mapWork.chkShowModelMatrix(formState.enabledShowHide)
}
</script>
<style scoped lang="less">
.inputNum {
  width: 70px !important;
}
th.column-money,
td.column-money {
  text-align: right !important;
}
.ant-slider {
  width: 110px;
}
.mars-table {
  width: 277px;
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
</style>
