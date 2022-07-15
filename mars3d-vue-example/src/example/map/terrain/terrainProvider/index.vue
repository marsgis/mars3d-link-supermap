<template>
  <mars-dialog :visible="true" right="10" top="10" width="200">
    <mars-gui :options="options"></mars-gui>
  </mars-dialog>
</template>

<script lang="ts" setup>
// import { reactive } from "vue"
// import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"

const options: GuiItem[] = [
  {
    type: "radio",
    field: "type",
    label: "单选",
    value: "xyz",
    show(data) {
      return data.speed !== "2"
    },
    data: [
      {
        label: "无地形",
        value: "none"
      },
      {
        label: "标准服务",
        value: "xyz"
      },
      {
        label: "lon在线服务",
        value: "ion"
      },
      {
        label: "ArcGIS服务",
        value: "arcgis"
      }
    ],
    change(value) {
      mapWork.radioTerrain(value)
    }
  },
  {
    type: "checkbox",
    field: "type",
    label: "调试",
    value: ["1"],
    data: [
      {
        label: "开启地形",
        value: "1"
      },
      {
        label: "地形三角网",
        value: "2"
      }
    ],
    change(value) {
      mapWork.enabledTerrain(
        value.find((item) => {
          return item === "1"
        })
      )
      mapWork.enabledTerrainSJW(
        value.find((item) => {
          return item === "2"
        })
      )
    }
  }
]
</script>

<style lang="less" scoped></style>
