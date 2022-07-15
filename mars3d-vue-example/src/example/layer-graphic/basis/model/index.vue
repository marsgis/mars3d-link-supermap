<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="showFenliDemo">风力发电机</mars-button>
      <mars-button @click="showShanghaiDemo">上海浦东</mars-button>
      <mars-button @click="showDonghuaDemo">动画模型</mars-button>
      <mars-button @click="showGuangfu">光伏电场</mars-button>
      <mars-button @click="removeLayer">清除</mars-button>
    </a-space>

    <div class="f-pt">
      <layer-state label="" />
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import LayerState from "@mars/components/mars-sample/layer-state.vue"
import * as mapWork from "./map.js"

const showShanghaiDemo = () => {
  mapWork.showShanghaiDemo()
}

const showDonghuaDemo = () => {
  mapWork.showDonghuaDemo()
}

const showFenliDemo = () => {
  mapWork.showFenliDemo()
}

const showGuangfu = () => {
  mapWork.showGuangfu()
}

const removeLayer = () => {
  mapWork.removeLayer()
}
</script>
<style scoped lang="less">
.ant-space {
  display: grid;
}
</style>
