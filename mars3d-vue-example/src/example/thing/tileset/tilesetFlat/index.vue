<template>
  <mars-dialog :visible="true" right="10" top="10" width="380">
    <div>
      <a-row :gutter="[5, 10]">
        <a-col :span="6">
          <span class="mars-pannel-item-label">模型:</span>
        </a-col>
        <a-col :span="18">
          <a-space>
            <mars-button @click="showDytDemo">大雁塔</mars-button>
            <mars-button @click="showTehDemo">天鹅湖</mars-button>
            <mars-button @click="showQxShequDemo">某县城</mars-button>
          </a-space>
        </a-col>

        <a-col :span="6">
          <span class="mars-pannel-item-label">开挖区域:</span>
        </a-col>
        <a-col :span="18">
          <a-space>
            <mars-button @click="btnDrawExtent">绘制矩形</mars-button>
            <mars-button @click="btnDraw">绘制多边行</mars-button>
            <mars-button @click="removeAll">清除</mars-button>
          </a-space>
        </a-col>

        <a-col :span="6">
          <span class="mars-pannel-item-label">压平区高度:</span>
        </a-col>
        <a-col :span="10">
          <mars-input-number v-model:value="formState.flatHeight" @change="changeFlatHeight" :step="0.1" />
        </a-col>
        <a-col :span="8" class="miFont">
          <p>（米）</p>
        </a-col>

        <a-col :span="21">
          <a-form-item>
            <a-checkbox v-model:checked="formState.enabledBianJieXian" @change="chkShowLine"> 显示测试边界线 </a-checkbox>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <mars-table :pagination="{ pageSize: 5 }" :row-selection="rowSelection" :dataSource="dataSource"
            :columns="columns" size="small" bordered>
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
        </a-col>
      </a-row>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  enabledBianJieXian: boolean
  flatHeight: number
}

interface TableItem {
  key: number
  name: string
  lineId: string
}

const formState: UnwrapRef<FormState> = reactive({
  enabledBianJieXian: true,
  flatHeight: 0
})
// 表格数据
const columns = [
  {
    title: "压平区域",
    dataIndex: "name",
    key: "name",
    align: "center"
  },
  {
    title: "操作",
    dataIndex: "caozuo",
    key: "caozuo",
    width: 100,
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

  dataSource.value.push({ key: item.id, name: "压平区" + item.id, lineId: item.lineId })
  rowKeys.value.push(item.id)
})

// 飞向对应的矢量数据
const flyto = (record: TableItem) => {
  mapWork.flyToGraphic(record.key)
}
// 移除对应的表格数据
const deleted = (record: TableItem) => {
  mapWork.deletedGraphic(record.key, record.lineId)

  dataSource.value = dataSource.value.filter((item: any) => item.key !== record.key)
}

// 是否显示测试边界线
const chkShowLine = () => {
  mapWork.chkShowLine(formState.enabledBianJieXian)
}

// 添加大雁塔模型
const showDytDemo = () => {
  dataSource.value = [] // 清除表格
  mapWork.showDytDemo()
}
// 添加天鹅湖模型
const showTehDemo = () => {
  dataSource.value = [] // 清除表格
  mapWork.showTehDemo()
}

const showQxShequDemo = () => {
  dataSource.value = [] // 清除表格
  mapWork.showQxShequDemo()
}

// 添加矩形
const btnDrawExtent = () => {
  mapWork.btnDrawExtent(formState.flatHeight)
}
// 添加多边形
const btnDraw = () => {
  mapWork.btnDraw(formState.flatHeight)
}
// 清除
const removeAll = () => {
  mapWork.removeAll()
  // 清除表格
  dataSource.value = []
}
// 改变压平的高度
const changeFlatHeight = () => {
  mapWork.changeFlatHeight(formState.flatHeight)
}
</script>
<style scoped lang="less">
.ant-input-number {
  width: 100%;
}

.miFont {
  margin-top: 10px;
  color: white;
}

:deep(.ant-table-pagination) {
  margin: 16px 0 1px 0 !important;
}

.mars-pannel-item-label {
  padding-top: 4px;
}
</style>
