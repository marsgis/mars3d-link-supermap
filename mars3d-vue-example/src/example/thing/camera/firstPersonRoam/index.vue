<template>
  <mars-dialog :visible="true" right="10" top="10">
      <div class="f-mb">
        <a-space>
          <span>启用状态:</span>
          <a-checkbox @change="chkOpen" v-model:checked="checked">是否开启</a-checkbox>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span>键盘漫游:</span>
          <span>单击地图激活后按 W前进、 S后退、A左移、D右移</span>
        </a-space>
      </div>

      <div>
        <a-space>
          <span>自动漫游:</span>
          <mars-button @click="startAuto">开始自动漫游</mars-button>
          <mars-button @click="stopAuto">停止自动漫游</mars-button>
        </a-space>
      </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const checked = ref(true)

// 是否开启漫游
const chkOpen = () => {
  mapWork.chkOpen(checked.value)
}

// 开始自动漫游
const startAuto = () => {
  if (checked.value) {
    mapWork.startAuto()
  }
}

// 停止自动漫游
const stopAuto = () => {
  mapWork.stopAuto()
}
</script>
