<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span>视椎体状态:</span>
        <a-checkbox v-model:checked="sensorParams.enabledShowHide" @change="sensorShowHide">显示/隐藏</a-checkbox>
        <mars-button @click="locate">定位至卫星</mars-button>
      </a-space>
    </div>

    <!-- <div class="f-mb">
      <a-space>
        <span>位置:</span>
        经度 <mars-input-number @change="xChange" v-model:value="model_x"></mars-input-number> 纬度<mars-input-number
          @change="yChange"
          v-model:value="model_y"
          class="inputNum"
        ></mars-input-number>
        高度<mars-input-number @change="zChange" v-model:value="model_z"></mars-input-number>
      </a-space>
    </div> -->

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">经度:</span>
        <mars-input-number @change="positionChange" v-model:value="sensorParams.model_x" class="inputNum"></mars-input-number>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">经度:</span>
        <mars-input-number @change="positionChange" v-model:value="sensorParams.model_y" class="inputNum"></mars-input-number>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">高度:</span>
        <mars-input-number @change="positionChange" v-model:value="sensorParams.model_z" class="inputNum"></mars-input-number
      ></a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span>轨迹方向:</span>
        <mars-slider @change="headingChange" v-model:value="sensorParams.headingValue" :min="0" :max="360" :step="1" />当前值{{
          sensorParams.headingValue
        }}
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span>前后侧摆:</span>
        <mars-slider @change="pitchChange" v-model:value="sensorParams.pitchValue" :min="-180" :max="180" :step="1" />当前值{{
          sensorParams.pitchValue
        }}
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span>左右侧摆:</span>
        <mars-slider @change="rollChange" v-model:value="sensorParams.rollValue" :min="-180" :max="180" :step="1" />当前值{{ sensorParams.rollValue }}
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <span>参考系轴:</span>
        <a-checkbox v-model:checked="sensorParams.enabledShowMatrix" @change="chkShowModelMatrix">显示/隐藏</a-checkbox>
        <a-checkbox v-show="sensorParams.enabledShowHide" v-model:checked="sensorParams.enabledIntersect" @change="chkUnderground"
          >求交地球</a-checkbox
        >
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span>轴长度:</span>
        <mars-slider @change="lengthChange" v-model:value="sensorParams.matrixLength" :min="1" :max="10000" :step="1" />当前值{{
          sensorParams.matrixLength
        }}
      </a-space>
    </div>

    <div class="showHide" v-show="sensorParams.enabledShowHide">
      <div class="f-mb">
        <a-space>
          <span>类型:</span>
          <a-radio-group v-model:value="sensorType" name="radioGroup" @change="chkSensorType">
            <a-radio value="1">圆锥体</a-radio>
            <a-radio value="2">四棱锥体</a-radio>
          </a-radio-group>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span>夹角1:</span>
          <mars-slider @change="angle1" v-model:value="sensorParams.angleValue1" :min="0" :max="89" :step="0.001" />当前值{{
            sensorParams.angleValue1
          }}
        </a-space>
      </div>

      <div v-if="sensorType === '2'">
        <a-space>
          <span>夹角2:</span>
          <mars-slider @change="angle2" v-model:value="sensorParams.angleValue2" :min="0" :max="89" :step="0.001" />当前值{{
            sensorParams.angleValue2
          }}
        </a-space>
      </div>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
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
}

const sensorParams = reactive<SatelliteSensor>({
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
  rollValue: 0 // 左右侧摆
})

onMounted(() => {
  mapWork.addModelGraphic(sensorParams)
})

// 显示/隐藏
const sensorShowHide = () => {
  mapWork.sensorShowHide(sensorParams.enabledShowHide)
}

// 方向角
const headingChange = () => {
  mapWork.headingChange(sensorParams.headingValue)
}

// 俯仰角
const pitchChange = () => {
  mapWork.pitchChange(sensorParams.pitchValue)
}

// 左右角
const rollChange = () => {
  mapWork.rollChange(sensorParams.rollValue)
}
const lengthChange = () => {
  mapWork.lengthChange(sensorParams.matrixLength)
}

// 夹角
const angle1 = () => {
  mapWork.angle1(sensorParams.angleValue1)
}
const angle2 = () => {
  mapWork.angle2(sensorParams.angleValue2)
}
// 定位至模型
const locate = () => {
  mapWork.locate()
}

const positionChange = () => {
  mapWork.updatePosition(sensorParams.model_x, sensorParams.model_y, sensorParams.model_z)
}

// 参考轴系显示与隐藏
const chkShowModelMatrix = () => {
  mapWork.chkShowModelMatrix(sensorParams.enabledShowMatrix)
}

// 是否与地球相交
const chkUnderground = () => {
  mapWork.chkUnderground(sensorParams.enabledIntersect)
}

// 类型选择
const chkSensorType = () => {
  mapWork.chkSensorType(sensorType.value)
}
</script>
<style scoped lang="less">
.inputNum {
  width: 140px !important;
}

.ant-slider {
  width: 110px;
}
.mars-pannel-item-label {
  width: 64px;
}
</style>
