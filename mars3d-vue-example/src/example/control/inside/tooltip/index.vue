<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="onBindMapDemo">Map上直接弹出</mars-button>
      <mars-button @click="onBindLayerDemo">图层上绑定</mars-button>
      <mars-button @click="onBindLayerDemo2">图层上预定义配置</mars-button>
      <mars-button @click="onBindLayerTemplateDemo">自定义模版</mars-button>

      <mars-button @click="onBindGraphicDemo1">Graphic上绑定</mars-button>
      <mars-button @click="onBindGraphicDemo2">Graphic上局部刷新</mars-button>
    </a-space>
  </mars-dialog>
  <mars-dialog left="100" right="100" top="80" bottom="80" title="查看历史" v-model:visible="showLayer">
    <iframe class="mars-iframe" src="http://marsgis.cn/" frameborder="0"></iframe>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

/**
 * js中的自定义事件
 *
 * @param {any} event 自定义传入的数据
 * @returns {void} 无
 */
const showLayer = ref()
mapWork.eventTarget.on("showWebsite", function (event: any) {
  showLayer.value = event.showHistoryLayer
})

// btn按钮
const onBindMapDemo = () => {
  mapWork.bindMapDemo()
}
const onBindLayerDemo = () => {
  mapWork.bindLayerDemo()
}
const onBindLayerDemo2 = () => {
  mapWork.bindLayerDemo2()
}
const onBindLayerTemplateDemo = () => {
  mapWork.bindLayerTemplateDemo()
}
const onBindGraphicDemo1 = () => {
  mapWork.bindGraphicDemo1()
}
const onBindGraphicDemo2 = () => {
  mapWork.bindGraphicDemo2()
}
</script>

<style scoped lang="less">
.ant-space {
  display: grid;
}

.mars-iframe {
  width: 100%;
  height: 100%;
}
</style>
