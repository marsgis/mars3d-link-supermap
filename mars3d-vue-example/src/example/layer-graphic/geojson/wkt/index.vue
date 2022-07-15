<template>
  <mars-dialog :visible="true" right="10" top="10" >
    <layer-state />
  </mars-dialog>

  <mars-dialog :visible="true" right="10" top="64" width="250">
    <mars-tree checkable :tree-data="treeData" @check="checkedChange" v-model:checkedKeys="checkedKeys" v-model:expandedKeys="expandedKeys">
      <template #title="{ title }">
        <span class="tree-style" :title="title">{{ title }}</span>
      </template>
    </mars-tree>
  </mars-dialog>
</template>
<script lang="ts" setup>
import LayerState from "@mars/components/mars-sample/layer-state.vue"
import { nextTick, ref } from "vue"
import * as mapWork from "./map.js"

const treeData = ref<any[]>([
  {
    title: "全部",
    key: 0,
    id: -1,
    children: []
  }
])

const checkedKeys = ref<string[]>([])
const expandedKeys = ref<any[]>([])
expandedKeys.value.push(0)
let layersObj: any = {}

mapWork.treeEvent.on("tree", (event: any) => {
  initTree(event.data)
})

const checkedChange = (_keys: string[], checkedNodes: any) => {
  const show = checkedNodes.checked
  const entity = layersObj[checkedNodes.node.id]

  if (checkedNodes.node.id === -1) {
    Object.keys(layersObj).forEach((k) => {
      const layer = layersObj[k]
      layer.graphic.show = show
    })
    return
  }

  if (!show) {
    entity.graphic.show = show
  } else {
    entity.graphic.show = show
    entity.graphic.flyTo()
  }
}

function initTree(dataItems: any) {
  // 重置上一次的树状数据
  treeData.value[0].children = []
  layersObj = {}

  const children: any[] = []
  const dataKeys: any = []

  // 遍历出所有的树状数据
  for (let i = 0; i < dataItems.length; i++) {
    const layer = dataItems[i]
    if (layer) {
      const key = "01-" + Math.random()
      children.push({
        title: layer.airportName,
        key: key,
        id: layer.graphic.id
      })

      if (layer.graphic.show) {
        dataKeys.push(key)
      }
      layersObj[layer.graphic.id] = layer
    }
  }
  treeData.value[0].children = children

  nextTick(() => {
    checkedKeys.value = dataKeys
  })
}
</script>
