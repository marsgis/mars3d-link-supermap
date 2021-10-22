# Mars3D最简项目模版 - 超图版

<p>
<a target="_black" href="https://github.com/marsgis/mars3d">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/marsgis/mars3d?style=flat&logo=github">
</a>
<a target="_black" href="https://github.com/marsgis/mars3d">
<img alt="GitHub forks" src="https://img.shields.io/github/forks/marsgis/mars3d?style=flat&logo=github">
</a>
<a target="_black" href="https://www.npmjs.com/package/mars3d">
<img alt="Npm downloads" src="https://img.shields.io/npm/dt/mars3d?style=flat&logo=npm">
</a>
<a target="_black" href="https://www.npmjs.com/package/mars3d">
<img alt="Npm version" src="https://img.shields.io/npm/v/mars3d.svg?style=flat&logo=npm&label=version"/>
</a>
</p>

  Mars3D支持结合`Cesium相关的各类平台`来兼容使用，方便结合不同平台的优点来达到完成各种项目需求。
  
  本仓库是Mars3D平台，在[超图版Cesium库](http://support.supermap.com.cn:8090/webgl/index.html)技术栈下的最简的应用项目模版。

 > 其他技术栈，请参考： [https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)
 

 
## 运行站点
 在任意开发编辑器（如vscode等）或http服务器(如node、nginx、tomcat、IIS等)下直接运行浏览 `example\a10_createMap_viewer.html` 等示例页面即可
 


## 压缩及混淆
 如果需要编译、对整站压缩及混淆，请参考：[https://github.com/muyao1987/web-dist](https://github.com/muyao1987/web-dist)

 
 
### 超图版Cesium库整理及修改说明
1. 将超图版Cesium库的`\Build\Cesium\`目录拷贝到 `lib\`目录下,并将此`Cesium`改名为`Cesium-supermap`；
2. 修改`lib\include-lib.js`文件的`mars3d`节点配置，将相关库切换到`Cesium-supermap`
```js
'mars3d': [
    //超图版本，三维地球“主库” 
    libpath_local + 'Cesium-supermap/Widgets/widgets.css', //cesium  
    libpath_local + 'Cesium-supermap/Cesium.js',
    libpath + 'mars3d/plugins/compatible/cesium-version.js', //cesium版本兼容处理
    libpath + 'mars3d/mars3d.css', //mars3d
    libpath + 'mars3d/mars3d.js',
    libpath + 'mars3d/plugins/supermap/mars3d-supermap.js', 
    libpath + 'mars3d/plugins/compatible/cesium-zh.js',
  ],
``` 
3. 更多示例，请从 [https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d) 中拷贝即可,2个仓库目录结构是一致的。
 


## Mars3D 是什么 
>  `Mars3D平台` 是[火星科技](http://marsgis.cn/)研发的一款基于 WebGL 技术实现的三维客户端开发平台，基于[Cesium](https://cesium.com/cesiumjs/)优化提升与B/S架构设计，支持多行业扩展的轻量级高效能GIS开发平台，能够免安装、无插件地在浏览器中高效运行，并可快速接入与使用多种GIS数据和三维模型，呈现三维空间的可视化，完成平台在不同行业的灵活应用。

 > Mars3D平台可用于构建无插件、跨操作系统、 跨浏览器的三维 GIS 应用程序。平台使用 WebGL 来进行硬件加速图形化，跨平台、跨浏览器来实现真正的动态大数据三维可视化。通过 Mars3D产品可快速实现浏览器和移动端上美观、流畅的三维地图呈现与空间分析。

### 相关网站 
- Mars3D官网：[http://mars3d.cn](http://mars3d.cn)  

- GitHub导航列表：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)


## 版权说明
1. 任何`个人或组织`可以在遵守Mars3D相关要求下`免费无限制`使用。

