<p align="center">
<img src="https://mars3d.cn/logo.png" width="300px" />
</p>

<p align="center">Mars3d development template based on Hypergraph+Vue</p>

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
 
   🌎 Mars3D platform, the simplest application project template under the `Hypergraph +Vue technology stack`,based on vueCli 4.x

 Mars3d supports compatible use in combination with `various platforms related to cesium`, which is convenient to meet various project requirements by combining the advantages of different platforms.
 
   This warehouse is the simplest application project template of mars3d platform under [the hypergraphic cesium library technology stack](http://support.supermap.com.cn:8090/webgl/index.html).

 > Hypergraph function example, please refer to： [https://github.com/marsgis/mars3d-link-supermap](https://github.com/marsgis/mars3d-link-supermap)

 > For other technology stacks, please refer to： [https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)



  
## Run the command
 
### Install dependencies before first run
 `npm install` or `cnpm install`
 
### http run project
 `npm run serve` after run access：`http://localhost:3001/` 

### Package and compile project
 Run `npm run build` to build the project.

## Operation effect  
 [online Demo](http://mars3d.cn/project/vue-template/)  

 ![image](http://mars3d.cn/project/vue-template/screenshot.jpg)
 

  
## How to integrate into your existing projects

1. ### Install mars3d dependency package
```bash
npm install mars3d   //or  cnpm install mars3d   or  yarn add mars3d
npm install mars3d-supermap
```
 
2. ### Copy files
 > Scene profile：`public\config\config.json`
 
 > Cesium library files：`public\lib`, It is recommended to download the latest cesium overlay to `public\lib\Cesium-supermap`

 > Component definition file：`src\components\mars3d\Map.vue`

 
4. ### Create the earth 
 Refer to the `src\views\Index.vue` file to introduce the Map component and construct the creation of the earth, focusing on the following code
```js
<Map :url="configUrl" @onload="onMapload" />

import Map from '../components/mars3d/Map.vue'
```
  


## Whiat is Mars3D 
>  `Mars3D platform` is [Mars technology](http://marsgis.cn/) a 3D client development platform based on WebGL technology, which is based on [Cesium](https://cesium.com/cesiumjs/) optimization and B / S architecture design,The lightweight and efficient GIS development platform supporting multi industry expansion can run efficiently in the browser without installation and plug-ins, and can quickly access and use a variety of GIS data and three-dimensional models, present the visualization of three-dimensional space, and complete the flexible application of the platform in different industries.

 > Mars3d platform can be used to build 3D GIS applications without plug-ins, across operating systems and across browsers. The platform uses WebGL for hardware accelerated graphics, and realizes real dynamic big data 3D visualization across platforms and browsers. The Mars3D product can quickly realize beautiful and smooth 3D map presentation and spatial analysis on browsers and mobile terminals.

### Related websites 
- Mars3D official website：[http://mars3d.cn](http://mars3d.cn)  

- GitHub navigation list：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)


## Copyright notice
1. Any `individual or organization` can use it `free and unrestricted` in compliance with the relevant requirements of mars3d.
2. If you need personalized customization, please contact [Mars technology](http://mars3d.cn) to pay for relevant services.