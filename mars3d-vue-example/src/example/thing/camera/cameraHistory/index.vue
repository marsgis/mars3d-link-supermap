<template>
  <mars-dialog :visible="true" right="10" top="10">
    <p class="f-mb">当前共有{{ formState.allLength }}条视角记录，当前正在第{{ formState.nowView }}条视角</p>
    <div class="f-mb">
      <mars-button @click="lastOneView">回到当前（最后一条）</mars-button>
    </div>
    <div>
      <a-space>
        <mars-button @click="lastView">上一个视图</mars-button>
        <mars-button @click="nextView">下一个视图</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue"
import * as mapWork from "./map.js"

const formState = reactive({
  allLength: 0,
  nowView: 0
})
onMounted(() => {
  mapWork.eventTarget.on("changeCameraHistory", function (event: any) {
    const item = event.data
    formState.allLength = item.count
    formState.nowView = item.index + 1
  })
})

const lastView = () => {
  mapWork.lastView()
}
const nextView = () => {
  mapWork.nextView()
}
const lastOneView = () => {
  mapWork.lastOneView()
}
</script>
