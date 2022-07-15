<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <a-checkbox @change="onChangeSnowState" v-model:checked="formState.enabledSnow">下雪效果：</a-checkbox>
        <span>下雪速度</span>
        <mars-slider @change="onChangeSpeed" v-model:value="formState.speed" :min="1" :max="100" />
      </a-space>
    </div>

    <div>
      <a-space>
        <a-checkbox @change="onChangeCoverState" v-model:checked="formState.enabledCover">积雪效果：</a-checkbox>
        <span>积雪程度</span>
        <mars-slider @change="onChangeAlpha" v-model:value="formState.alpha" :min="0" :max="1" :step="0.1" />
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import * as mapWork from "./map.js"

const formState = reactive({
  enabledSnow: true,
  enabledCover: true,
  speed: 20,
  alpha: 0.6
})

// 下雪速度
const onChangeSpeed = () => {
  mapWork.setSpeed(formState.speed)
}

// 积雪厚度
const onChangeAlpha = () => {
  mapWork.setAlpha(formState.alpha)
}

// 是否开启下雪效果
const onChangeSnowState = () => {
  mapWork.setSnow(formState.enabledSnow)
}

// 是否开启积雪效果
const onChangeCoverState = () => {
  mapWork.setCover(formState.enabledCover)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 146px;
}
</style>
