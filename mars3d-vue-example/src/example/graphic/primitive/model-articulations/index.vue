<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-tac">
      <mars-select ref="select" v-model:value="groupName" style="width: 200px" :options="selectGroups"
        @change="onChangeGroup"></mars-select>
    </div>

    <div class="f-pt" v-for="rg in currStates" :key="rg.name">
      <a-space>
        <span class="mars-pannel-item-label">{{ rg.name_cn }}</span>
        <mars-slider :min="rg.minimum" :max="rg.maximum" :step="0.1" v-model:value="rg.current"
          @change="onChangeStage(rg)" />
      </a-space>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import * as mapWork from "./map.js"

const groupName = ref("火箭整体")

const selectGroups = ref<any[]>([])

const dataList = ref<any[]>([])

const currStates = ref<any[]>([])

mapWork.eventTarget.on("loadGltfModel", function (event: any) {
  const modelData = event.articulations
  dataList.value = modelData
  for (let i = 0; i < modelData.length; i++) {
    const data = modelData[i]
    selectGroups.value.push({
      value: data.name_cn,
      name: data.name,
      states: data.stages
    })
  }
  const defualt = selectGroups.value.filter((item: any) => item.value === groupName.value)
  group(groupName.value, defualt[0])
})

let selectedGroup: any
// 下拉列表切换，更新参数输入面板
const onChangeGroup = (_value: any, option: any) => {
  group(_value, option)
}

function group(_value: any, option: any) {
  selectedGroup = option
  currStates.value = option.states
}

const onChangeStage = (rg: any) => {
  mapWork.setArticulationStage(selectedGroup.name, rg.name, rg.current)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 160px;
}

.infoView {
  width: 280px;
}
</style>
