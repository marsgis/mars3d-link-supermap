<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span>室内演示视角:</span>
        <mars-button @click="centerAtDX1">教室</mars-button>
        <mars-button @click="centerAtDX2">走廊</mars-button>
        <mars-button @click="centerAtDX3">楼梯间</mars-button>
      </a-space>
    </div>
    <div>
      <a-space>
        <mars-button @click="showD1">-1F</mars-button>
        <mars-button @click="show(0.4)">1F</mars-button>
        <mars-button @click="show(3.5)">2F</mars-button>
        <mars-button @click="show(8.4)">3F</mars-button>
        <mars-button @click="show(12.4)">4F</mars-button>
        <mars-button @click="show(16.4)">5F</mars-button>
        <mars-button @click="show(100)">整体</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import * as mapWork from "./map.js"

const showD1 = () => {
  mapWork.showD1()
}
const show = (item: any) => {
  mapWork.showModel(item)
}

const centerAtDX1 = () => {
  mapWork.centerAtDX1()
}
const centerAtDX2 = () => {
  mapWork.centerAtDX2()
}
const centerAtDX3 = () => {
  mapWork.centerAtDX3()
}
</script>
<style scoped lang="less">
.mars-pannel-item-label {
  width: 85px;
}
</style>
