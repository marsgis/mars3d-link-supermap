<template>
  <mars-dialog :visible="true" right="10" top="10" width="350">
    <div v-show="!isShow">
      <div class="f-mb">
        <a-space>
          <span>分析区域</span>
          <mars-button @click="btnDrawExtent">绘制矩形</mars-button>
          <mars-button @click="btnDraw">绘制多边形</mars-button>
          <mars-button @click="clearDraw">清除</mars-button>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span>最低海拔</span>
          <mars-input-number v-model:value="formState.minHeight" :step="1" />米
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span>最高海拔</span>
          <mars-input-number v-model:value="formState.maxHeight" :step="1" />米
        </a-space>
      </div>
      <div class="f-mb">
        <a-space>
          <span>淹没速度</span>
          <mars-input-number v-model:value="formState.speed" :step="1" />米/秒
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span>淹没颜色:</span>
          <mars-color-picker v-model:value="floodColor" @change="onChangeColor" />
        </a-space>
      </div>

      <div class="f-tac">
        <mars-button @click="begin">开始分析</mars-button>
      </div>
    </div>

    <div v-show="isShow">
      <div class="f-mb">
        <a-space>
          <span>高度选择</span>
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
        <a-space>
          <span>淹没颜色:</span>
          <mars-color-picker v-model:value="floodColor" @change="onChangeColor" />
          <span>当前高度:{{ formState.height }}</span>
        </a-space>
      </div>

      <div class="f-tac">
        <a-space>
          <mars-button @click="startPlay">{{ isStart ? "暂停" : "播放" }}</mars-button>
          <mars-button @click="goBack">返回</mars-button>
          <a-checkbox v-model:checked="formState.enabledShowElse" @change="onChangeElse">显示非淹没区域</a-checkbox>
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
  minHeight: number
  maxHeight: number
  speed: number
  height: number
  enabledShowElse: boolean
}

const formState: UnwrapRef<FormState> = reactive({
  minHeight: 0,
  maxHeight: 0,
  height: 0,
  speed: 80,
  enabledShowElse: true
})

const isStart = ref(true)
const isShow = ref(false)

const floodColor = ref("rgba(0, 123, 230, 0.5)")

// 监听到高度发生变化
mapWork.eventTarget.on("heightChange", (e: any) => {
  isShow.value = true
  formState.height = Math.ceil(e.height)
})

// 添加矩形
const btnDrawExtent = () => {
  mapWork.btnDrawExtent((min: any, max: any) => {
    formState.minHeight = min
    formState.maxHeight = max
  })
}
// 添加多边形
const btnDraw = () => {
  mapWork.btnDraw((min: any, max: any) => {
    formState.minHeight = Math.ceil(min)
    formState.maxHeight = Math.ceil(max)
  })
}
const clearDraw = () => {
  mapWork.clearDraw()

  formState.minHeight = 0
  formState.maxHeight = 0
}

// 开始淹没
const begin = () => {
  mapWork.begin(formState)
}

// 高度改变
const onChangeHeight = () => {
  mapWork.onChangeHeight(formState.height)
}

// 颜色修改
const onChangeColor = (e) => {
  mapWork.onChangeColor(floodColor.value)
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
  formState.enabledShowElse = true
}

const onChangeElse = () => {
  mapWork.onChangeElse(formState.enabledShowElse)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 200px;
}
</style>
