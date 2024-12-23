 
<p align="center">
<img src="//mars3d.cn/logo.png" width="300px" />
</p>
 
<p align="center">超图 + Mars3D 结合使用的🌎功能示例和项目模板</p>




<p align="center">
  <a target="_black" href="https://www.npmjs.com/package/mars3d">
    <img alt="Npm version" src="https://img.shields.io/npm/v/mars3d.svg?style=flat&logo=npm&label=版本号" />
  </a>
  <a target="_black" href="https://www.npmjs.com/package/mars3d">
    <img alt="Npm downloads" src="https://img.shields.io/npm/dt/mars3d?style=flat&logo=npm&label=下载量" />
  </a>
  <a target="_black" href="https://github.com/marsgis/mars3d">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/marsgis/mars3d?style=flat&logo=github" />
  </a>
  <a target="_black" href="https://gitee.com/marsgis/mars3d">
    <img src="https://gitee.com/marsgis/mars3d/badge/star.svg?theme=dark" alt="star" />
  </a>
</p>


  Mars3D支持结合`Cesium相关的各类平台`来兼容使用，方便结合不同平台的优点来达到完成各种项目需求。本仓库是Mars3D平台，在[超图版Cesium库](http://support.supermap.com.cn:8090/webgl/index.html)技术栈下的示例和多个应用项目模版。
 
 

## mars3d与超图的融合有2个方式

### 方式1：原生Cesium库+s3m插件
 可以访问[S3M图层示例](https://mars3d.cn/editor-vue.html?id=layer-other/s3m/basis)体验，
 
 mars3d(含Cesium) + s3m独立插件 + mars3d-supermap，需要引入的资源为：
```js
"mars3d": [    
  "Cesium-supermap/Widgets/widgets.css", //cesium
  "Cesium-supermap/Cesium.js", 
  "mars3d/plugins/supermap/SuperMap3D.js", //s3m支持原生cesium的独立插件，参考 https://github.com/SuperMap/iClient3D-for-WebGL

  "turf/turf.min.js",
  "mars3d/mars3d.css", //mars3d
  "mars3d/mars3d.js", 
  "mars3d/plugins/supermap/mars3d-supermap.js",//mars3d-supermap简化调用封装
],
```
  
#### 此方式的特别说明
经过测试，[SuperMap3D](https://github.com/SuperMap/iClient3D-for-WebGL/tree/main/Cesium_S3MLayer_Plugins/S3MTilesLayer)插件代码不是最新的，超图官网API很多在此插件中都没有。

####  项目模版
  下面2个项目模版中cesium及SuperMap3D.js采用静态引入的，mars3d采用npm安装import导入的。
| 目录  |   说明  | 
|  ----  | ----  |
|[mars3d-vue-template](./mars3d-vue-template/README.md)	|  最简项目Vue版 | 
|[mars3d-vue-project](./mars3d-vue-project/README.md)	|  基础项目Vue版 |  



### 【暂不支持】~~方式2：需要替换超图版本Cesium库~~

>**特别说明**：因Cesium v1.97+重大变更，Mars3D v3.5+不再兼容使用webgl1的超图版本Cesium库功能，如果需要超图版本cesium，请访问v3.4分支 ：[https://gitee.com/marsgis/mars3d-link-supermap/tree/v3.4/](https://gitee.com/marsgis/mars3d-link-supermap/tree/v3.4/)


超图版本Cesium + mars3d + mars3d-supermap ，需要引入的资源为：
```js
"mars3d": [
  "Cesium-supermap/Widgets/widgets.css", //超图版本Cesium 
  "Cesium-supermap/Cesium.js",  
  "mars3d/plugins/compatible/cesium-version.js", //cesium版本兼容处理
  "mars3d/plugins/compatible/cesium-when.js",

  "turf/turf.min.js",
  "mars3d/mars3d.css", //mars3d
  "mars3d/mars3d.js", 
  "mars3d/plugins/supermap/mars3d-supermap.js",//mars3d-supermap简化调用封装
],
```

 
#### 此方式的特别说明
 不是所有功能都可以正常用，因为：

- 使用的是超图版Cesium，所以mars3d-cesium的所有修改都无效，影响到wfs、模型编辑、地形编辑等功能(可以用超图的相关API来替代实现)
- 超图Cesium修改了地球的半径参数(Cesium.Ellipsoid.WGS84值不同，原生Cesium是椭球，超图是圆球)，造成3dtiles加载位置偏差很大。 


  

## mars3d-supermap插件源码
可以访问：[https://github.com/marsgis/mars3d-plugin](https://github.com/marsgis/mars3d-plugin/)



## Mars3D 是什么 
>  `Mars3D平台` 是[火星科技](http://marsgis.cn/)研发的一款基于 WebGL 技术实现的三维客户端开发平台，基于[Cesium](https://cesium.com/cesiumjs/)优化提升与B/S架构设计，支持多行业扩展的轻量级高效能GIS开发平台，能够免安装、无插件地在浏览器中高效运行，并可快速接入与使用多种GIS数据和三维模型，呈现三维空间的可视化，完成平台在不同行业的灵活应用。

 > Mars3D平台可用于构建无插件、跨操作系统、 跨浏览器的三维 GIS 应用程序。平台使用 WebGL 来进行硬件加速图形化，跨平台、跨浏览器来实现真正的动态大数据三维可视化。通过 Mars3D产品可快速实现浏览器和移动端上美观、流畅的三维地图呈现与空间分析。

### 相关网站 
- Mars3D官网：[http://mars3d.cn](http://mars3d.cn)  

- Mars3D开源项目列表：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)


## 版权说明
1. Mars3D平台由[火星科技](http://marsgis.cn/)自主研发，拥有所有权利。
2. 任何个人或组织可以在遵守相关要求下可以免费无限制使用。

