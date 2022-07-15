<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state
      :defaultCount="10"
      drawLabel1="贴地矩形"
      drawLabel2="竖立墙"
    />

    <div class="f-mb">
      <a-space>
        <span>状态:</span>
        <mars-button @click="videoPlay">播放</mars-button>
        <mars-button @click="videoStop">暂停</mars-button>
      </a-space>
    </div>
  </mars-dialog>

</template>

<script lang="ts" setup>
import { ref } from "vue"
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import * as mapWork from "./map.js"

const videoPlay = () => {
  mapWork.videoPlay()
}

const videoStop = () => {
  mapWork.videoStop()
}
</script>
<style scoped lang="less">
</style>
