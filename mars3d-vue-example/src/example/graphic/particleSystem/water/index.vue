<template>
  <mars-dialog :visible="true" right="10" top="10" width="160">
    <mars-tree checkable defaultExpandAll :tree-data="treeData" @check="checkedChange" v-model:checkedKeys="checkedKeys">
      <template #title="{ title }">
        <span class="tree-style" :title="title">{{ title }}</span>
      </template>
    </mars-tree>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const checkedKeys = ref<string[]>([]) // 默认选中

const treeData = ref<any[]>([
  {
    title: "全部",
    key: 0,
    id: -1,
    children: [
      {
        title: "1号",
        key: 1
      },
      {
        title: "2号",
        key: 2
      },
      {
        title: "3号",
        key: 3
      },
      {
        title: "4号",
        key: 4
      },
      {
        title: "5号",
        key: 5
      },
      {
        title: "6号",
        key: 6
      },
      {
        title: "7号",
        key: 7
      },
      {
        title: "8号",
        key: 8
      },
      {
        title: "9号",
        key: 9
      },
      {
        title: "10号",
        key: 10
      },
      {
        title: "11号",
        key: 11
      },
      {
        title: "12号",
        key: 12
      },
      {
        title: "13号",
        key: 13
      }
    ]
  }
])

// 初始化树
const initTree = () => {
  const tree = treeData.value[0].children
  tree.forEach((element: any) => {
    checkedKeys.value.push(element.key)
  })
}

initTree()

const checkedChange = (keys: string[], checkedNodes: any) => {
  const chilrenAll = checkedNodes.node.children
  const checkedId: number = checkedNodes.node.key
  const ischecked: boolean = checkedNodes.node.checked
  if (chilrenAll && chilrenAll.length >= 12) {
    mapWork.bindShowAll(!ischecked)
  }

  mapWork.onChangeGate(checkedId, ischecked)
}
</script>
