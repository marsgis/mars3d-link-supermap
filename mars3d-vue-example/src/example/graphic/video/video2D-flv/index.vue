<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state
      :defaultCount="5"
      drawLabel1="绘制"
      drawLabel2="按当前相机"
      :customEditor="'video2D'"
      @onStartEditor="onStartEditor"
      @onStopEditor="onStopEditor"
    />
  </mars-dialog>

  <!-- 左侧面板 -->
  <mars-dialog
    left="10"
    top="10"
    :draggable="true"
    :visible="selectedGraphic"
    :title="pannelTitle"
    :closeable="true"
    :beforeClose="
      () => {
        selectedGraphic = false
      }
    "
  >
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">相机位置:</span>
        <mars-button @click="selCamera">鼠标图上点选(相机位置)</mars-button>
      </a-space>
    </div>

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
        <mars-slider @change="onChangeDistance" v-model:value="video.distanceValue" :min="1" :max="1000" :step="0.1" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">四周方向:</span>
        <mars-slider @change="onChangeHeading" v-model:value="video.heading" :min="0" :max="360" :step="0.1" />
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
        <a-checkbox @change="showFrustum" v-model:checked="video.ckdFrustum">是否显示</a-checkbox>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">视频透明度:</span>
        <mars-slider @change="onChangeOpacity" v-model:value="video.opcity" :min="0" :max="1" :step="0.1" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">视频角度:</span>
        <mars-slider @change="rotateDeg" v-model:value="video.videoRotate" :min="0" :max="360" :step="1" />
      </a-space>
    </div>

    <div class="f-tac">
      <a-space>
        <mars-button @click="playOrpause">播放暂停</mars-button>
        <mars-button @click="locate">返回相机视点</mars-button>
        <mars-button @click="printParameters">打印参数</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import * as mapWork from "./map.js"

interface Video {
  ckdFrustum: boolean // 是否显示视椎线
  cameraAngle: number // 水平角度
  cameraAngle2: number // 垂直角度
  distanceValue: number // 投射距离
  heading: number // 四周距离
  pitchValue: number // 俯仰角度
  opcity: number // 透明度
  videoRotate: number // 视角角度
}

const video = reactive<Video>({
  ckdFrustum: true,
  cameraAngle: 0,
  cameraAngle2: 0,
  distanceValue: 0,
  heading: 0,
  pitchValue: 0,
  opcity: 1,
  videoRotate: 0
})

// 点击表格开始编辑矢量数据的参数
const pannelTitle = ref<string>("")
const selectedGraphic = ref<boolean>(false)

function onStartEditor(data) {
  const graphic = mapWork.getGraphic(data.graphicId)
  pannelTitle.value = data.graphicName

  video.cameraAngle = graphic?.angle
  video.cameraAngle2 = graphic?.angle2
  video.ckdFrustum = graphic?.showFrustum
  video.distanceValue = graphic?.distance
  video.pitchValue = graphic?.pitch
  video.opcity = graphic?.opacity
  video.heading = graphic?.heading

  selectedGraphic.value = true
}
function onStopEditor() {
  selectedGraphic.value = false
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
  mapWork.showFrustum(video.ckdFrustum)
}

// 修改视频透明度
const onChangeOpacity = () => {
  mapWork.onChangeOpacity(video.opcity)
}

// 视频角度
const rotateDeg = () => {
  mapWork.rotateDeg(video.videoRotate)
}

// 定位至视频位置
const locate = () => {
  mapWork.locate()
}
// 打印参数
const printParameters = () => {
  mapWork.printParameters()
}

// 播放暂停
const playOrpause = () => {
  mapWork.playOrpause()
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 160px;
}
:deep(.mars-pannel-item-label) {
  width: 75px;
}
</style>
