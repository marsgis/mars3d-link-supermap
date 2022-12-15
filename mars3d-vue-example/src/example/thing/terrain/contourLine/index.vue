<template>
  <mars-dialog :visible="true" right="10" top="10" width="400">
    <a-form-item label="限定区域:" :labelCol="labelCol" :labelAlign="labelAlign">
      <a-space>
        <mars-button @click="btnDrawExtent">添加矩形</mars-button>
        <mars-button @click="btnDraw">添加多边形</mars-button>
        <mars-button @click="clearAll">清除</mars-button>
      </a-space>
    </a-form-item>

    <mars-gui :options="options" :labelCol="5" ref="marsGuiRef"></mars-gui>

    <div class="f-pt">
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
import { nextTick, ref } from "vue"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"

const marsGuiRef = ref()
const options: GuiItem[] = [
  {
    type: "switch",
    field: "type",
    label: "等高线",
    value: true,
    change(data) {
      mapWork.showDengGX(data)
      marsGuiRef.value.updateField("type", data)
    }
  },
  {
    type: "color",
    field: "colorValue",
    label: "颜色",
    value: "#FF0F00",
    change(data) {
      mapWork.changeColor(data)
    },
    show(data) {
      return data.type !== false
    }
  },
  {
    type: "slider",
    field: "gapValue",
    label: "间隔(米)",
    step: 1.0,
    min: 10.0,
    max: 500.0,
    value: 80,
    change(data) {
      mapWork.changeSpacing(data)
    },
    show(data) {
      return data.type !== false
    }
  },
  {
    type: "slider",
    field: "lineWidth",
    label: "线宽(px)",
    step: 0.1,
    min: 1.0,
    max: 10.0,
    value: 2.3,
    change(data) {
      mapWork.changeWidth(data)
    },
    show(data) {
      return data.type !== false
    }
  },
  {
    type: "radio",
    field: "xrValue",
    label: "地表渲染",
    value: "none",
    data: [
      {
        label: "无",
        value: "none"
      },
      {
        label: "高程",
        value: "elevation"
      },
      {
        label: "坡度",
        value: "slope"
      },
      {
        label: "坡向",
        value: "aspect"
      }
    ],
    change(data) {
      mapWork.changeShadingType(data)
    }
  },
  {
    type: "switch",
    field: "control",
    label: "状态控制",
    extra: "显示其它区域",
    extraWidth: 180,
    value: true,
    change(data) {
      mapWork.chkClippingPlanes(data)
    }
  }
]

interface TableItem {
  key: number
  name: string
}

const labelCol = ref({ span: 5 })
const labelAlign = ref("right")

// 表格数据
const columns = ref([
  {
    title: "开挖区域",
    dataIndex: "name",
    key: "name",
    align: "center"
  },
  {
    title: "操作",
    dataIndex: "caozuo",
    key: "caozuo",
    align: "center",
    width: 100
  }
])
const dataSource = ref([])
const rowKeys = ref<number[]>([])

const rowSelection = ref({
  hideSelectAll: true,
  hideDefaultSelections: true,
  selectedRowKeys: rowKeys,
  onChange: (selectedRowKeys: number[]) => {
    // 使得点击之后选项改变
    rowKeys.value = selectedRowKeys
  },
  onSelect: (record: TableItem, selected: boolean) => {
    mapWork.showHideArea(record.key, selected)
  }
})

mapWork.eventTabel.on("tableObject", function (event: any) {
  dataSource.value = []
  nextTick(() => {
    dataSource.value = event.tableItem.table
    rowKeys.value.push(event.tableItem.key)
  })
})

// 定位和删除
const flyto = (record: any) => {
  mapWork.flyToGraphic(record.key)
}
const deleted = (record: any) => {
  mapWork.deletedGraphic(record.key)
  dataSource.value = dataSource.value.filter((item: any) => item.key !== record.key)

  mapWork.changeTable(dataSource.value)
}

// 添加矩形
const btnDrawExtent = () => {
  mapWork.btnDrawExtent()
}
// 添加多边形
const btnDraw = () => {
  mapWork.btnDraw()
}
// 清除
const clearAll = () => {
  mapWork.clearAll()

  // formState.showElse = true
  // 清除表格
  dataSource.value = []
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 140px;
}
.miFont {
  margin-top: 6px;
  margin-left: -11px;
}
</style>
