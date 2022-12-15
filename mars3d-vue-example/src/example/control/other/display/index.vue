<template>
  <mars-dialog :visible="true" right="10" top="10" width="200">
      <mars-gui :options="options" labelCol="6" ></mars-gui>
  </mars-dialog>
</template>

<script setup lang="ts">
import * as mapWork from "./map.js"
import { useWidget } from "@mars/widgets/common/store/widget"
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"
const { activate, disable } = useWidget()

const options: GuiItem[] = [
  {
    type: "checkbox",
    field: "button",
    label: "按钮",
    value: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    change(data) {
      chooseButton(data)
    },
    data: [
      {
        label: "POI搜索",
        value: "1"
      },
      {
        label: "视角复位",
        value: "2"
      },
      {
        label: "二三维切换",
        value: "3"
      },
      {
        label: "地图切换",
        value: "4"
      },
      {
        label: "全屏切换",
        value: "5"
      },
      {
        label: "VR模式",
        value: "6"
      },
      {
        label: "帮助",
        value: "7"
      },
      {
        label: "地图缩放",
        value: "8"
      },
      {
        label: "图层控制",
        value: "9"
      }
    ]
  },
  {
    type: "checkbox",
    field: "pannel",
    label: "面板",
    value: ["1", "2", "3", "4", "5"],
    change(data) {
      choosePannel(data)
    },
    data: [
      {
        label: "状态信息栏",
        value: "1"
      },
      {
        label: "时钟面板",
        value: "2"
      },
      {
        label: "导航球",
        value: "3"
      },
      {
        label: "时间刻度线",
        value: "4"
      },
      {
        label: "比例尺",
        value: "5"
      }
    ]
  }
]

// 按钮
const chooseButton = (data) => {
  mapWork.bindPOI(findValue(data, "1"))
  mapWork.bindView(findValue(data, "2"))
  mapWork.bindSceneModePicker(findValue(data, "3"))
  mapWork.bindBaseLayerPicker(findValue(data, "4"))
  mapWork.bindFullScreen(findValue(data, "5"))
  mapWork.bindVR(findValue(data, "6"))
  mapWork.bindHelpButton(findValue(data, "7"))
  mapWork.bindZoom(findValue(data, "8"))
  onBindLayer(findValue(data, "9"))
}

// 面板
const choosePannel = (data) => {
  mapWork.bindLocation(findValue(data, "1"))
  mapWork.bindClock(findValue(data, "2"))
  mapWork.bindNav(findValue(data, "3"))
  mapWork.bindTimeLine(findValue(data, "4"))
  mapWork.bindLegend(findValue(data, "5"))
}

const findValue = (data, index) => {
  return Boolean(data.find((item) => {
    return item === index
  }))
}

const onBindLayer = (e) => {
  if (e) {
    activate("tools-button")
  } else {
    disable("tools-button")
  }
}
</script>
