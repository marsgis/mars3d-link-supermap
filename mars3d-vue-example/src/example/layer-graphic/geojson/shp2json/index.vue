<template>
  <mars-dialog :visible="true" right="10" top="10" height="90">
    <a-space>
      <mars-button @click="shoXZM">乡镇面</mars-button>
      <mars-button @click="shoGCD">高程点</mars-button>
    </a-space>
    <div class="f-pt">
      <layer-state />
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import LayerState from "@mars/components/mars-sample/layer-state.vue"
import * as mapWork from "./map.js"

const shoXZM = () => {
  mapWork.shoXZM()
}

const shoGCD = () => {
  mapWork.shoGCD()
}
</script>
<style lang="less">
.pannel {
  max-height: 750px;
  overflow-y: auto;
}
</style>
