<template>
  <mars-dialog :visible="true" right="10" top="10" width="280">
    <div class="property-content">
      <h2 class="f-mb title">瓦片底图通用参数</h2>
      <mars-gui :options="options"></mars-gui>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"

const options: GuiItem[] = [
  {
    type: "slider",
    field: "opacity",
    label: "透明度",
    step: 0.01,
    min: 0,
    max: 1,
    value: 1.0,
    extra: "{opacity}",
    extraWidth: 40,
    change(data) {
      setLayerOptions("opacity", data)
    }
  },
  {
    type: "slider",
    field: "brightness",
    label: "亮度",
    step: 0.01,
    min: 0,
    max: 3,
    value: 1.0,
    extra: "{brightness}",
    extraWidth: 40,
    change(data) {
      setLayerOptions("brightness", data)
    }
  },
  {
    type: "slider",
    field: "contrast",
    label: "对比度",
    step: 0.01,
    min: 0,
    max: 3,
    value: 1.16,
    extra: "{contrast}",
    extraWidth: 40,
    change(data) {
      setLayerOptions("contrast", data)
    }
  },
  {
    type: "slider",
    field: "hue",
    label: "色彩",
    step: 0.01,
    min: 0,
    max: 3,
    value: 0.1,
    extra: "{hue}",
    extraWidth: 40,
    change(data) {
      setLayerOptions("hue", data)
    }
  },
  {
    type: "slider",
    field: "saturation",
    label: "饱和度",
    step: 0.01,
    min: 0,
    max: 3,
    value: 1.0,
    extra: "{saturation}",
    extraWidth: 40,
    change(data) {
      setLayerOptions("saturation", data)
    }
  },
  {
    type: "slider",
    field: "gamma",
    label: "伽马值",
    step: 0.01,
    min: 0,
    max: 3,
    value: 0.53,
    extra: "{gamma}",
    extraWidth: 40,
    change(data) {
      setLayerOptions("gamma", data)
    }
  }
]

const setLayerOptions = (attribute: string, val: number) => {
  mapWork.setLayerOptions(attribute, val)
}
</script>
<style lang="less" scoped>
.title {
  color: var(--mars-base-color);
  font-size: 16px;
  text-align: center;
}

.property-content {
  width: 100%;
  overflow-x: hidden;
}
</style>
