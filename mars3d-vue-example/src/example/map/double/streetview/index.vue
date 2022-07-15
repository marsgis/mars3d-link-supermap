<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="viewTo23D">分屏</mars-button>
      <mars-button @click="viewTo2d">仅街景</mars-button>
      <mars-button @click="viewTo3d">仅3D</mars-button>
    </a-space>
  </mars-dialog>

  <mars-dialog :visible="true" left="10" top="10">
    <img src="/img/marker/street.png" alt="" class="imgIcon" @click="chooseStree" />
  </mars-dialog>
</template>

<script setup lang="ts">
import * as mapWork from "./map.js"

const viewTo23D = () => {
  mapWork.splitScreen()
}

const viewTo2d = () => {
  mapWork.streetscape()
}
const viewTo3d = () => {
  mapWork.viewTo3d()
}
const chooseStree = () => {
  mapWork.chooseStree()
}
</script>
<style scoped lang="less">
.imgIcon {
  width: 70%;
  height: 100%;
  margin-left: 5px;
}
</style>
