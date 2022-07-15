<template>
  <mars-dialog :visible="true" right="10" top="10" width="300">
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">整体控制:</span>
        <mars-button @click="openFloorModel">展开</mars-button>
        <mars-button @click="mergeFloorModel">合并</mars-button>
        <mars-button @click="resetModel">还原</mars-button>
      </a-space>
    </div>

    <!-- <div> -->
    <span class="mars-pannel-item-label">显示指定:</span>
    <div style="margin-left: 68px; margin-top: -20px">
      <div class="model-button-contain" :key="item" v-for="(item, index) in floorModel">
        <mars-button @click="showFloorModel(index)">{{ item }}</mars-button>
      </div>
    </div>
    <!-- </div> -->
  </mars-dialog>
</template>

<script setup lang="ts">
import * as mapWork from "./map.js"

const floorModel = ["一楼", "二楼", "三楼", "四楼", "五楼", "六楼", "七楼", "八楼", "九楼", "顶楼"]

const openFloorModel = () => {
  mapWork.openFloorModel()
}
const mergeFloorModel = () => {
  mapWork.mergeFloorModel()
}
const resetModel = () => {
  mapWork.resetModel()
}
const showFloorModel = (floorNum: number) => {
  mapWork.showFloorModel(floorNum + 1)
}
</script>
<style scoped lang="less">
:deep(.ant-space) {
  flex-wrap: wrap;
}
.mars-pannel-item-label {
  display: inline-block;
}

.model-button-contain {
  float: left;
  .mars-button {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
</style>
