<template>
  <mars-dialog :visible="showClockAnimate" left="60" bottom="50">
    <p class="closePannel f-mb">
      <mars-icon icon="close" width="14" @click="onClickHiddenTime" />
    </p>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">当前时间：</span>
        <mars-date-picker
          style="width: 170px"
          v-model:value="currrentTime"
          format="YYYY-MM-DD HH:mm:ss"
          :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
          @change="onChangeCurrentTime"
        />
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">时间范围：</span>
        <mars-range-picker
          v-model:value="nowTimeScope"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :placeholder="['开始时间', '结束时间']"
          @change="onRangeChange"
        />
      </a-space>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import dayjs, { Dayjs } from "dayjs"

import * as mapWork from "./map.js"

const showClockAnimate = ref<boolean>(false)
const nowTimeScope = ref<[Dayjs, Dayjs]>()
const currrentTime = ref<Dayjs>()

mapWork.eventTarget.on("clickShowClockAnimate", (e: any) => {
  showClockAnimate.value = !showClockAnimate.value

  nowTimeScope.value = [dayjs(e.startTime), dayjs(e.stopTime)]
  currrentTime.value = dayjs(e.currentTime)
})
const onClickHiddenTime = () => {
  showClockAnimate.value = false
}
const onRangeChange = (value: [Dayjs, Dayjs], dateString: [string, string]) => {
  mapWork.setClockAnimateTime(dateString[0], dateString[1])
}
const onChangeCurrentTime = (value: Dayjs) => {
  mapWork.setCurrentTime(value)
}
</script>

<style>
.infoView {
  overflow-x: hidden;
  top: calc(100% - 195px) !important;
  right: calc(100% - 415px) !important;
}
</style>

<style lang="less" scoped>

// .closePannel {
//   display: flex;
//   justify-content: flex-end;
// }
// :deep(.ant-select-dropdown) {
//   background-color: #3f5563c4 !important;
// }
// :deep(.ant-picker) {
//   width: 300px;
// }
</style>
