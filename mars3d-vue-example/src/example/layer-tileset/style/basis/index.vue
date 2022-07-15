<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <mars-button @click="setStyle1">原始</mars-button>
        <mars-button @click="setStyle2">按高度着色</mars-button>
      </a-space>
    </div>

    <div>
      <a-space>
        <span>建筑物颜色:</span>
        <mars-color-picker @change="selectColor" v-model:value="color" />
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const color = ref("#1d5996")

const setStyle1 = () => {
  mapWork.setStyle1()
}
const setStyle2 = () => {
  mapWork.setStyle2()
}
const selectColor = (e) => {
  mapWork.selectColor(color.value)
}
</script>
