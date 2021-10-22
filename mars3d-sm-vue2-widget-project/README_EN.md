<p align="center">
<img src="https://mars3d.cn/logo.png" width="300px" />
</p>

<p align="center">Mars3d widget project template based on Vue version</p>

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

   🌎 Mars3d platform, the project template of widget mode under `Vue technology stack`, based on vuecli 4. X.
     

 > For other technology stacks, please refer to： [https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)
 
  
## Project description
1. Some third-party libraries are not imported in NPM mode, but in static resource mode in the homepage head. Resources are placed in the public directory. 

2. The files in the public directory are exactly the same as the directories and files of `the mars3d basic project`, and can be directly copied to this directory for updating.

3. The widgets directory under public is some widget modules written in the previous traditional JS method. At present, it is not rewritten as Vue. At present, it is introduced statically for compatibility.  
  For newly developed business functions, please write them in Vue mode in SRC directory instead of using the original widget mode.
 
### Update project
 Class libraries and widgets in this scaffold are not guaranteed to be the latest version
 Please copy the config, img, lib and widgets directories of "the basic project" and overwrite them in the public directory of the current project



## Run command
 
### Install dependencies before first run
 `npm install` or `cnpm install`
 
### http run project
 `npm run serve` after run access：`http://localhost:3001/` 

### Package and compile project
 Run `npm run build` to build the project.



## Operation effect
 [online Demo](http://mars3d.cn/project/jcxm/)  

 ![image](http://mars3d.cn/img/jcxm.jpg)
 

 
 

## What is Mars3D
>  `Mars3D platform` is [Mars technology](http://marsgis.cn/) a 3D client development platform based on WebGL technology, which is based on [Cesium](https://cesium.com/cesiumjs/) optimization and B / S architecture design,The lightweight and efficient GIS development platform supporting multi industry expansion can run efficiently in the browser without installation and plug-ins, and can quickly access and use a variety of GIS data and three-dimensional models, present the visualization of three-dimensional space, and complete the flexible application of the platform in different industries.

 > Mars3d platform can be used to build 3D GIS applications without plug-ins, across operating systems and across browsers. The platform uses WebGL for hardware accelerated graphics, and realizes real dynamic big data 3D visualization across platforms and browsers. The Mars3D product can quickly realize beautiful and smooth 3D map presentation and spatial analysis on browsers and mobile terminals.

### Related websites 
- Mars3D official website：[http://mars3d.cn](http://mars3d.cn)  

- GitHub navigation lis：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)


## Copyright notice
1. Any `individual or organization` can use it `free and unrestricted` in compliance with the relevant requirements of mars3d.
2. If you need personalized customization, please contact [Mars technology](http://mars3d.cn) to pay for relevant services.