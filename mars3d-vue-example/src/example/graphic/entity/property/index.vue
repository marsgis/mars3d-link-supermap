<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <span class="item-label">属性机制演示：</span>
    </div>
    <a-space>
      <mars-button @click="demoSampleProperty">SampleProperty</mars-button>
      <mars-button @click="demoTimeIntervalCollectionProperty">TimeIntervalCollectionProperty</mars-button>
      <mars-button @click="demoConstantProperty">ConstantProperty</mars-button>
      <mars-button @click="demoCompositeProperty">CompositeProperty</mars-button>
      <mars-button @click="demoSampledPositionProperty">SampledPositionProperty</mars-button>
      <mars-button @click="demoColorMaterialProperty">ColorMaterialProperty</mars-button>
      <mars-button @click="demoColorMaterialProperty2">ColorMaterialProperty2</mars-button>
      <mars-button @click="demoCallbackProperty">CallbackProperty</mars-button>
      <mars-button @click="demoReferenceProperty">ReferenceProperty</mars-button>
      <mars-button @click="demoPropertyBag">PropertyBag</mars-button>
      <mars-button @click="demoVelocityVectorProperty">VelocityVectorProperty</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import * as mapWork from "./map.js"

const demoSampleProperty = () => {
  mapWork.demoSampleProperty()
}
const demoTimeIntervalCollectionProperty = () => {
  mapWork.demoTimeIntervalCollectionProperty()
}
const demoConstantProperty = () => {
  mapWork.demoConstantProperty()
}
const demoCompositeProperty = () => {
  mapWork.demoCompositeProperty()
}
const demoSampledPositionProperty = () => {
  mapWork.demoSampledPositionProperty()
}
const demoColorMaterialProperty = () => {
  mapWork.demoColorMaterialProperty()
}
const demoColorMaterialProperty2 = () => {
  mapWork.demoColorMaterialProperty2()
}
const demoCallbackProperty = () => {
  mapWork.demoCallbackProperty()
}
const demoReferenceProperty = () => {
  mapWork.demoReferenceProperty()
}
const demoPropertyBag = () => {
  mapWork.demoPropertyBag()
}
const demoVelocityVectorProperty = () => {
  mapWork.demoVelocityVectorProperty()
}
</script>
<style scoped lang="less">
.infoView {
  width: 224px;
}
.item-label {
  font-size: 15px;
}
.ant-space {
  display: grid;
}
</style>
