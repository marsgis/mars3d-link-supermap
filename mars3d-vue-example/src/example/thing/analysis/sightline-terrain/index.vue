<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">轨迹方向</span>
        <mars-slider @change="headingChange" v-model:value="modelParams.heading" :min="0" :max="360" :step="0.01" />值{{ modelParams.heading }}
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">前后侧摆</span>
        <mars-slider @change="pitchChange" v-model:value="modelParams.pitch" :min="-180" :max="180" :step="0.01" />值{{ modelParams.pitch }}
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">左右侧摆</span>
        <mars-slider @change="rollChange" v-model:value="modelParams.roll" :min="-180" :max="180" :step="0.01" />值{{ modelParams.roll }}
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <mars-button @click="setPoint">设置摄像头位置</mars-button>
        <mars-button @click="getCenter">计算与地面交点</mars-button>
        <a-checkbox @change="testTerrain" v-model:checked="isChecked">深度检测</a-checkbox>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue"
import * as mapWork from "./map.js"

interface params {
  heading: number
  pitch: number
  roll: number
}

const modelParams = reactive<params>({
  heading: 220,
  pitch: 75,
  roll: 0
})

const isChecked = ref<boolean>(false)

onMounted(() => {
  mapWork.updateModel(modelParams)
})

const headingChange = () => {
  mapWork.updateModel(modelParams)
}
const pitchChange = () => {
  mapWork.updateModel(modelParams)
}

const rollChange = () => {
  mapWork.updateModel(modelParams)
}

const testTerrain = () => {
  mapWork.testTerrain(isChecked.value)
}

// 设置摄像头位置
const setPoint = () => {
  mapWork.sePoint()
}

// 计算与地面焦点
const getCenter = () => {
  mapWork.analysisIntersection()
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 160px;
}
</style>
