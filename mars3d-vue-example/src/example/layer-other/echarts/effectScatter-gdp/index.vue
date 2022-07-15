<template>
  <mars-dialog :visible="true" zIndex="999" left="10" top="10">
    <a-checkbox v-model:checked="pointerEvents" @change="chkPointerEvents"> 启用Echars交互 </a-checkbox>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import * as mapWork from "./map.js"

const pointerEvents = ref(false)

onMounted(() => {
  // 创建Echarts图层
  mapWork.createEchartsLayer(pointerEvents.value)
})

// 状态控制
const chkPointerEvents = () => {
  mapWork.chkPointerEvents(pointerEvents.value)
}
</script>
<style scoped lang="less">
.infoView {
  left: 10px;
  width: 155px;
}
</style>
