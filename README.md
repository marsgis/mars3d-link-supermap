# Mars3D兼容使用超图平台示例

 我们认为，三维SDK平台不是零和游戏，欢迎结合各平台优点，来实现自己的项目需求。该仓库主要实现的就是使用[超图版Cesium库](http://support.supermap.com.cn:8090/webgl/index.html)（替换原生Cesium）和 [Mars3D](http://cesium.marsgis.cn)结合来实现项目需求。


 该项目运行后效果是传统模式Web前端技术栈下的一个具备widget基础功能的[Mars3D](http://cesium.marsgis.cn)应用的三维地球项目模版。
   

  其他技术栈，请参考 [Mars3D开源导航](https://github.com/marsgis/MarsGIS-for-Cesium)
 

## 超图版Cesium库整理及修改说明
 将超图版Cesium库的`\Build\Cesium\`目录拷贝到 `lib\cesiumjs\`目录下,并将此`Cesium`改名为`Cesium-supermap`；
 


## 使用说明
 在任意开发编辑器（如vscode等）或http服务器(如node、nginx、tomcat、IIS等)下直接运行浏览index.html即可



### 压缩及混淆
 build整站压缩及混淆：[https://github.com/muyao1987/web-dist](https://github.com/muyao1987/web-dist)

 
## 运行效果 
 [在线Demo](http://cesium.marsgis.cn/project/supermap/index.html)  

 ![image](http://cesium.marsgis.cn/project/img/supermap.jpg)
 
 [更多项目体验](http://cesium.marsgis.cn/project.html)

 
 

## 项目说明
 1. 该项目与 Mars3D基础项目 的目录和文件完全相同，这是Mars3D基础项目的简化开源版本，可以直接复制到该目录下进行更新。
  * 覆盖说明: 可以将交付版本基础项目内 lib 和 widgets 目录除`widgets\toolBarRight\widget.js`和`lib\include-lib.js`后直接覆盖至当前项目中。

 2. 该项目主要目的是提供已有超图iServer授权的组织参考使用（**超图与Mars3D不冲突，可以结合使用**）。

 
 ## 版权说明
1. 当前[Mars3D](http://cesium.marsgis.cn)免费版本（即`lib/cesiumjs/mars3d/`）可以免费无限制使用.
2. 如有更高需求或商业应用，请联系购买[火星科技](http://cesium.marsgis.cn)进行SDK授权(去除logo、添加授权信息等)。 