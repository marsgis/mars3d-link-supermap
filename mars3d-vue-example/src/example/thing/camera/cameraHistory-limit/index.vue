<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-checkbox v-model:checked="formState.chkUnderground" @change="chkUnderground"> 显示限定范围 </a-checkbox>
    </div>

    <div>
      <p>当前共有{{ formState.allLength }}条视角记录</p>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue"
import * as mapWork from "./map.js"

const formState = reactive({
  allLength: 0,
  chkUnderground: true
})
// 触发自定义事件，接收数据
mapWork.eventTarget.on("changeCamera", function (event: any) {
  formState.allLength = event.count
})

const chkUnderground = () => {
  mapWork.chkUnderground(formState.chkUnderground)
}
</script>
<style scoped lang="less"></style>
