<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="addLayer">叠加图层</mars-button>
      <mars-button @click="removeLayer">移除图层</mars-button>

      <a-space>
        <span>颜色:</span>
        <mars-color-picker @change="selectColor" v-model:value="color" />
      </a-space>
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const color = ref("#4e70a6")

const addLayer = () => {
  mapWork.addTileLayer()
}

const removeLayer = () => {
  mapWork.removeTileLayer()
}

const selectColor = (e) => {
  mapWork.setFilterColor(color.value)
}
</script>
