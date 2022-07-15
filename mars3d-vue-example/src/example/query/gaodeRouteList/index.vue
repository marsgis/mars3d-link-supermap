<template>
  <mars-dialog :visible="true" right="10" top="10" width="300">
    <a-form>
      <a-form-item label="方式">
        <mars-select class="selectWidth" v-model:value="selectWay" :options="selectWayOptions" @change="onHiddenRoam"> </mars-select>
      </a-form-item>

      <a-form-item label="起点">
        <a-space>
          <mars-input class="inputWidth" v-model:value="strat" disabled></mars-input>
          <mars-button @click="startPoint">选点</mars-button>
        </a-space>
      </a-form-item>
      <a-form-item label="终点">
        <a-space>
          <p class="inputWidth">
            共<span style="color: red">{{ count }}</span
            >条POI点
          </p>
          <mars-button @click="endPoint">查询</mars-button>
        </a-space>
      </a-form-item>

      <div class="f-tac">
        <a-space>
          <mars-button @click="btnAnalyse">开始分析</mars-button>
          <mars-button @click="removeAll">清除</mars-button>
        </a-space>
      </div>

      <div v-show="dataSource.length > 0">
        <mars-table
          :pagination="false"
          :dataSource="dataSource"
          :columns="columns"
          :custom-row="customRow"
          size="small"
          bordered
          :scroll="{ y: 300 }"
        ></mars-table>
      </div>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

interface DataItem {
  key: number
  index: number
  name: string
  length: number
  time: string
  graphic: any
}

const strat = ref("")
const count = ref(0)
const selectWay = ref("1")

// 表格数据
const dataSource = ref<any[]>([])
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: 50
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "总距离",
    dataIndex: "length",
    key: "length"
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time"
  }
]

const customRow = (record: DataItem) => {
  return {
    onClick: () => {
      mapWork.centerAtRoute(record.graphic)
    }
  }
}
// 下拉菜单
const selectWayOptions = ref([
  {
    // 1-步行路线
    value: "1",
    label: "步行路线查询"
  },
  {
    // 2-行车路线
    value: "3",
    label: "驾车路线查询"
  }
])

// 起点
const startPoint = async () => {
  const stratPoint: any = await mapWork.startPoint()
  strat.value = stratPoint
}

// 终点POI
const endPoint = () => {
  mapWork.endPoint()
}

mapWork.eventTarget.on("end", (event: any) => {
  count.value = event.count
})

const onHiddenRoam = (data) => {
  if (strat.value && count.value !== 0) {
    btnAnalyse()
  }
}
// 开始分析
const btnAnalyse = () => {
  dataSource.value = []
  mapWork.btnAnalyse(selectWay.value, count.value)
}

mapWork.eventTarget.on("analyse", (event: any) => {
  dataSource.value.push({
    key: event.i,
    index: event.i + 1,
    name: event.name,
    length: event.distance,
    time: event.time,
    graphic: event.id
  })
})

// 清除数据
const removeAll = () => {
  mapWork.removeAll()
  dataSource.value = []
  strat.value = ""
  count.value = 0
}
</script>
<style scoped lang="less">
.selectWidth {
  width: 210px;
}
.inputWidth {
  width: 150px;
}
</style>
