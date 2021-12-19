 
<p align="center">
<img src="https://cdn.jsdelivr.net/gh/muyao1987/cdn/mars3d.cn/logo.png" width="300px" />
</p>

<p align="center">超图 + Mars3D 结合使用的🌎Vue2最简项目模板</p>

<p align="center">
<a target="_black" href="https://github.com/marsgis/mars3d">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/marsgis/mars3d?style=flat&logo=github">
</a>
<a target="_black" href="https://www.npmjs.com/package/mars3d">
<img alt="Npm downloads" src="https://img.shields.io/npm/dt/mars3d?style=flat&logo=npm">
</a>
<a target="_black" href="https://www.npmjs.com/package/mars3d">
<img alt="Npm version" src="https://img.shields.io/npm/v/mars3d.svg?style=flat&logo=npm&label=version"/>
</a>
</p> 


 [**English**](./README_EN.md) |[**中文**](./README.md) 
 
   🌎 Mars3D平台，在`超图 +Vue技术栈下`的最简的应用项目模版，基于vueCli 4.x 

  Mars3D支持结合`Cesium相关的各类平台`来兼容使用，方便结合不同平台的优点来达到完成各种项目需求。
 

   本仓库是Mars3D平台，在[超图版Cesium库](http://support.supermap.com.cn:8090/webgl/index.html)技术栈下的最简的应用项目模版。

 > 超图功能示例，请参考： [mars3d-sm-example](../mars3d-sm-example/)





  
## 运行命令
 
### 首次运行前安装依赖
 `npm install` 或 `cnpm install`
 
### http运行项目
 `npm run serve`  运行后访问：`http://localhost:3001/` 

### 打包编译项目
 运行`npm run build`来构建项目。 

## 运行效果 
 [在线Demo](http://mars3d.cn/project/vue-template/)  

 ![image](http://mars3d.cn/project/vue-template/screenshot.jpg)
 

  
## 如何集成到自己已有的项目中

1. ### 安装mars3d依赖包
```bash
npm install mars3d   //或  cnpm install mars3d   或  yarn add mars3d
npm install mars3d-supermap
```
 
2. ### 拷贝文件
 > 场景配置文件：`public\config\config.json`
 
 > Cesium库文件：`public\lib`，建议通过超图官网下载最新Cesium覆盖至`public\lib\Cesium-supermap` 【或者当前项目中拷贝】

 > 组件定义文件：`src\components\mars3d\Map.vue`

 
4. ### 创建地球 
 参考 `src\views\Index.vue`文件引入Map组件和构造创建地球，主要关注下下面代码处
```js
<Map :url="configUrl" @onload="onMapload" />

import Map from '../components/mars3d/Map.vue'
```
  


## Mars3D 是什么 
>  `Mars3D平台` 是[火星科技](http://marsgis.cn/)研发的一款基于 WebGL 技术实现的三维客户端开发平台，基于[Cesium](https://cesium.com/cesiumjs/)优化提升与B/S架构设计，支持多行业扩展的轻量级高效能GIS开发平台，能够免安装、无插件地在浏览器中高效运行，并可快速接入与使用多种GIS数据和三维模型，呈现三维空间的可视化，完成平台在不同行业的灵活应用。

 > Mars3D平台可用于构建无插件、跨操作系统、 跨浏览器的三维 GIS 应用程序。平台使用 WebGL 来进行硬件加速图形化，跨平台、跨浏览器来实现真正的动态大数据三维可视化。通过 Mars3D产品可快速实现浏览器和移动端上美观、流畅的三维地图呈现与空间分析。

### 相关网站 
- Mars3D官网：[http://mars3d.cn](http://mars3d.cn)  

- Mars3D开源项目列表：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)


## 版权说明
1. Mars3D平台由[火星科技](http://marsgis.cn/)自主研发，拥有所有权利。
2. 任何个人或组织可以在遵守相关要求下可以免费无限制使用。
