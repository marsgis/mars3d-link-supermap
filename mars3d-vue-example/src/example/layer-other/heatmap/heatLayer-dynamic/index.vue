<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <span>是否动态:</span>
      <mars-switch v-model:checked="enabled" @change="onChangeState" />
    </a-space>
  </mars-dialog>
  <div class="divPanel">
    <img src="/img/legend/heatmap.png" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const enabled = ref(true)

const onChangeState = () => {
  mapWork.chkUnderground(enabled.value)
}
</script>
<style scoped lang="less">
.divPanel {
  position: absolute;
  bottom: 40px;
  right: 20px;
}
.divPanel img {
  width: 40px;
  height: 180px;
}
</style>
