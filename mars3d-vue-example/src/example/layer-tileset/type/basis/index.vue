<template>
  <mars-dialog :visible="true" right="10" top="10" width="308">
    <a-collapse v-model:activeKey="activeKey">
      <!-- 自定义切换图标 -->
      <template #expandIcon>
        <mars-icon icon="down-c" class="icon-vertical-a" />
      </template>
      <a-collapse-panel key="1" header="3D Tiles示例">
        <div class="basis-button-contain">
          <mars-button @click="showJzwHefeiDemo">城市白膜(合肥)</mars-button>
          <mars-button @click="showMaxShihuaDemo">人工建模(石化工厂)</mars-button>
          <mars-button @click="showBimQiaoliangDemo">BIM建模(桥梁)</mars-button>
          <mars-button @click="showBimDitiezhanDemo">BIM建模(地铁站)</mars-button>
          <mars-button @click="showQxShequDemo">倾斜摄像(某县城)</mars-button>
          <mars-button @click="showQxSimiaoDemo">倾斜摄像(某景区)</mars-button>
          <mars-button @click="showPntsGantaDemo">点云(高压线塔杆)</mars-button>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="2" header="相关控制">
        <div class="f-mb">
          <a-space>
            <a-checkbox v-model:checked="formState.enabledShowTerrain" @change="bindTestTerrain">深度检测</a-checkbox>
            <a-checkbox v-model:checked="formState.enabledWireframe" @change="bindWireframe">模型三角网</a-checkbox>
          </a-space>
        </div>

        <div class="f-mb">
          <a-space>
            <a-checkbox v-model:checked="formState.enabledBoundbox" @change="bindBoundbox">模型包围盒</a-checkbox>
            <a-checkbox v-model:checked="formState.enabledGfirstperson" @change="bindGfirstperson">键盘漫游</a-checkbox>
          </a-space>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="3" header="参数编辑">
        <mars-button href="editor-vue.html?id=layer-tileset/manager/edit" target="_blank">模型参数调试编辑</mars-button>
      </a-collapse-panel>
    </a-collapse>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"

import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"
const activeKey = ref(["1", "2", "3"])

interface FormState {
  enabledShowTerrain: boolean
  enabledWireframe: boolean
  enabledBoundbox: boolean
  enabledGfirstperson: boolean
}

const formState: UnwrapRef<FormState> = reactive({
  enabledShowTerrain: false,
  enabledWireframe: false,
  enabledBoundbox: false,
  enabledGfirstperson: false
})

const bindTestTerrain = () => {
  mapWork.bindTestTerrain(formState.enabledShowTerrain)
}
const bindWireframe = () => {
  mapWork.bindWireframe(formState.enabledWireframe)
}
const bindBoundbox = () => {
  mapWork.bindBoundbox(formState.enabledBoundbox)
}
const bindGfirstperson = () => {
  mapWork.bindGfirstperson(formState.enabledGfirstperson)
}

const showQxShequDemo = () => {
  mapWork.showQxShequDemo()
}
const showQxSimiaoDemo = () => {
  mapWork.showQxSimiaoDemo()
}
const showJzwHefeiDemo = () => {
  mapWork.showJzwHefeiDemo()
}
const showPntsGantaDemo = () => {
  mapWork.showPntsGantaDemo()
}
const showMaxShihuaDemo = () => {
  mapWork.showMaxShihuaDemo()
}
const showBimQiaoliangDemo = () => {
  mapWork.showBimQiaoliangDemo()
}
const showBimDitiezhanDemo = () => {
  mapWork.showBimDitiezhanDemo()
}
</script>
<style scoped lang="less">
.basis-button-contain {
  .mars-button {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
</style>
