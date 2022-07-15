<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-checkbox v-model:checked="formState.enabledRedSphere" @change="formRedSphereChange">危险圈</a-checkbox>
    </div>
    <div>
      <a-checkbox v-model:checked="formState.enabledYellowSphere" @change="formYellowSphereChange">警告圈</a-checkbox>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  enabledRedSphere: boolean
  enabledYellowSphere: boolean
}

const formState: UnwrapRef<FormState> = reactive({
  enabledRedSphere: true,
  enabledYellowSphere: false
})

const formRedSphereChange = () => {
  mapWork.createEllipsoid(formState.enabledRedSphere, formState.enabledYellowSphere)
}

const formYellowSphereChange = () => {
  mapWork.createEllipsoid(formState.enabledRedSphere, formState.enabledYellowSphere)
}
</script>
