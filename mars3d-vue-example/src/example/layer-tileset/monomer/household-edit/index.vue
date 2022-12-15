<template>
  <mars-dialog :visible="true" right="10" top="10" width="300">
    <div class="f-mb">
      <a-space>
        <mars-button @click="showAddDataPannel = true" :disabled="showAddDataPannel">新增</mars-button>
        <mars-button @click="onClickSaveJson">导出</mars-button>
        <a-upload
          :multiple="false"
          name="file"
          accept="json,geojson,kml,kmz"
          :showUploadList="false"
          @change="onClickOpenJson"
          :beforeUpload="() => false"
        >
          <mars-button>导入</mars-button>
        </a-upload>
        <mars-button @click="clearData" :disabled="!tableData.length">清除</mars-button>
      </a-space>
    </div>

    <mars-table size="small" bordered :columns="columns" :pagination="{ pageSize: 4 }" :data-source="tableData">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'option'">
          <a-space>
            <mars-icon icon="aiming" color="#f2f2f2" class="icon-vertical-a" title="定位" @click.stop="flyToHouse(record)" />
            <mars-icon icon="edit" color="#f2f2f2" class="icon-vertical-a" title="编辑" @click.stop="editHouseType(record)" />
            <mars-icon icon="delete" color="#f2f2f2" class="icon-vertical-a" title="删除" @click.stop="deleteHouseType(record)" />
          </a-space>
        </template>
      </template>
    </mars-table>
  </mars-dialog>

  <mars-dialog :visible="showAddDataPannel" right="10" top="400" width="300">
    <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="边界">
        <a-row :gutter="5" align="middle">
          <a-col :span="8">
            <span>{{ !dthPara.positions?.length ? "无" : "已绘制" }}</span>
          </a-col>
          <a-col :span="14">
            <mars-button :disabled="isEditing || hasDraw" @click="drawArea">绘制</mars-button>
            <mars-button class="quitDraw" :disabled="isEditing" @click="quitDraw">清除</mars-button>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="最低高" name="minHeight">
        <a-row :gutter="5">
          <a-col :span="15">
            <mars-input-number v-model:value="dthPara.minHeight"></mars-input-number>
          </a-col>
          <a-col :span="5">
            <a-space size="small">
              <mars-button class="small-btn" @click="getMinHeight">拾取</mars-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="最高高" name="maxHeight">
        <a-row :gutter="5">
          <a-col :span="15">
            <mars-input-number v-model:value="dthPara.maxHeight"></mars-input-number>
          </a-col>
          <a-col :span="5">
            <a-space size="small">
              <mars-button class="small-btn" @click="getMaxHeight">拾取</mars-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="层数" name="floorCount">
        <a-row :gutter="5">
          <a-col :span="15">
            <mars-input-number v-model:value="dthPara.floorCount" @change="getInt"></mars-input-number>
          </a-col>
        </a-row>
      </a-form-item>
      <div class="f-tac">
        <a-space>
          <mars-button @click="produceData">生成</mars-button>
          <mars-button @click="closePanle">退出</mars-button>
        </a-space>
      </div>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"
import { $message } from "@mars/components/mars-ui/index"

const showAddDataPannel = ref(false)
const columns = [
  {
    title: "户型",
    dataIndex: "houseType"
  },
  {
    title: "总层数",
    dataIndex: "floorCount",
    align: "center"
  },
  {
    title: "操作",
    dataIndex: "option"
  }
]
const tableData = ref([])

const dthPara = ref<any>({
  maxHeight: 0,
  minHeight: 0,
  floorCount: 1,
  positions: []
})

let drawGraphicId = "" // 画出来的数据

let currentHouseType: any // 当前操作的房型

const isEditing = ref(false) // 正在编辑
const hasDraw = ref(false) // 已经绘制

const produce = () => {
  const produceObj = mapWork.produceData(drawGraphicId, dthPara.value)

  drawGraphicId = ""

  if (produceObj) {
    tableData.value.push({
      houseType: produceObj.houseTypeCount + "号户型",
      floorHeight: produceObj.floorHeight,
      generateGraphicIdArr: produceObj.generateGraphicIdArr,
      ...dthPara.value
    })

    hasDraw.value = false
    isEditing.value = true
  }
}

// 根据楼高生成每层
const produceData = () => {
  if (isEditing.value) {
    return editProduceData()
  }

  if (!hasDraw.value && dthPara.value.positions.length === 0) {
    return $message("请先绘制区域")
  }
  produce()
}

// 编辑中的生成
const editProduceData = () => {
  tableData.value.forEach((item) => {
    if (item.positions === currentHouseType) {
      const resultData = mapWork.produceData(drawGraphicId, dthPara.value, item.generateGraphicIdArr)
      if (resultData) {
        item.generateGraphicIdArr = resultData.generateGraphicIdArr
        item.floorHeight = resultData.floorHeight

        item.floorCount = dthPara.value.floorCount
        item.maxHeight = dthPara.value.maxHeight
        item.minHeight = dthPara.value.minHeight
      }
    }
  })
}

// 打开GeoJSON
const onClickOpenJson = (info) => {
  clearData()
  mapWork.openGeoJSON(info.file, openGeoJSONEnd)
}

function openGeoJSONEnd(graphics: any) {
  // 查看共所有号房型
  const houseTypeCounts = graphics
    .map((graphic) => {
      return graphic.attr.houseTypeCount
    })
    .reduce((pre, cur) => {
      if (pre.includes(cur)) {
        return pre
      } else {
        return pre.concat(cur)
      }
    }, [])

  houseTypeCounts.forEach((houseType: string) => {
    let dthPara = {
      floorCount: 0,
      generateGraphicIdArr: []
    }
    graphics
      .filter((graphic) => graphic.attr.houseTypeCount === houseType)
      .map((graphic) => {
        dthPara = {
          ...dthPara,
          ...graphic.attr,
          floorCount: graphic.attr.allFloor
        }

        dthPara.generateGraphicIdArr.push(graphic.id)
        return graphic
      })
    tableData.value.push(dthPara)
  })
}

// 点击保存GeoJSON
const onClickSaveJson = () => {
  mapWork.saveGeoJSON()
}

// 绘制区域
const drawArea = () => {
  clearPannelData()

  mapWork.addData().then((graphic) => {
    drawGraphicId = graphic.id
    dthPara.value.positions = []
    graphic.points.forEach((item) => {
      dthPara.value.positions.push([item.lng, item.lat])
    })
    currentHouseType = dthPara.value.positions
    hasDraw.value = true
  })
}

const clearPannelData = () => {
  dthPara.value = {
    maxHeight: 0,
    minHeight: 0,
    floorCount: 1,
    positions: []
  }
  isEditing.value = false
}

// 拾取底部高度
const getMinHeight = () => {
  mapWork.getBuildingHeight().then((data) => {
    dthPara.value.minHeight = data.height
  })
}

// 拾取顶部高度
const getMaxHeight = () => {
  mapWork.getBuildingHeight().then((data) => {
    dthPara.value.maxHeight = data.height
  })
}

// 编辑房型
const editHouseType = (data) => {
  isEditing.value = true

  dthPara.value = {
    maxHeight: data.maxHeight,
    minHeight: data.minHeight,
    floorCount: data.floorCount,
    positions: data.positions
  }

  currentHouseType = dthPara.value.positions
  showAddDataPannel.value = true
}

// 删除房型
const deleteHouseType = (data) => {
  // 删除图层数据
  data.generateGraphicIdArr.forEach((id: string) => {
    mapWork.quitDraw(id)
  })
  // 删除表格中的数据
  tableData.value = tableData.value.filter((item) => item.positions !== data.positions)

  if (isEditing.value) {
    showAddDataPannel.value = false
    isEditing.value = false
    clearPannelData()
  }
}

// 定位房型
const flyToHouse = (data) => {
  mapWork.map.flyToPositions(data.positions)
}

// 取消绘制
const quitDraw = () => {
  if (drawGraphicId) {
    mapWork.quitDraw(drawGraphicId)
    hasDraw.value = false
    dthPara.value.positions = []
  }
}

// 退出
const closePanle = () => {
  clearPannelData()
  mapWork.quitDraw(drawGraphicId)
  dthPara.value.positions = []

  showAddDataPannel.value = false
  hasDraw.value = false
  isEditing.value = false
  drawGraphicId = ""
}

const getInt = () => {
  dthPara.value.floorCount = parseInt(dthPara.value.floorCount + "")
  if (dthPara.value.floorCount * 1 <= 0) {
    $message("层数最少为1层")
    dthPara.value.floorCount = 1
  }
}

// 清除数据
const clearData = () => {
  clearPannelData()
  mapWork.clearAllData()
  tableData.value = []
  dthPara.value.positions = []
  isEditing.value = false
  showAddDataPannel.value = false
}
</script>
<style lang="less" scoped>
.quitDraw {
  margin-left: 5px;
}
</style>
