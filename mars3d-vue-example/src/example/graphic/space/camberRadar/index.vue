<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state :defaultCount="100" :interaction="false" />
  </mars-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw, onMounted } from "vue"
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import * as mapWork from "./map.js"

// 双曲面雷达参数
interface Rader {
  outerRadius: number // 外曲面半径
  innerRadius: number // 内曲面半径
  headingValue: number // 方向角
  pitchValue: number // 俯仰角
  rollValue: number // 翻滚角
  startFovH: number // 左横截面角度
  endFovH: number // 右横截面角度
  startFovV: number // 垂直起始角度
  endFovV: number // 垂直结束角度
  areaColor: string // 颜色
}

const formState = reactive<Rader>({
  outerRadius: 2000,
  innerRadius: 500,
  headingValue: 0,
  pitchValue: 0,
  rollValue: 0,
  startFovH: 180,
  endFovH: -180,
  startFovV: 0,
  endFovV: 90,
  areaColor: "rgba(255,0,0,0.5)"
})

onMounted(() => {
  mapWork.addDemoGraphic1(formState)
})
</script>
