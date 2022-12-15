<template>
  <mars-dialog :visible="true" right="10" top="10" width="320">
    <a-form>
      <a-form-item>
        <a-row :gutter="[0, 10]">
          <a-col :span="7">模型角度:</a-col>
          <a-col :span="16">
            <a-radio-group v-model:value="formState.noPitchRoll" @change="updateModel" >
              <a-radio value="0">自动</a-radio>
              <a-radio value="1">手动</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-show="formState.noPitchRoll === '1'">
        <a-row :gutter="[0, 10]">
          <a-col :span="7">heading值:</a-col>
          <a-col :span="16">根据路线自动计算</a-col>

          <a-col :span="7">pitch值(前后):</a-col>
          <a-col :span="16">
            <mars-slider @change="updateModel" v-model:value="formState.slidePitchStep" :min="-90" :max="90" :step="0.01" />
          </a-col>

          <a-col :span="7">roll值(左右):</a-col>
          <a-col :span="16">
            <mars-slider @change="updateModel" v-model:value="formState.slideRollStep" :min="-90" :max="90" :step="0.01" />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item>
        <mars-button @click="onClickClear"> 清除地面投影</mars-button>
      </a-form-item>
    </a-form>
  </mars-dialog>
  <fixedRoute-info />
</template>

<script setup lang="ts">
import { reactive } from "vue"
import fixedRouteInfo from "@mars/components/mars-sample/fixedRoute-info.vue"
import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  noPitchRoll: string
  slidePitchStep: number
  slideRollStep: number
}

const formState: UnwrapRef<FormState> = reactive({
  noPitchRoll: "0",
  slidePitchStep: 0,
  slideRollStep: 10
})

const updateModel = () => {
  if (formState.noPitchRoll === "1") {
    mapWork.setMoelStyle({
      pitch: formState.slidePitchStep,
      roll: formState.slideRollStep
    })
  } else {
    mapWork.clearMoelPitchRoll()
  }
}

const onClickClear = () => {
  mapWork.clearGroundLayer()
}
</script>

<style scoped lang="less">
.roamLinePanel {
  width: 300px;
}
</style>
