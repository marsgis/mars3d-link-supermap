<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <layer-state />
    </div>

    <div>
      <a-space>
        <span>快捷视角:</span>
        <mars-button @click="startPoint">起点</mars-button>
        <mars-button @click="halfWayPoint">半程点</mars-button>
        <mars-button @click="endPoint">终点</mars-button>
        <mars-button @click="allLine">全程路线</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import LayerState from "@mars/components/mars-sample/layer-state.vue"
import * as mapWork from "./map.js"

const startPoint = () => {
  mapWork.startPoint()
}

const halfWayPoint = () => {
  mapWork.halfWayPoint()
}

const endPoint = () => {
  mapWork.endPoint()
}

const allLine = () => {
  mapWork.allLine()
}
</script>
<style scoped lang="less"></style>
