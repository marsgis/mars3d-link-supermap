<template>
  <mars-dialog :visible="true" right="10" top="10" width="208">
    <a-collapse v-model:activeKey="activeKey">
      <!-- 自定义切换图标 -->
      <template #expandIcon>
        <mars-icon icon="down-c" class="icon-vertical-a" />
      </template>
      <a-collapse-panel key="1" header="S3M示例">
        <div class="basis-button-contain">
          <mars-button @click="showQxSuofeiyaDemo">倾斜摄影(哈尔滨索菲亚)</mars-button>
          <mars-button @click="showQxSrsbDemo">倾斜摄影(萨尔茨堡)</mars-button>
          <!-- <mars-button @click="showBIMQiaoDemo">BIM(桥梁)</mars-button>
          <mars-button @click="showMaxNiaochaoDemo">人工建模(奥体公园)</mars-button>
          <mars-button @click="showMaxCBDDemo">人工建模(CBD)</mars-button> -->
          <mars-button @click="showMaxPipeDemo">人工建模(地下管网)</mars-button>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="2" header="开源仓库">
        <mars-button href="https://gitee.com/marsgis/mars3d-link-supermap" target="_blank">与超图结合开源仓库</mars-button>
      </a-collapse-panel>
    </a-collapse>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import * as mapWork from "./map.js"

const activeKey = ref(["1", "2", "3"])

const showMaxNiaochaoDemo = () => {
  mapWork.showMaxNiaochaoDemo()
}
const showMaxCBDDemo = () => {
  mapWork.showMaxCBDDemo()
}
const showBIMQiaoDemo = () => {
  mapWork.showBIMQiaoDemo()
}
const showMaxPipeDemo = () => {
  mapWork.showMaxPipeDemo()
}
const showQxSuofeiyaDemo = () => {
  mapWork.showQxSuofeiyaDemo()
}
const showQxSrsbDemo = () => {
  mapWork.showQxSrsbDemo()
}
</script>
<style scoped lang="less">
.mars-button {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
