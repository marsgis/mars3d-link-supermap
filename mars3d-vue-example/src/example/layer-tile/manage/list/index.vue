<template>
  <mars-dialog :visible="true" right="10" top="10" bottom="40" width="250">
    <mars-tree checkable :tree-data="treeData" v-model:expandedKeys="expandedKeys" v-model:checkedKeys="checkedKeys" @check="checkedChange">
      <template #title="{ title }">
        <span>{{ title }}</span>
      </template>
    </mars-tree>
  </mars-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import * as mapWork from "./map.js"

const treeData = ref<any[]>([])

const expandedKeys = ref<string[]>([])

const checkedKeys = ref<string[]>([])

const layersObj: any = {}

onMounted(() => {
  initTree()
})

const checkedChange = (keys: string[], e: any) => {
  const layer = layersObj[e.node.key]

  if (layer) {
    if (!layer.isAdded) {
      mapWork.addLayer(layer)
    }

    // 处理子节点
    if (e.node.children && e.node.children.length) {
      renderChildNode(keys, e.node.children)
    }

    if (keys.indexOf(e.node.key) !== -1) {
      layer.show = true
      layer.flyTo()
    } else {
      layer.show = false
    }
  }
}

function renderChildNode(keys: string[], children: any[]) {
  children.forEach((child) => {
    const layer = layersObj[child.key]
    if (layer) {
      if (!layer.isAdded) {
        mapWork.addLayer(layer)
      }

      if (keys.indexOf(child.key) !== -1) {
        layer.show = true
      } else {
        layer.show = false
      }
      if (child.children) {
        renderChildNode(keys, child.children)
      }
    }
  })
}

// 初始化树构件
const initTree = () => {
  const layers = mapWork.getLayers()

  // 遍历出config.json中所有的basempas和layers
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i]

    if (layer && layer.pid === -1) {
      const node: any = {
        title: layer.name,
        key: layer.id,
        id: layer.id,
        pId: layer.pid,
        group: layer.type === "group"
      }
      node.children = findChild(node, layers)
      treeData.value.push(node)
      layersObj[layer.id] = layer
      expandedKeys.value.push(node.key)
    }
  }
}

function findChild(parent: any, list: any[]) {
  return list
    .filter((item: any) => item.pid === parent.id)
    .map((item: any) => {
      const node: any = {
        title: item.name,
        key: item.id,
        id: item.id,
        pId: item.pid,
        group: item.type === "group"
      }
      layersObj[item.id] = item
      expandedKeys.value.push(node.key)

      if (item.hasEmptyGroup || item.hasChildLayer) {
        node.children = findChild(node, list)
      }
      if (item.isAdded && item.show) {
        checkedKeys.value.push(node.key)
      }
      return node
    })
}
</script>

<style>
.pannel-content {
  overflow-y: auto !important;
}
</style>
<style scoped lang="less">
:deep(.ant-form-item) {
  margin-bottom: 10px;
}
</style>
