<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div v-if="!isShow">
      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">分析方式:</span>
          <a-radio-group v-model:value="formState.radio" @change="changeFloodType">
            <a-radio value="1">整体淹没</a-radio>
            <a-radio value="2">局部淹没</a-radio>
          </a-radio-group>
        </a-space>
      </div>

      <div class="f-mb" v-if="formState.radio === '2'">
        <a-space>
          <span class="mars-pannel-item-label">分析区域:</span>
          <mars-button @click="btnDrawExtent">绘制矩形</mars-button>
          <mars-button @click="btnDraw">绘制多边形</mars-button>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">最低海拔（米）:</span>
          <mars-input-number v-model:value="formState.minHeight" :step="1" />
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">最高海拔（米）:</span>
          <mars-input-number v-model:value="formState.maxHeight" :step="1" />
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">淹没速度（米/秒）:</span>
          <mars-input-number v-model:value="formState.speed" :step="1" />
        </a-space>
      </div>

      <div class="f-tac">
        <mars-button @click="begin">开始分析</mars-button>
      </div>
    </div>

    <div v-else>
      <a-row :gutter="[2, 10]">
        <a-col :span="6">
          <a-form-item label="高度选择:" />
        </a-col>
        <a-col :span="18">
          <a-slider
            tooltipPlacement="bottom"
            v-model:value="formState.height"
            @change="onChangeHeight()"
            :min="formState.minHeight"
            :max="formState.maxHeight"
            :step="1"
          />
        </a-col>
      </a-row>

      <div class="f-mb">
        <a-row :gutter="[2, 10]">
          <a-col :span="6">
            <a-form-item label="当前高度:" />
          </a-col>
          <a-col :span="18">
            <a-form-item>{{ formState.height }}</a-form-item>
          </a-col>
        </a-row>
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
import { onMounted, reactive, ref } from "vue"
import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  radio: string
  minHeight: number
  maxHeight: number
  speed: number
  height: number
}

const labelCol = { span: 8 }
const labelAlign = "left"
const isStart = ref(true) // 开始播放
const isShow = ref(false) // 显示进度面板

const formState: UnwrapRef<FormState> = reactive({
  radio: "2",
  minHeight: 26,
  maxHeight: 200,
  speed: 10,
  height: 0
})

// 监听到高度发生变化
mapWork.eventTarget.on("heightChange", (e: any) => {
  isShow.value = true
  formState.height = Math.ceil(e.height)
})

// 高度改变
const onChangeHeight = () => {
  mapWork.onChangeHeight(formState.height)
}

// 默认自动播放
const startPlay = () => {
  if (!isStart.value) {
    mapWork.tilesetLayer.flood.start()
  } else {
    mapWork.tilesetLayer.flood.stop()
  }
  isStart.value = !isStart.value
}

const goBack = () => {
  mapWork.stop()

  isShow.value = false
  isStart.value = true
}

// 修改分析方式
const changeFloodType = () => {
  mapWork.changeFloodType(formState.radio)
}

// 添加矩形
const btnDrawExtent = () => {
  mapWork.btnDrawExtent()
}
// 添加多边形
const btnDraw = () => {
  mapWork.btnDraw()
}

// 开始淹没
const begin = () => {
  mapWork.begin(formState)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 200px;
}

.mars-pannel-item-label {
  width: 122px;
}
</style>
