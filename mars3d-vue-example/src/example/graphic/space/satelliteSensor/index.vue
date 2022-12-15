<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state
      :defaultCount="5"
      :interaction="false"
      :customEditor="'satelliteSensor'"
      @onStartEditor="onStartEditor"
      @onStopEditor="onStopEditor"
      ref="graphicLayerStateRef"
    />
  </mars-dialog>

  <!-- 左侧面板 -->
  <mars-dialog
    left="10"
    top="10"
    :visible="formState.selectedGraphic"
    :title="formState.pannelTitle"
    :closeable="true"
    :beforeClose="
      () => {
        formState.selectedGraphic = false
      }
    "
  >
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">视椎体状态:</span>
        <a-checkbox v-model:checked="formState.enabledShowHide" @change="sensorShowHide">显示/隐藏</a-checkbox>
        <mars-button @click="locate">定位至卫星</mars-button>
        <mars-button href="editor-vue.html?id=graphic/space/satelliteSensor-multi" target="_blank">双锥体示例</mars-button>
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">颜色</span>
        <mars-color-picker @change="onChangeColor" v-model:value="formState.areaColor" />
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">经度:</span>
        <mars-input-number @change="positionChange" v-model:value="formState.model_x" class="inputNum"></mars-input-number>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">经度:</span>
        <mars-input-number @change="positionChange" v-model:value="formState.model_y" class="inputNum"></mars-input-number>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">高度:</span>
        <mars-input-number @change="positionChange" v-model:value="formState.model_z" class="inputNum"></mars-input-number
      ></a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">轨迹方向:</span>
        <mars-slider @change="headingChange" v-model:value="formState.headingValue" :min="0" :max="360" :step="1" />当前值{{ formState.headingValue }}
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">前后侧摆:</span>
        <mars-slider @change="pitchChange" v-model:value="formState.pitchValue" :min="-180" :max="180" :step="1" />当前值{{ formState.pitchValue }}
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">左右侧摆:</span>
        <mars-slider @change="rollChange" v-model:value="formState.rollValue" :min="-180" :max="180" :step="1" />当前值{{ formState.rollValue }}
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">参考系轴:</span>
        <a-checkbox v-model:checked="formState.enabledShowMatrix" @change="chkShowModelMatrix">显示/隐藏</a-checkbox>
        <a-checkbox v-show="formState.enabledShowHide" v-model:checked="formState.enabledIntersect" @change="chkUnderground">求交地球</a-checkbox>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">轴长度:</span>
        <mars-slider @change="lengthChange" v-model:value="formState.matrixLength" :min="1" :max="10000" :step="1" />当前值{{
          formState.matrixLength
        }}
      </a-space>
    </div>

    <div class="showHide" v-show="formState.enabledShowHide">
      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">类型:</span>
          <a-radio-group v-model:value="sensorType" name="radioGroup" @change="chkSensorType">
            <a-radio value="1">圆锥体</a-radio>
            <a-radio value="2">四棱锥体</a-radio>
          </a-radio-group>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">夹角1:</span>
          <mars-slider @change="angle1" v-model:value="formState.angleValue1" :min="0" :max="89" :step="0.001" />当前值{{ formState.angleValue1 }}
        </a-space>
      </div>

      <div class="f-mb" v-if="sensorType === '2'">
        <a-space>
          <span class="mars-pannel-item-label">夹角2:</span>
          <mars-slider @change="angle2" v-model:value="formState.angleValue2" :min="0" :max="89" :step="0.001" />当前值{{ formState.angleValue2 }}
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">地面成像区:</span>
          <mars-button @click="getRegion">获取区域边界值</mars-button>
          <mars-button @click="getCenter">获取中心点坐标</mars-button>
          <mars-button @click="clear">清除</mars-button>
        </a-space>
      </div>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import { reactive, ref, onMounted } from "vue"
import * as mapWork from "./map.js"

const sensorType = ref<string>("2")

interface SatelliteSensor {
  enabledShowHide: boolean
  enabledIntersect: boolean
  enabledShowMatrix: boolean // 参考轴系

  model_x: number
  model_y: number
  model_z: number
  matrixLength: number
  angleValue1: number // 角度
  angleValue2: number
  headingValue: number // 方向
  pitchValue: number // 仰角s
  rollValue: number // 左右
  areaColor: string // 颜色
  pannelTitle: string
  selectedGraphic: boolean
}

const formState = reactive<SatelliteSensor>({
  enabledShowHide: true,
  enabledIntersect: false,
  enabledShowMatrix: true,

  model_x: 117.169969, // 经度
  model_y: 31.840886, // 纬度
  model_z: 9980000, // 高度
  matrixLength: 30,
  // 角度
  angleValue1: 5, // 夹角1
  angleValue2: 10, // 夹角2
  headingValue: 0, // 轨迹方向
  pitchValue: 9, //  前后侧摆
  rollValue: 0, // 左右侧摆
  areaColor: "rgba(255,0,0,0.5)",
  pannelTitle: "",
  selectedGraphic: false
})

// 点击表格开始编辑矢量数据的参数
function onStartEditor(data) {
  const graphic = mapWork.getGraphic(data.graphicId)
  formState.pannelTitle = data.graphicName

  formState.angleValue1 = graphic?.angle
  formState.angleValue2 = graphic?.angle2

  formState.selectedGraphic = true
}
function onStopEditor() {
  formState.selectedGraphic = false
}

onMounted(() => {
  mapWork.addDemoGraphic1(formState)
})

// 显示/隐藏
const sensorShowHide = () => {
  mapWork.sensorShowHide(formState.enabledShowHide)
}

// 方向角
const headingChange = () => {
  mapWork.headingChange(formState.headingValue)
}

// 俯仰角
const pitchChange = () => {
  mapWork.pitchChange(formState.pitchValue)
}

// 左右角
const rollChange = () => {
  mapWork.rollChange(formState.rollValue)
}
const lengthChange = () => {
  mapWork.lengthChange(formState.matrixLength)
}

// 夹角
const angle1 = () => {
  mapWork.angle1(formState.angleValue1)
}
const angle2 = () => {
  mapWork.angle2(formState.angleValue2)
}
// 定位至模型
const locate = () => {
  mapWork.locate()
}

// 坐标改变
const positionChange = () => {
  mapWork.updatePosition(formState.model_x, formState.model_y, formState.model_z)
}

const clear = () => {
  mapWork.clearAll()
}
const getRegion = () => {
  mapWork.getRegion()
}

const getCenter = () => {
  mapWork.getCenter()
}

// 参考轴系显示与隐藏
const chkShowModelMatrix = () => {
  mapWork.chkShowModelMatrix(formState.enabledShowMatrix)
}

// 是否与地球相交
const chkUnderground = () => {
  mapWork.chkUnderground(formState.enabledIntersect)
}

// 类型选择
const chkSensorType = () => {
  mapWork.chkSensorType(sensorType.value)
}
const onChangeColor = () => {
  mapWork.updateColor(formState.areaColor)
}

let graphicLayer: any
const graphicLayerStateRef = ref()
mapWork.eventTarget.on("addTableData", function (event: any) {
  graphicLayer = event.graphicLayer
  graphicLayerStateRef.value.addTableData(graphicLayer)
})
</script>
<style scoped lang="less">
.inputNum {
  width: 140px !important;
}
.ant-slider {
  width: 220px;
}
</style>
