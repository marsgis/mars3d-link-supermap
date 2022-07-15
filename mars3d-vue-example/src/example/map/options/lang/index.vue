<template>
  <mars-dialog :visible="true" right="10" top="10" width="355">
    <div class="f-mb">Tip: The default language is Chinese中文简体, you can switch to English, etc.</div>

    <div class="f-mb">
      <a-row>
        <a-col :span="7">Plot:</a-col>
        <a-col :span="17">
          <div class="lang-button-contain">
            <mars-button :key="item" v-for="item in typeArrPlot" @click="onStartDraw(item)">
              {{ item }}
            </mars-button>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="f-mb">
      <a-row>
        <a-col :span="7">Measurement:</a-col>
        <a-col :span="17">
          <div class="lang-button-contain">
            <mars-button size="middle" @click="onClickCoordinate">coordinate</mars-button>
            <mars-button size="middle" @click="onClickDistance">distance</mars-button>
            <mars-button size="middle" @click="onClickHeight">height</mars-button>
            <mars-button size="middle" @click="onClickArea">area</mars-button>
            <mars-button size="middle" @click="onClickAngle">angle</mars-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import * as mapWork from "./map.js"

const typeArrPlot = ["rectangle", "polyline", "polygon", "cylinder", "point", "circle", "wall"]

const onStartDraw = (e: any) => {
  mapWork.startDraw(e)
}

const onClickDistance = () => {
  mapWork.distance()
}
const onClickArea = () => {
  mapWork.area()
}
const onClickHeight = () => {
  mapWork.height()
}
const onClickCoordinate = () => {
  mapWork.coordinate()
}
const onClickAngle = () => {
  mapWork.angle()
}
</script>
<style lang="less" scoped>
.lang-button-contain {
  .mars-button {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
</style>
