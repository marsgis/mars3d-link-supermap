<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state
      :defaultCount="100"
      :interaction="false"
      drawLabel1="绘制水柱"
      drawLabel2="绘制火焰"
      :customEditor="'particleSystem'"
      @onStartEditor="onStartEditor"
      @onStopEditor="onStopEditor"
    />
  </mars-dialog>

  <!-- 左侧面板 -->
  <mars-dialog
    width="280"
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
    <div class="mars-particle">
      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">所在位置:</span>
          <mars-button @click="btnSelectPosition">图上选点</mars-button>
        </a-space>
      </div>

      <div class="f-mb">
        <mars-gui :options="options" ref="marsGuiRef" :labelCol="8"></mars-gui>
      </div>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import { reactive, ref } from "vue"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"

// 点击表格开始编辑矢量数据的参数
const pannelTitle = ref<string>("")
const selectedGraphic = ref<boolean>(false)

function onStartEditor(data) {
  const graphic = mapWork.getGraphic(data.graphicId)
  pannelTitle.value = data.graphicName

  marsGuiRef.value.updateFields({
    ...graphic.style
  })

  selectedGraphic.value = true
}

function onStopEditor() {
  selectedGraphic.value = false
}

const marsGuiRef = ref()
const options: GuiItem[] = [
  {
    type: "slider",
    field: "heading",
    label: "方向角",
    step: 1,
    min: 0,
    max: 360,
    value: 0,
    extra: "{heading}(°)",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("heading", data)
      mapWork.setStylyToGraphic({ heading: data })
    }
  },
  {
    type: "slider",
    field: "pitch",
    label: "俯仰角",
    step: 1,
    min: 0,
    max: 360,
    value: 0,
    extra: "{pitch}(°)",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("pitch", data)
      mapWork.setStylyToGraphic({ pitch: data })
    }
  },
  {
    type: "slider",
    field: "roll",
    label: "翻滚角",
    step: 1,
    min: 0,
    max: 360,
    value: 0,
    extra: "{roll}(°)",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("roll", data)
      mapWork.setStylyToGraphic({ roll: data })
    }
  },
  {
    type: "slider",
    field: "particleSize",
    label: "粒子大小",
    step: 1,
    min: 2,
    max: 60,
    value: 20,
    extra: "{particleSize}(px)",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("particleSize", data)
      mapWork.setStylyToGraphic({ particleSize: data })
    }
  },
  {
    type: "slider",
    field: "emissionRate",
    label: "发射速率",
    step: 1,
    min: 0.0,
    max: 500.0,
    value: 200,
    extra: "{emissionRate}(次/秒)",
    extraWidth: 80,
    change(data) {
      marsGuiRef.value.updateField("emissionRate", data)
      mapWork.setStylyToGraphic({ emissionRate: data })
    }
  },
  {
    type: "slider",
    field: "gravity",
    label: "重力因子",
    step: 1,
    min: -20.0,
    max: 20.0,
    value: 0,
    extra: "{gravity}",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("gravity", data)
      mapWork.setStylyToGraphic({ gravity: data })
    }
  },
  {
    type: "slider",
    field: "transX",
    label: "偏移值X",
    step: 0.1,
    min: -50.0,
    max: 50.0,
    value: 0,
    extra: "{transX}",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("transX", data)
      mapWork.setStylyToGraphic({ transX: data })
    }
  },
  {
    type: "slider",
    field: "transY",
    label: "偏移值Y",
    step: 0.1,
    min: -50.0,
    max: 50.0,
    value: 0,
    extra: "{transY}",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("transY", data)
      mapWork.setStylyToGraphic({ transY: data })
    }
  },
  {
    type: "slider",
    field: "transZ",
    label: "偏移值Z",
    step: 0.1,
    min: -50.0,
    max: 50.0,
    value: 0,
    extra: "{transZ}",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("transZ", data)
      mapWork.setStylyToGraphic({ transZ: data })
    }
  },
  {
    type: "slider",
    field: "startScale",
    label: "开始比例",
    step: 1,
    min: 0.0,
    max: 10.0,
    value: 1,
    extraWidth: 60,
    extra: "{startScale}",
    change(data) {
      marsGuiRef.value.updateField("startScale", data)
      mapWork.setStylyToGraphic({ startScale: data })
    }
  },
  {
    type: "slider",
    field: "endScale",
    label: "结束比例",
    step: 1,
    min: 0.0,
    max: 10.0,
    value: 3,
    extra: "{endScale}",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("endScale", data)
      mapWork.setStylyToGraphic({ endScale: data })
    }
  },
  {
    type: "slider",
    field: "minimumParticleLife",
    label: "最小寿命",
    step: 0.1,
    min: 0.1,
    max: 30.0,
    value: 1.2,
    extra: "{minimumParticleLife}(秒)",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("minimumParticleLife", data)
      mapWork.setStylyToGraphic({ minimumParticleLife: data })
    }
  },
  {
    type: "slider",
    field: "maximumParticleLife",
    label: "最大寿命",
    step: 0.1,
    min: 0.1,
    max: 30.0,
    value: 3.2,
    extra: "{maximumParticleLife}(秒)",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("maximumParticleLife", data)
      mapWork.setStylyToGraphic({ maximumParticleLife: data })
    }
  },
  {
    type: "slider",
    field: "minimumSpeed",
    label: "最小速度",
    step: 0.1,
    min: 0.1,
    max: 60.0,
    value: 1.0,
    extra: "{minimumSpeed}",
    extraWidth: 60,
    change(data) {
      marsGuiRef.value.updateField("minimumSpeed", data)
      mapWork.setStylyToGraphic({ minimumSpeed: data })
    }
  },
  {
    type: "slider",
    field: "maximumSpeed",
    label: "最大速度",
    step: 0.1,
    min: 0.1,
    max: 60.0,
    value: 1.0,
    extra: "{maximumSpeed}",
    extraWidth: 70,
    change(data) {
      marsGuiRef.value.updateField("maximumSpeed", data)
      mapWork.setStylyToGraphic({ maximumSpeed: data })
    }
  }
]

// 所在位置
const btnSelectPosition = () => {
  mapWork.btnSelectPosition()
}
</script>
<style>
.mars-pannel-item-label {
  width: 97px;
}

.ant-slider {
  margin-top: 5px !important;
}
</style>
