<template>
  <mars-dialog :visible="true" right="10" top="10">
    <mars-table :pagination="false" :customRow="rowClick" :columns="columns" :dataSource="dataSource" :row-selection="rowSelection" />
  </mars-dialog>
  <mars-dialog customClass="message-list" :visible="true" right="10" top="500" width="300">
    <div v-for="(msgList, index) in msg" :key="index">
      <p>{{ msgList }}</p>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

interface DataItem {
  key: string | number
  num: number
  carNumber: number
  type: string
}

const dataSource = ref<DataItem[]>([])
// 默认的选项
const rowKeys = ref<string[]>([]) // Check here to configure the default column

const msg = ref<string[]>([])

const arr: DataItem[] = []
const arrKey: string[] = []

mapWork.eventTarget.on("carList", function (event: any) {
  event.tableData.forEach((item: any, index: number) => {
    arr.push({
      key: item.id,
      num: index + 1,
      carNumber: item.name,
      type: item.type === 1 ? "土方车" : "挖掘机"
    })
    arrKey.push(item.id)
  })
  dataSource.value = arr
  rowKeys.value = arrKey
})

mapWork.eventTarget.on("showPath", function (event: any) {
  msg.value.push(event.path)
})

const columns: any[] = [
  {
    title: "序号",
    dataIndex: "num",
    key: "num"
  },
  {
    title: "车牌号",
    dataIndex: "carNumber",
    key: "carNumber"
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type"
  }
]

const rowSelection = ref({
  hideSelectAll: true,
  hideDefaultSelections: true,
  selectedRowKeys: rowKeys,
  onChange: (selectedRowKeys: string[]) => {
    // 使得点击之后选项改变
    rowKeys.value = selectedRowKeys
  },
  onSelect: (record: DataItem, selected: boolean) => {
    // 对车子进行的操作
    mapWork.onSelect(record.key, selected)
  }
})

// 点击行事件
const rowClick = (recode: any) => {
  return {
    onClick: () => {
      mapWork.flyToModel(recode.key)
    }
  }
}
</script>

<style lang="less">
.message-list {
  max-height: 300px;
  overflow: auto;
}
</style>
