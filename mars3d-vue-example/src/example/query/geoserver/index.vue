<template>
  <mars-dialog :visible="true" right="10" top="10" width="400">
    <a-form>
      <a-form-item label="名称">
        <mars-input class="inputServe" v-model:value="serverName" placeholder="请输入查询关键字"></mars-input>
      </a-form-item>

      <a-form-item label="范围">
        <a-space>
          <mars-button @click="drawRectangle">框选范围</mars-button>
          <mars-button @click="drawCircle">圆形范围</mars-button>
          <mars-button @click="drawPolygon">多边形范围</mars-button>
        </a-space>
      </a-form-item>

      <a-form-item label="范围">
        <a-space>
          <mars-button @click="query">查询</mars-button>
          <mars-button @click="removeAll">清除</mars-button>
        </a-space>
      </a-form-item>

      <div v-show="showTable">
        <a-form-item>
          <mars-table
            :pagination="true"
            :dataSource="dataSource"
            :columns="columns"
            :custom-row="customRow"
            size="small"
            bordered
            :scroll="{ y: 400 }"
          />
        </a-form-item>
      </div>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { computed, ref, toRaw } from "vue"
import * as mapWork from "./map.js"
import { $message } from "@mars/components/mars-ui/index"

interface DataItem {
  key: number
  name: string
  age: number
  address: string
  graphic: any
}

const serverName = ref("")
const showTable = computed(() => dataSource.value.length > 0)

// 表格数据
const dataSource = ref([])

mapWork.eventTarget.on("befortUI", function (event: any) {
  dataSource.value = []
  event.list.forEach((item: any, index: number) => {
    dataSource.value.push({ key: index, name: item["项目名称"], type: item["设施类型"], address: item["具体位置"], graphic: item.graphic })
  })
})

const columns = ref([
  {
    title: "名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    width: 50
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address"
  }
])

const customRow = (record: DataItem) => {
  return {
    onClick: () => {
      if (record.graphic == null) {
        $message(record.name + " 无经纬度坐标信息！")
        return
      }
      mapWork.flyToGraphic(toRaw(record.graphic))
    }
  }
}

// 绘制范围
const drawRectangle = () => {
  mapWork.drawRectangle()
}

const drawCircle = () => {
  mapWork.drawCircle()
}

const drawPolygon = () => {
  mapWork.drawPolygon()
}

// 查询数据
const query = () => {
  dataSource.value = []
  mapWork.clearAll(true)
  mapWork.query(serverName.value)
}

// 清除数据
const removeAll = () => {
  dataSource.value = []
  mapWork.clearAll()
}
</script>
<style scoped lang="less">
.inputServe {
  width: 250px;
}
</style>
