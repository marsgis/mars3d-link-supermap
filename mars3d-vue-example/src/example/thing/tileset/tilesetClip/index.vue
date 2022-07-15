<template>
  <mars-dialog :visible="true" right="10" top="10" width="280">
    <div class="f-mb">
      <a-space>
        <mars-button @click="btnDrawExtent">绘制矩形</mars-button>
        <mars-button @click="btnDraw">绘制剪裁区</mars-button>
        <mars-button @click="removeAll">清除</mars-button>
      </a-space>
    </div>

    <div class="f-mb">
      <mars-table :pagination="{ pageSize: 5 }" :row-selection="rowSelection" :dataSource="dataSource" :columns="columns" size="small" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'caozuo'">
            <a-space>
              <mars-icon icon="move-one" color="#f2f2f2" class="icon-vertical-a" @click="flyto(record)" />
              <mars-icon icon="delete" color="#f2f2f2" class="icon-vertical-a" @click="deleted(record)" />
            </a-space>
          </template>
          <template v-else>
            {{ record.name }}
          </template>
        </template>
      </mars-table>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

interface TableItem {
  key: number
  name: string
}

// 表格数据
const columns = [
  {
    title: "裁剪区",
    dataIndex: "name",
    key: "name",
    align: "center"
  },
  {
    title: "操作",
    dataIndex: "caozuo",
    key: "caozuo",
    width: 80,
    align: "center"
  }
]
const dataSource = ref<TableItem[]>([])
// 默认的选项
const rowKeys = ref<string[]>([])

const rowSelection = {
  hideSelectAll: true,
  hideDefaultSelections: true,
  selectedRowKeys: rowKeys,
  onChange: (selectedRowKeys: string[]) => {
    // 使得点击之后选项改变
    rowKeys.value = selectedRowKeys
  },
  onSelect: (record: TableItem, selected: boolean) => {
    mapWork.showHideArea(record.key, selected)
  }
}


mapWork.eventTarget.on("addItem", function (event: any) {
  const item = event.area
  dataSource.value.push({ key: item.id, name: "裁剪区" + item.id })
  rowKeys.value.push(item.id)
})

// 表格的操作
const flyto = (record: TableItem) => {
  mapWork.flyToGraphic(record.key)
}
const deleted = (record: TableItem) => {
  mapWork.deletedGraphic(record.key)

  dataSource.value = dataSource.value.filter((item: any) => item.key !== record.key)
}

// 添加矩形
const btnDrawExtent = () => {
  mapWork.btnDrawExtent()
}
// 绘制剪裁区
const btnDraw = () => {
  mapWork.btnDraw()
}
// 清除
const removeAll = () => {
  mapWork.removeAll()

  // 清除表格
  dataSource.value = []
}
</script>
