<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button v-show="!formState.isStart" @click="btnStart">开始</mars-button>
      <mars-button v-show="formState.isStart && !formState.isPause" @click="btnPause">暂停</mars-button>
      <mars-button v-show="formState.isStart && formState.isPause" @click="btnProceed">继续</mars-button>
      <mars-button v-show="formState.isStart" @click="btnStop">停止</mars-button>
    </a-space>
  </mars-dialog>

  <fixedRoute-info />
</template>

<script setup lang="ts">
import fixedRouteInfo from "@mars/components/mars-sample/fixedRoute-info.vue"
import { reactive, ref } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  isStart: boolean
  isPause: boolean
}

const formState = reactive<FormState>({
  isStart: false,
  isPause: false
})

mapWork.eventTarget.on("endRoam", () => {
  udpateState()
})

// 按钮事件
const btnStart = () => {
  mapWork.fixedRoute.start() // 启动漫游
  udpateState()
}

const btnPause = () => {
  mapWork.fixedRoute.pause()
  udpateState()
}

const btnProceed = () => {
  mapWork.fixedRoute.proceed()
  udpateState()
}

const btnStop = () => {
  mapWork.fixedRoute.stop()
  udpateState()
}

function udpateState() {
  setTimeout(() => {
    formState.isStart = mapWork.fixedRoute.isStart
    formState.isPause = mapWork.fixedRoute.isPause
  }, 100)
}
</script>
