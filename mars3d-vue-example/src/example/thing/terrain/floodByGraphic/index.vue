<template>
  <mars-dialog :visible="true" right="10" top="10" width="300">
    <div v-show="!isShow">
      <div class="f-mb">
        <a-space>
          <span>分析区域</span>
          <mars-button @click="btnDrawExtent">绘制矩形</mars-button>
          <mars-button @click="btnDraw">绘制多边形</mars-button>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">最低海拔</span>
          <mars-input-number v-model:value="formState.minHeight" :step="1" />
          <span>（米）</span>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">最高海拔</span>
          <mars-input-number v-model:value="formState.maxHeight" :step="1" />
          <span>（米）</span>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">淹没速度</span>
          <mars-input-number v-model:value="formState.speed" :step="1" />
          <div class="miles-second">（米/秒）</div>
        </a-space>
      </div>

      <div class="f-tac">
        <mars-button @click="begin">开始分析</mars-button>
      </div>
    </div>

    <div v-show="isShow">
      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">高度选择</span>
          <a-slider
            tooltipPlacement="bottom"
            v-model:value="formState.height"
            @change="onChangeHeight()"
            :min="formState.minHeight"
            :max="formState.maxHeight"
            :step="1"
          />
        </a-space>
      </div>

      <div class="f-mb">
        <span>当前高度:{{ formState.height }}</span>
      </div>

      <div class="f-tac">
        <a-space>
          <mars-button @click="startPlay">{{ isStart ? "暂停" : "播放" }}</mars-button>
          <mars-button @click="goBack">返回</mars-button>
        </a-space>
      </div>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  minHeight: any
  maxHeight: any
  speed: number
  height: number
}

const formState: UnwrapRef<FormState> = reactive({
  minHeight: 0,
  maxHeight: 0,
  speed: 10,
  height: 0
})

const isStart = ref(true)
const isShow = ref(false)

// 监听到高度发生变化
mapWork.eventTarget.on("heightChange", (e: any) => {
  formState.height = Math.ceil(e.height)
})
// 高度改变
const onChangeHeight = () => {
  mapWork.onChangeHeight(formState.height)
}

// 默认自动播放
const startPlay = () => {
  isStart.value = !isStart.value
  mapWork.startPlay()
}

const goBack = () => {
  mapWork.clearDraw()

  formState.minHeight = 0
  formState.maxHeight = 0

  isShow.value = false
  isStart.value = true
}

// 添加矩形
const btnDrawExtent = () => {
  mapWork.btnDrawExtent((min: any, max: any) => {
    formState.minHeight = Math.ceil(min)
    formState.maxHeight = Math.ceil(max)
  })
}
// 添加多边形
const btnDraw = () => {
  mapWork.btnDraw((min: any, max: any) => {
    formState.minHeight = Math.ceil(min)
    formState.maxHeight = Math.ceil(max)
  })
}

// 开始淹没
const begin = () => {
  mapWork.begin(formState, () => {
    isShow.value = true
  })
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 140px;
}
.miles-second {
  width: 120px !important;
}
</style>
