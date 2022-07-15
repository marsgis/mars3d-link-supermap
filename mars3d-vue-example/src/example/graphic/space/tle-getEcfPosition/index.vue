<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">过境区域:</span>
        <mars-button @click="drawRectangle">框选</mars-button>
        <mars-button @click="drawCircle">圆形</mars-button>
        <mars-button @click="drawPolygon">多边形</mars-button>
        <mars-button @click="drawClear">清除</mars-button>
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">开始时间:</span>
        <mars-date-picker v-model:value="startTime" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">结束时间:</span>
        <mars-date-picker v-model:value="endTime" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label"></span>
        <mars-button @click="startFX">开始分析</mars-button>
        <mars-button @click="clearResult">清除</mars-button>
      </a-space>
    </div>

    <mars-table size="small" :pagination="{ pageSize: 5 }" :columns="columns" :data-source="pathData">
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'name'">
          <a>{{ text }}</a>
        </template>
      </template>
    </mars-table>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import dayjs, { Dayjs } from "dayjs"
import * as mapWork from "./map.js"

const columns = [
  {
    title: "卫星名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "进入时间",
    dataIndex: "inTime",
    key: "inTime"
  },
  {
    title: "飞出时间",
    dataIndex: "outTime",
    key: "outTime"
  },
  {
    title: "飞行时长",
    dataIndex: "often",
    key: "often"
  },
  {
    title: "飞行距离",
    dataIndex: "distance",
    key: "distance"
  }
]

const startTime = ref<Dayjs>(dayjs())
const endTime = ref<Dayjs>(dayjs().add(60, "minute"))
const pathData = ref([])

mapWork.eventTarget.on("dataList", (e: any) => {
  pathData.value = e.tableList
})

// 框选查询 矩形
const drawRectangle = () => {
  mapWork.drawRectangle()
}
// 框选查询   多边
const drawPolygon = () => {
  mapWork.drawPolygon()
}
// 框选查询   圆
const drawCircle = () => {
  mapWork.drawCircle()
}

const drawClear = () => {
  mapWork.drawClear()
}

const clearResult = () => {
  pathData.value = []
  mapWork.clearResult()
}

const startFX = () => {
  const startTimes = dayjs(startTime.value).valueOf()
  const endTimes = dayjs(endTime.value).valueOf()
  mapWork.startFX(startTimes, endTimes)
}
</script>
