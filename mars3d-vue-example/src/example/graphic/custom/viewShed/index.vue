<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state
      :defaultCount="10"
      :interaction="false"
      :customEditor="'viewShed'"
      @onStartEditor="onStartEditor"
      @onStopEditor="onStopEditor"
    />
  </mars-dialog>

  <mars-dialog
    left="10"
    top="10"
    :title="video.graphicName"
    :visible="video.selectedGraphic"
    :closeable="true"
    :beforeClose="
      () => {
        video.selectedGraphic = false
      }
    "
  >
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">水平张角:</span>
        <mars-slider @change="onChangeAngle" v-model:value="video.cameraAngle" :min="1" :max="60" :step="0.1" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">垂直张角:</span>
        <mars-slider @change="onChangeAngle2" v-model:value="video.cameraAngle2" :min="10" :max="30" :step="0.1" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">投射距离:</span>
        <mars-slider @change="onChangeDistance" v-model:value="video.distanceValue" :min="1" :max="99999" :step="1" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">四周方向:</span>
        <mars-slider @change="onChangeHeading" class="head" v-model:value="video.heading" :min="0" :max="360" :step="0.1" />
        <mars-button @click="onClickSelView">图上选点</mars-button>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">俯仰角度:</span>
        <mars-slider @change="onChangePitch" v-model:value="video.pitchValue" :min="-180" :max="180" :step="0.1" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">视椎框线:</span>
        <a-checkbox @change="showFrustum" v-model:checked="video.showFrustum">是否显示</a-checkbox>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">视频透明度:</span>
        <mars-slider @change="onChangeOpacity" v-model:value="video.opcity" :min="0" :max="1" :step="0.1" />
      </a-space>
    </div>

    <div class="f-mb f-tac">
      <a-space>
        <mars-button @click="selCamera">点选相机位置</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import { reactive } from "vue"
import * as mapWork from "./map.js"

interface Video {
  showFrustum: boolean // 是否显示视椎线
  cameraAngle: number // 水平角度
  cameraAngle2: number // 垂直角度
  distanceValue: number // 投射距离
  heading: number // 四周距离
  pitchValue: number // 俯仰角度
  opcity: number // 透明度
  videoRotate: number // 视角角度
  graphicName: string
  selectedGraphic: boolean
}

const video = reactive<Video>({
  showFrustum: false,
  cameraAngle: 0,
  cameraAngle2: 0,
  distanceValue: 0,
  heading: 0,
  pitchValue: 0,
  opcity: 1,
  videoRotate: 0,
  graphicName: "",
  selectedGraphic: false
})

// 点击表格开始编辑矢量数据的参数
function onStartEditor(data) {
  const graphic = mapWork.getGraphic(data.graphicId)
  video.graphicName = data.graphicName

  video.cameraAngle = graphic.angle
  video.cameraAngle2 = graphic.angle2
  video.distanceValue = graphic.distance
  video.pitchValue = graphic.pitch
  video.opcity = graphic.opacity
  video.heading = graphic.heading
  video.showFrustum = graphic.showFrustum

  video.selectedGraphic = true
}

function onStopEditor() {
  video.selectedGraphic = false
}

// 视频位置
const selCamera = () => {
  mapWork.selCamera()
}

const onChangeAngle = () => {
  mapWork.onChangeAngle(video.cameraAngle)
}
const onChangeAngle2 = () => {
  mapWork.onChangeAngle2(video.cameraAngle2)
}
const onChangeDistance = () => {
  mapWork.onChangeDistance(video.distanceValue)
}

const onChangeHeading = () => {
  mapWork.onChangeHeading(video.heading)
}

const onClickSelView = () => {
  mapWork.onClickSelView()
}

const onChangePitch = () => {
  mapWork.onChangePitch(video.pitchValue)
}

// 线框是否显示
const showFrustum = () => {
  mapWork.showFrustum(video.showFrustum)
}

// 修改视频透明度
const onChangeOpacity = () => {
  mapWork.onChangeOpacity(video.opcity)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 160px;
}
.head {
  width: 100px;
}
.mars-pannel-item-label {
  width: 80px;
}
</style>
