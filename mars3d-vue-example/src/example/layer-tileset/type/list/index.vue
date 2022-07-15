<template>
  <mars-dialog :visible="true" right="10" top="10" width="240" customClass="layer-tree">
    <mars-tree checkable :tree-data="treeData" v-model:expandedKeys="expandedKeys" v-model:checkedKeys="checkedKeys" @check="checkedChange">
      <template #title="{ title }">
        <span>{{ title }}</span>
      </template>
    </mars-tree>
  </mars-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import * as mapWork from "./map.js"

const treeData = ref<any[]>([])

const expandedKeys = ref<string[]>([])

const checkedKeys = ref<string[]>([])

const layersObj: any = {}

const state = ref(false)
const state2 = ref(false)

let treeModelData: any = {}
let tianLayer // 暂存天鹅湖模型

mapWork.eventTarget.on("loadTypeList", function (event: any) {
  treeModelData = event.modelData
  initTree()
})

const checkedChange = (_keys: string[], item: any) => {
  const node = item.node
  const layer = layersObj[node.key]
  const isChildern = node.children
  console.log("node", node)

  if (layer && !layer.show) {
    layer.show = true
  }

  // 增添模型
  if (isChildern.length === 0 && !node.checked) {
    mapWork.addLayer(layer)

    if (node.title === "合肥市区") {
      // 城市白模
      tianLayer = layer
      state2.value = true
      if (state.value === true) {
        // 判断倾斜摄影天鹅湖模型存在，重新切割防止重叠
        mapWork.cutModel(layer)
      }
    }

    if (node.title === "合肥天鹅湖" && !node.checked) {
      // 倾斜摄影天鹅湖
      state.value = true
      if (state2.value === true) {
        mapWork.cutModel(tianLayer)
      }
    }
  }

  // 处理子节点
  if (item.node.children && item.node.children.length) {
    renderChildNode(_keys, item.node.children)
  }

  // 删除模型
  if (isChildern.length === 0 && node.checked) {
    layer.show = false

    if (node.title === "合肥天鹅湖") {
      state.value = false
    }

    if (node.title === "合肥市区") {
      state2.value = false
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

function initTree() {
  const layers = treeModelData
  // 遍历出config.json中所有的basempas和layers
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = mapWork.createLayer(mapWork.createLayer(layers[i])) // 创建图层
    if (layer && layer.pid === 20) {
      const node: any = {
        title: layer.name,
        key: layer.id,
        id: layer.id,
        pId: layer.pid
      }
      node.children = findChild(node, layers)
      treeData.value.push(node)
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
        pId: item.pid
      }
      const nodeLayer = mapWork.createLayer(item) // 创建图层
      layersObj[item.id] = nodeLayer
      node.children = findChild(node, list)
      expandedKeys.value.push(node.key)
      if (item.isAdded && item.show) {
        checkedKeys.value.push(node.key)
      }
      return node
    })
}
</script>

<style lang="less" scoped>
.layer-tree {
  vertical-align: top !important;
}
</style>
