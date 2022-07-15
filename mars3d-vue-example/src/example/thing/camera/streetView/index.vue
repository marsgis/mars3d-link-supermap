<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-form>
      <a-form-item>
        <a-radio-group @change="shadingMaterials" v-model:value="radioValue">
          <a-radio :value="1">街景操作习惯 </a-radio>
          <a-radio :value="2">Cesium操作习惯</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item v-show="radioValue === 1">
        <span>
          操作说明：<br />
          1、右键拖拽，以相机视角为中心进行旋转。<br />
          2、中键拖拽，可以升高或降低相机高度。<br />
          3、Ctrl + 中键/右键, 与Cesium原始操作一致。<br />
          4、左键双击，飞行定位到该点。<br />
          5、右键双击，围绕该点旋转。
        </span>
      </a-form-item>
    </a-form>
  </mars-dialog>
  <location-to />
</template>

<script setup lang="ts">
import { ref } from "vue"
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import * as mapWork from "./map.js"

const radioValue = ref<number>(1)

const shadingMaterials = () => {
  mapWork.shadingMaterials(radioValue.value)
}
</script>
