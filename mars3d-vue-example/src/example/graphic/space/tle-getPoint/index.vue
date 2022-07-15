<template>
  <mars-dialog :visible="true" right="10" top="10" width="300">
    <a-form>
      <a-form-item label="卫星张角:">
        <mars-slider @change="changeAngle" v-model:value="formState.slideAngle" :min="1" :max="70" :step="1" />
      </a-form-item>

      <a-form-item label="开始时间:">
        <mars-date-picker v-model:value="formState.startTime" format="YYYY-MM-DD HH:mm:ss"
          :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" />
      </a-form-item>
      <a-form-item label="结束时间:">
        <mars-date-picker v-model:value="formState.endTime" format="YYYY-MM-DD HH:mm:ss"
          :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" />
      </a-form-item>

      <a-form-item label="区域颜色:">
        <mars-color-picker @change="changeColorOpacity" v-model:value="formState.areaColor" />
      </a-form-item>

      <a-form-item label="区域透明度:">
        <mars-slider @change="changeColorOpacity" v-model:value="formState.slideOpacity" :min="0.01" :max="1.0"
          :step="0.01" />
      </a-form-item>

      <div class="f-mb f-tac">
        <a-space>
          <mars-button @click="btnAdd">计算成像区域</mars-button>
          <mars-button @click="btnRemoveAll">清除所有</mars-button>
        </a-space>
      </div>

      <div class="f-tac">
        <a-checkbox v-model:checked="formState.guidaoS" @change="changeGuidaoS">升轨</a-checkbox>
        <a-checkbox v-model:checked="formState.guidaoJ" @change="changeGuidaoJ">降轨</a-checkbox>
      </div>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import dayjs, { Dayjs } from "dayjs"
import * as mapWork from "./map.js"

interface FormState {
  slideAngle: number
  slideOpacity: number
  startTime: Dayjs | null
  endTime: Dayjs | null
  areaColor: string
  guidaoS: boolean
  guidaoJ: boolean
}

const formState = reactive<FormState>({
  slideAngle: 10,
  slideOpacity: 0.4,
  startTime: null,
  endTime: null,
  areaColor: "red",
  guidaoS: true,
  guidaoJ: true
})

mapWork.eventTarget.on("loadStatellite", (event: any) => {
  formState.startTime = dayjs(event.startTime, "YYYY-MM-DD HH:mm:ss")
  formState.endTime = dayjs(event.endTime, "YYYY-MM-DD HH:mm:ss")
})

const changeAngle = () => {
  mapWork.changeAngle(formState.slideAngle)
}
// 升轨
const changeGuidaoS = () => {
  mapWork.changeGuidaoS(formState.guidaoS)
}
// 降轨
const changeGuidaoJ = () => {
  mapWork.changeGuidaoJ(formState.guidaoJ)
}
const changeColorOpacity = (e) => {
  mapWork.changeColorOpacity(formState)
}

const btnAdd = () => {
  mapWork.btnAdd(formState)
}
const btnRemoveAll = () => {
  mapWork.btnRemoveAll()
}
</script>
