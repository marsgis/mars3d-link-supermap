<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <span>显示对应的数据点:</span>
      <a-checkbox v-model:checked="enabledUnderground" @change="chkUnderground" />
    </a-space>
  </mars-dialog>
  <div class="divPanel">
    <img src="/img/legend/heatmap.png" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const enabledUnderground = ref(false)

const chkUnderground = () => {
  mapWork.chkUnderground(enabledUnderground.value)
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
