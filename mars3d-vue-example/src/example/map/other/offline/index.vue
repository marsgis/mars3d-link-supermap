<template>
  <mars-dialog :visible="true" right="10" top="10">
    提示：该示例目的演示交付的离线数据的效果<br />
    1、 包括全国12.5米地形(当前页面效果)<br />
    2、 包括0-12级影像底图(当前页面效果)<br />
    3、包括所有模型数据：
    <a-space>
      <mars-button href="editor-vue.html?id=layer-tileset/type/list" target="_blank" class="noBorder">3dtiles模型</mars-button>
      <mars-button href="editor-vue.html?id=layer-graphic/draw/draw-model-list" target="_blank" class="noBorder">gltf模型</mars-button>
    </a-space>
    <br />
    4、 包括其他所有示例的json等文件
  </mars-dialog>
</template>

<script lang="ts" setup>
</script>
