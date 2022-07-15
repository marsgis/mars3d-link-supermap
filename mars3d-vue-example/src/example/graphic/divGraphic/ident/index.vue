<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="divGraphicYellow">效果一</mars-button>
      <mars-button @click="divGraphicBule">效果二</mars-button>
      <mars-button @click="divGraphicWhite">效果三</mars-button>
      <mars-button @click="divGraphicHotSpot">效果四</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script lang="ts" setup>
import * as mapWork from "./map.js"

const divGraphicYellow = () => {
  mapWork.divGraphicYellow()
}

const divGraphicBule = () => {
  mapWork.divGraphicBule()
}

const divGraphicWhite = () => {
  mapWork.divGraphicWhite()
}

const divGraphicHotSpot = () => {
  mapWork.divGraphicHotSpot()
}
</script>

<style scoped lang="less">
.ant-space {
  display: grid;
}
</style>
